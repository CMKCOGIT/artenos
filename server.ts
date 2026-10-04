import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import { createClient } from '@supabase/supabase-js';
import crypto from 'node:crypto';
import dotenv from 'dotenv';
import { logger } from './src/lib/logger';
import { serverEnv, publicEnv } from './src/lib/env';

// Carrega variáveis do arquivo .env no processo Node
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Instância segura do Supabase com service_role (USADA APENAS NO SERVIDOR)
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || serverEnv?.SUPABASE_SERVICE_ROLE_KEY || '';
const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || publicEnv.NEXT_PUBLIC_SUPABASE_URL;

const supabaseAdmin = serviceRoleKey && supabaseUrl
  ? createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

/**
 * 1. Webhook Seguro do Mercado Pago com validação criptográfica de assinatura
 */
app.post('/api/webhooks/mercadopago', async (req: Request, res: Response) => {
  const signature = req.headers['x-signature'] as string;
  const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET || '';

  // Validação de assinatura se segredo estiver configurado
  if (webhookSecret && signature) {
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
      logger.error('Erro ao verificar assinatura do webhook:', logger.sanitizeError(err));
      return res.status(400).json({ error: 'Falha na validação' });
    }
  }

  // Idempotência e registro em payment_webhook_events
  if (supabaseAdmin && req.body?.data?.id) {
    try {
      await supabaseAdmin.from('payment_webhook_events').insert({
        gateway_name: 'mercadopago',
        gateway_event_id: String(req.body.id || req.body.data.id),
        event_type: req.body.type || 'payment.updated',
        signature_valid: Boolean(webhookSecret && signature),
        payload: req.body,
      });

      // Atualiza pagamento se for aprovação
      if (req.body.action === 'payment.created' || req.body.type === 'payment') {
        const paymentId = req.body.data.id;
        await supabaseAdmin
          .from('payments')
          .update({ status: 'approved', paid_at: new Date().toISOString() })
          .eq('gateway_payment_id', paymentId);
      }
    } catch (err: any) {
      logger.error('Erro ao processar evento de pagamento:', logger.sanitizeError(err));
    }
  }

  return res.status(200).json({ received: true });
});

/**
 * 2. Geração de URLs Assinadas para Anexos Privados do Chat (Bucket chat-attachments)
 */
app.post('/api/chat/signed-url', async (req: Request, res: Response) => {
  const { path } = req.body;
  if (!path) {
    return res.status(400).json({ error: 'Caminho do arquivo obrigatório' });
  }

  if (!supabaseAdmin) {
    return res.status(500).json({ error: 'Serviço de storage não inicializado no servidor' });
  }

  try {
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
 * 3. Log de Auditoria Seguro (Registrado no servidor sem expor service_role no cliente)
 */
app.post('/api/audit', async (req: Request, res: Response) => {
  const { actorId, action, entityType, entityId, metadata } = req.body;

  if (!action || !entityType) {
    return res.status(400).json({ error: 'Dados insuficientes para auditoria' });
  }

  if (supabaseAdmin) {
    try {
      await supabaseAdmin.from('audit_logs').insert({
        actor_id: actorId || null,
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

  app.listen(PORT, () => {
    logger.info(`Servidor Artenós rodando com segurança na porta ${PORT}`);
  });
}

startServer();
