/**
 * Configurações da Plataforma Artenós
 * Preparada para transição transparente entre o estado de pré-conexão e a conexão Supabase.
 */

export const APP_CONFIG = {
  appName: 'Artenós',
  tagline: 'O Marketplace do Artesanato Autêntico Brasileiro',
  version: '1.0.0-frontend-clean',
  platformFeePercent: 10,
  assistedSignupWhatsApp: '5511999999999',
  supportEmail: 'contato@artenos.com.br',
  isDatabaseConnected: false,
  statusMessage: 'Esta funcionalidade será ativada após a conexão com o Supabase.',
} as const;
