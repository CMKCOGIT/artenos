export interface StructuralCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  iconName: string;
  itemCount: number; // Inicialmente 0 produtos cadastrados
}

export const structuralCategories: StructuralCategory[] = [
  {
    id: 'cat-ceramica',
    name: 'Cerâmica & Barro',
    slug: 'ceramica-e-barro',
    description: 'Vasos, louças utilitárias vitrificadas e esculturas modeladas em torno manual ou argila regional.',
    iconName: 'Sparkles',
    itemCount: 0,
  },
  {
    id: 'cat-renda',
    name: 'Renda & Bordado',
    slug: 'renda-e-bordado',
    description: 'Renda de bilro, bordado filé alagoano, ponto cruz, richelieu e bastidores decorativos.',
    iconName: 'Feather',
    itemCount: 0,
  },
  {
    id: 'cat-fibras',
    name: 'Fibras Naturais & Palha',
    slug: 'fibras-naturais',
    description: 'Cestarias trançadas em palha de carnaúba, buriti, taboa, tucum e o clássico capim dourado.',
    iconName: 'Wheat',
    itemCount: 0,
  },
  {
    id: 'cat-madeira',
    name: 'Madeira & Marcenaria',
    slug: 'madeira-e-marcenaria',
    description: 'Esculturas entalhadas em madeira maciça reaproveitada, gamelas, cuias e utilitários orgânicos.',
    iconName: 'Hammer',
    itemCount: 0,
  },
  {
    id: 'cat-tecelagem',
    name: 'Tecelagem & Tear',
    slug: 'tecelagem-e-tear',
    description: 'Mantas, redes artesanais, passadeiras e xales tecidos em tear de pedal ou de mesa com algodão cru.',
    iconName: 'Layers',
    itemCount: 0,
  },
  {
    id: 'cat-biojoias',
    name: 'Biojoias & Acessórios',
    slug: 'biojoias-e-acessorios',
    description: 'Acessórios criados com sementes amazônicas de açaí e jarina, prata brasileira e capim dourado.',
    iconName: 'Gem',
    itemCount: 0,
  },
  {
    id: 'cat-macrame',
    name: 'Macramê & Nós',
    slug: 'macrame-e-nos',
    description: 'Painéis murais, hangers botânicos para plantas e peças decorativas em nós e cordões de algodão.',
    iconName: 'Anchor',
    itemCount: 0,
  },
];
