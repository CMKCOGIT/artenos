import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';
import { logger } from './src/lib/logger';
import { serverEnv } from './src/lib/server-env';

const app = express();
const PORT = Number(serverEnv.PORT) || 3000;

app.use(express.json());

// Instância segura do Supabase com service_role (USADA EXCLUSIVAMENTE NO SERVIDOR)
const supabaseAdmin = serverEnv.SUPABASE_SERVICE_ROLE_KEY && serverEnv.SUPABASE_URL
  ? createClient(serverEnv.SUPABASE_URL, serverEnv.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

/**
 * Middleware para validar JWT do Supabase Auth
 */
async function authenticateUser(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token de autenticação não fornecido' });
  }

  const token = authHeader.replace('Bearer ', '').trim();
  if (!supabaseAdmin) {
    return res.status(503).json({ error: 'Servidor Supabase não configurado' });
  }

  try {
    const { data: { user }, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !user) {
      return res.status(401).json({ error: 'Sessão inválida ou expirada' });
    }

    (req as any).user = user;
    next();
  } catch (err: any) {
    return res.status(401).json({ error: 'Falha na validação do token' });
  }
}

/**
 * 1. Webhook Seguro do Mercado Pago com validação criptográfica de assinatura e consulta à API
 */
app.post('/api/webhooks/mercadopago', async (req: Request, res: Response) => {
  const signature = req.headers['x-signature'] as string;
  const webhookSecret = serverEnv.MERCADOPAGO_WEBHOOK_SECRET;

  // A ausência do segredo ou da assinatura DEVE resultar em rejeição estrita
  if (!webhookSecret || !signature) {
    logger.warn('Webhook rejeitado: segredo ou assinatura ausente.');
    return res.status(401).json({ error: 'Assinatura ou segredo de webhook não configurado' });
  }

  try {
    const parts = signature.split(',');
    let ts = '';
    let hash = '';
    for (const part of parts) {
      const [k, v] = part.split('=');
      if (k === 'ts') ts = v;
      if (k === 'v1') hash = v;
    }

    const manifest = `id:${req.body?.data?.id};request-id:${req.headers['x-request-id']};ts:${ts};`;
    const expectedHash = crypto.createHmac('sha256', webhookSecret).update(manifest).digest('hex');

    if (expectedHash !== hash) {
      logger.warn('Assinatura do webhook inválida.');
      return res.status(401).json({ error: 'Assinatura inválida' });
    }
  } catch (err: any) {
    logger.error('Erro na validação criptográfica do webhook:', logger.sanitizeError(err));
    return res.status(400).json({ error: 'Falha na validação da assinatura' });
  }

  // Idempotência e conferência do pagamento no gateway
  if (supabaseAdmin && req.body?.data?.id) {
    const eventId = String(req.body.id || req.body.data.id);
    
    // Verifica evento já processado (idempotência)
    const { data: existingEvent } = await supabaseAdmin
      .from('payment_webhook_events')
      .select('id')
      .eq('gateway_event_id', eventId)
      .maybeSingle();

    if (existingEvent) {
      return res.status(200).json({ received: true, note: 'Evento já processado anteriormente' });
    }

    // Registra evento
    await supabaseAdmin.from('payment_webhook_events').insert({
      gateway_name: 'mercadopago',
      gateway_event_id: eventId,
      event_type: req.body.type || 'payment.updated',
      signature_valid: true,
      payload: req.body,
    });

    // Se houver access token real, consulta pagamento na API antes de aprovar
    if (serverEnv.MERCADOPAGO_ACCESS_TOKEN && req.body.data?.id) {
      try {
        const mpRes = await fetch(`https://api.mercadopago.com/v1/payments/${req.body.data.id}`, {
          headers: { Authorization: `Bearer ${serverEnv.MERCADOPAGO_ACCESS_TOKEN}` }
        });
        if (mpRes.ok) {
          const mpData = await mpRes.json();
          if (mpData.status === 'approved') {
            await supabaseAdmin
              .from('payments')
              .update({ status: 'approved', paid_at: new Date().toISOString() })
              .eq('gateway_payment_id', String(req.body.data.id));
          }
        }
      } catch (err: any) {
        logger.error('Erro ao consultar gateway Mercado Pago:', logger.sanitizeError(err));
      }
    }
  }

  return res.status(200).json({ received: true });
});

/**
 * 2. Geração de URLs Assinadas para Anexos Privados do Chat (PROTEGIDO POR AUTH)
 */
app.post('/api/chat/signed-url', authenticateUser, async (req: Request, res: Response) => {
  const { path } = req.body;
  const user = (req as any).user;

  if (!path) {
    return res.status(400).json({ error: 'Caminho do anexo obrigatório' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Serviço de storage indisponível' });
  }

  try {
    // Valida que o anexo pertence a uma conversa do usuário chamador ou que o usuário é admin
    const { data: attachment } = await supabaseAdmin
      .from('message_attachments')
      .select('id, uploader_id, message_id')
      .eq('storage_path', path)
      .maybeSingle();

    if (attachment && attachment.uploader_id !== user.id) {
      // Confere se é participante da conversa
      const { data: profile } = await supabaseAdmin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        // Verifica vínculo na conversa
        const { data: msg } = await supabaseAdmin
          .from('messages')
          .select('conversation_id')
          .eq('id', attachment.message_id)
          .single();

        if (msg) {
          const { data: conv } = await supabaseAdmin
            .from('conversations')
            .select('client_id, artisan_id')
            .eq('id', msg.conversation_id)
            .single();

          if (conv && conv.client_id !== user.id && conv.artisan_id !== user.id) {
            return res.status(403).json({ error: 'Acesso negado a este anexo privado' });
          }
        }
      }
    }

    const { data, error } = await supabaseAdmin.storage
      .from('chat-attachments')
      .createSignedUrl(path, 3600); // 1 hora de validade

    if (error || !data) {
      return res.status(404).json({ error: 'Arquivo não encontrado' });
    }

    return res.json({ signedUrl: data.signedUrl });
  } catch (err: any) {
    logger.error('Erro ao gerar URL assinada:', logger.sanitizeError(err));
    return res.status(500).json({ error: 'Falha interna' });
  }
});

/**
 * 3. Log de Auditoria Seguro (PROTEGIDO POR AUTH)
 */
app.post('/api/audit', authenticateUser, async (req: Request, res: Response) => {
  const { action, entityType, entityId, metadata } = req.body;
  const user = (req as any).user;

  if (!action || !entityType) {
    return res.status(400).json({ error: 'Dados insuficientes para auditoria' });
  }

  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('audit_logs').insert({
        actor_id: user.id,
        action,
        entity_type: entityType,
        entity_id: entityId || null,
        metadata: metadata || {},
      });
    } catch (err: any) {
      logger.error('Erro ao registrar auditoria:', logger.sanitizeError(err));
    }
  }

  return res.status(200).json({ success: true });
});

/**
 * Inicialização com Vite Middleware para Desenvolvimento e Produção
 */
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static('dist'));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile('dist/index.html', { root: '.' });
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info(`Servidor Artenós inicializado com segurança na porta ${PORT}`);
  });
}

startServer();
