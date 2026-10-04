/**
 * Módulos Funcionais da Plataforma Artenós
 *
 * Mapeamento das 4 grandes jornadas independentes:
 * 1. Marketplace Público (Cliente / Comprador)
 * 2. Painel da Artesã (Atelier, Catálogo, Precificação e Splits)
 * 3. Portal de Fornecedores B2B (Materiais, Insumos e Cotações)
 * 4. Governança e Administração (Curadoria, Splits e Auditoria)
 */

export const FEATURES = {
  customer: {
    name: 'Marketplace do Artesanato',
    routes: ['/', '/produtos', '/categorias', '/carrinho', '/checkout', '/favoritos', '/meus-pedidos', '/mensagens', '/perfil'],
  },
  artisan: {
    name: 'Painel da Artesã',
    routes: [
      '/artesa/dashboard',
      '/artesa/produtos',
      '/artesa/produtos/novo',
      '/artesa/pedidos',
      '/artesa/estoque',
      '/artesa/precificacao',
      '/artesa/mensagens',
      '/artesa/financeiro',
      '/artesa/perfil',
    ],
  },
  supplier: {
    name: 'Portal do Fornecedor B2B',
    routes: [
      '/fornecedor/dashboard',
      '/fornecedor/materiais',
      '/fornecedor/materiais/novo',
      '/fornecedor/solicitacoes',
      '/fornecedor/orcamentos',
      '/fornecedor/perfil',
    ],
  },
  admin: {
    name: 'Administração e Governança',
    routes: [
      '/admin',
      '/admin/usuarios',
      '/admin/artesas',
      '/admin/fornecedores',
      '/admin/produtos',
      '/admin/pedidos',
      '/admin/configuracoes',
    ],
  },
} as const;
