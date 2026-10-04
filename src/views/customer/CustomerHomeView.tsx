import React, { useState } from 'react';
import {
  Search,
  Sparkles,
  ArrowRight,
  Heart,
  MessageSquare,
  Package,
  ShieldCheck,
  Check,
  Store,
  Factory,
  ChevronRight,
  Compass,
} from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { structuralCategories } from '../../data/categoriesData';

export const CustomerHomeView: React.FC = () => {
  const {
    products,
    artisans,
    navigate,
    setSelectedProduct,
    addToCart,
    startChatWithArtisan,
    toggleFavorite,
    isFavorite,
    setCurrentRole,
    submitCustomRequest,
    setIsOnboardingOpen,
  } = useMarketplace();

  const [searchQuery, setSearchQuery] = useState('');
  const [customDesc, setCustomDesc] = useState('');
  const [customDim, setCustomDim] = useState('');
  const [customCol, setCustomCol] = useState('Terracota e Cru');
  const [customFeedback, setCustomFeedback] = useState('');

  const featuredProducts = products.slice(0, 4);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      navigate('/produtos');
      return;
    }
    navigate(`/produtos?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customDesc.trim()) return;

    submitCustomRequest({
      clientName: 'Comprador Artenós',
      clientContact: 'contato@artenos.com.br',
      description: customDesc,
      dimensions: customDim || 'Sob consulta com artesã',
      color: customCol,
    });

    setCustomDesc('');
    setCustomDim('');
  };

  return (
    <div className="space-y-16 pb-12">
      {/* 1. Hero Section - Warm, Clean & Airy Editorial Design */}
      <section className="bg-[#FAF7F2] border-b border-[#EADBCC] pt-12 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          {/* Subtle Platform Tour Trigger */}
          <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#E0D4C5] shadow-2xs mb-6 text-xs text-[#5C4A3E]">
            <span className="w-2 h-2 rounded-full bg-[#8E3E19]" />
            <span className="font-medium">Novo na Artenós?</span>
            <button
              onClick={() => setIsOnboardingOpen(true)}
              className="text-[#8E3E19] font-bold hover:underline inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Ver tour interativo</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold font-serif tracking-tight text-[#2D241E] leading-tight mb-4">
            Artesanato autêntico direto de quem cria
          </h1>
          <p className="text-sm sm:text-base text-[#6B5A4E] max-w-2xl mx-auto font-normal leading-relaxed mb-8">
            Conectamos você às maiores mestras artesãs do Brasil, sem intermediários. Peças com história, alma e garantia de pagamento seguro.
          </p>

          {/* Clean Search Input */}
          <form
            onSubmit={handleSearchSubmit}
            className="max-w-2xl mx-auto bg-white p-2 rounded-2xl shadow-xs border border-[#D9CDBF] flex items-center gap-2 mb-4"
          >
            <div className="flex-1 flex items-center gap-3 px-3">
              <Search className="w-5 h-5 text-[#8E3E19] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Busque por peças ou técnicas: amigurumi, cerâmica, macramê, bastidor..."
                className="w-full bg-transparent text-xs sm:text-sm text-[#2D241E] placeholder-[#8C7667] focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-[#8E3E19] hover:bg-[#733113] text-white text-xs font-bold px-5 py-2.5 rounded-xl transition-colors cursor-pointer shrink-0 shadow-2xs"
            >
              Buscar
            </button>
          </form>

          {/* Quick Filter Tags */}
          <div className="flex items-center justify-center gap-2 text-xs text-[#735F52] flex-wrap pt-1">
            <span className="font-semibold text-[#4A3B32]">Sugestões:</span>
            {['Cerâmica & Barro', 'Renda & Bordado', 'Fibras Naturais & Palha', 'Macramê & Nós'].map((cat, idx) => (
              <React.Fragment key={cat}>
                {idx > 0 && <span aria-hidden="true" className="text-[#C9BDB0]">·</span>}
                <button
                  onClick={() => navigate(`/produtos?categoria=${encodeURIComponent(cat)}`)}
                  className="hover:text-[#8E3E19] cursor-pointer underline-offset-4 hover:underline"
                >
                  {cat}
                </button>
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* 3 Value Commitments */}
        <div className="max-w-4xl mx-auto mt-12 pt-8 border-t border-[#EADBCC] grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left">
          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-8 h-8 rounded-full bg-[#8E3E19]/10 text-[#8E3E19] flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2D241E]">100% Feito à Mão</h4>
              <p className="text-[11px] text-[#735F52]">Peças autênticas com alma brasileira</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-8 h-8 rounded-full bg-[#8E3E19]/10 text-[#8E3E19] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2D241E]">Split Ético de 90%</h4>
              <p className="text-[11px] text-[#735F52]">Remuneração justa direta para a artesã</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center sm:justify-start">
            <div className="w-8 h-8 rounded-full bg-[#8E3E19]/10 text-[#8E3E19] flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-[#2D241E]">Chat Direto com a Autora</h4>
              <p className="text-[11px] text-[#735F52]">Personalize cores, medidas e prazos</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Categorias Artesanais Estruturais */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold font-serif text-[#2D241E]">
              Técnicas Manuais do Brasil
            </h2>
            <p className="text-xs text-[#6B5A4E]">
              Explore criações organizadas pelas ricas tradições artesanais do nosso país
            </p>
          </div>
          <button
            onClick={() => navigate('/produtos')}
            className="text-xs font-bold text-[#8E3E19] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Ver Catálogo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {structuralCategories.slice(0, 4).map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate(`/produtos?categoria=${encodeURIComponent(cat.name)}`)}
              className="bg-white p-5 rounded-2xl border border-[#E8DCCF] text-left hover:border-[#8E3E19] hover:shadow-xs transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="w-9 h-9 rounded-xl bg-[#EFE6DC] text-[#8E3E19] flex items-center justify-center mb-3">
                  <Compass className="w-4 h-4" />
                </div>
                <h3 className="font-bold text-sm text-[#2D241E] group-hover:text-[#8E3E19] transition-colors mb-1">
                  {cat.name}
                </h3>
                <p className="text-[11px] text-[#735F52] line-clamp-2 leading-relaxed">
                  {cat.description}
                </p>
              </div>
              <span className="text-[10px] font-semibold text-[#8E3E19] uppercase tracking-wider mt-3 inline-flex items-center gap-1">
                <span>Ver peças</span>
                <ArrowRight className="w-2.5 h-2.5" />
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* 3. Peças em Destaque */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E3E19] block mb-0.5">
              Vitrine
            </span>
            <h2 className="text-2xl font-bold font-serif text-[#2D241E]">
              Peças em Destaque
            </h2>
          </div>
          <button
            onClick={() => navigate('/produtos')}
            className="text-xs font-bold text-[#8E3E19] hover:underline cursor-pointer flex items-center gap-1"
          >
            <span>Ver Catálogo Completo</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {featuredProducts.length === 0 ? (
          <EmptyState
            icon={Package}
            title="Ainda não existem produtos disponíveis"
            description="Quando as primeiras mestras cadastrarem suas peças, a vitrine principal será preenchida automaticamente."
            actionText="Cadastrar Peça na Central da Artesã"
            onAction={() => setCurrentRole('artisan')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl overflow-hidden border border-[#E8DCCF] shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div
                    className="relative aspect-4/3 bg-[#F4EDE2] cursor-pointer overflow-hidden"
                    onClick={() => navigate(`/produto/${prod.id}`)}
                  >
                    <img
                      src={prod.imageUrl}
                      alt={prod.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                    {prod.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-[#8E3E19] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-md">
                        {prod.badge}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleFavorite(prod.id);
                      }}
                      className={`absolute top-2.5 right-2.5 p-1.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                        isFavorite(prod.id)
                          ? 'bg-rose-500 text-white'
                          : 'bg-white/80 text-[#8C7667] hover:text-[#8E3E19]'
                      }`}
                      title={isFavorite(prod.id) ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
                    >
                      <Heart className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  <div className="p-4 cursor-pointer" onClick={() => navigate(`/produto/${prod.id}`)}>
                    <div className="flex items-center justify-between text-[11px] text-[#735F52] mb-1">
                      <span className="truncate">{prod.artisanName}</span>
                      <span>★ {prod.rating}</span>
                    </div>
                    <h3 className="font-bold text-sm text-[#2D241E] group-hover:text-[#8E3E19] transition-colors line-clamp-1 mb-1">
                      {prod.title}
                    </h3>
                    <p className="text-xs text-[#6B5A4E] line-clamp-2">{prod.description}</p>
                  </div>
                </div>

                <div className="p-4 pt-0 border-t border-[#F4EFE8] flex items-center justify-between gap-2 mt-2">
                  <div>
                    <span className="text-[9px] uppercase font-semibold text-[#8C7667] block">Preço</span>
                    <span className="font-bold text-sm text-[#2D241E] tabular-nums">{formatCurrency(prod.priceCents)}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => startChatWithArtisan(prod)}
                      className="p-2 border border-[#D9CDBF] hover:bg-[#FAF7F2] rounded-xl text-[#8E3E19] cursor-pointer"
                      title="Conversar com a artesã"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        addToCart(prod, 1);
                        navigate('/carrinho');
                      }}
                      className="bg-[#8E3E19] hover:bg-[#733113] text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer transition-colors shadow-2xs"
                    >
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Artesãs em Foco */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 bg-[#FAF7F2] py-12 rounded-3xl border border-[#E8DCCF]">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E3E19] block mb-1">
            Mãos Criadoras
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E] mb-2">
            Mestras Artesãs do Brasil
          </h2>
          <p className="text-xs sm:text-sm text-[#6B5A4E]">
            Cada peça na Artenós carrega tempo, identidade e a vivência de uma artesã independente.
          </p>
        </div>

        {artisans.length === 0 ? (
          <EmptyState
            icon={Store}
            title="Nenhuma artesã disponível no momento"
            description="Os perfis e ateliês das artesãs brasileiras cadastradas serão exibidos nesta seção assim que a conexão com o banco for concluída."
            actionText="Abrir Atelier na Artenós"
            onAction={() => setCurrentRole('artisan')}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {artisans.slice(0, 3).map((artisan) => (
              <div
                key={artisan.id}
                className="bg-white rounded-2xl p-5 border border-[#E8DCCF] shadow-2xs flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-4/3 rounded-xl overflow-hidden mb-4 bg-[#F4EDE2]">
                    <img src={artisan.avatarUrl} alt={artisan.name} className="w-full h-full object-cover" />
                    <span className="absolute bottom-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] px-2.5 py-0.5 rounded-md">
                      {artisan.location}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-bold text-[#8E3E19]">{artisan.studioName}</span>
                    <span className="text-[#8C7667]">★ {artisan.rating}</span>
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#2D241E] mb-2">
                    {artisan.name}
                  </h3>

                  <p className="text-xs italic text-[#5C4A3E] leading-relaxed mb-4">
                    "{artisan.featuredQuote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-[#F4EFE8] flex items-center justify-between">
                  <span className="text-xs text-[#8C7667]">{artisan.totalSales} peças criadas</span>
                  <button
                    onClick={() => navigate(`/artesa/${artisan.id}`)}
                    className="text-xs font-bold text-[#8E3E19] hover:underline cursor-pointer flex items-center gap-1"
                  >
                    <span>Ver Ateliê</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 5. Perfis da Plataforma */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E8DCCF] flex flex-col justify-between">
            <div className="mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#8E3E19]/10 text-[#8E3E19] flex items-center justify-center mb-3">
                <Store className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif text-[#2D241E] mb-1">Você é uma Artesã?</h3>
              <p className="text-xs text-[#6B5A4E] leading-relaxed">
                Abra seu ateliê digital na Artenós. Tenha controle de pedidos, vitrine pública, calculadora de precificação transparente e receba 90% das vendas.
              </p>
            </div>
            <button
              onClick={() => setCurrentRole('artisan')}
              className="self-start inline-flex items-center gap-2 bg-[#8E3E19] hover:bg-[#733113] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <span>Acessar Painel da Artesã</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E8DCCF] flex flex-col justify-between">
            <div className="mb-4">
              <div className="w-9 h-9 rounded-xl bg-[#1A543E]/10 text-[#1A543E] flex items-center justify-center mb-3">
                <Factory className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold font-serif text-[#2D241E] mb-1">Você Fornece Matérias-Primas?</h3>
              <p className="text-xs text-[#6B5A4E] leading-relaxed">
                Conecte sua indústria têxtil, olaria ou distribuidora a milhares de artesãs. Venda linhas, argilas, tecidos e embalagens com pedido mínimo.
              </p>
            </div>
            <button
              onClick={() => setCurrentRole('supplier')}
              className="self-start inline-flex items-center gap-2 bg-[#1A543E] hover:bg-[#123D2C] text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              <span>Acessar Portal do Fornecedor</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Encomendas Personalizadas */}
      <section className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-8 md:p-10 border border-[#E8DCCF]">
          <div className="text-center max-w-lg mx-auto mb-6">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E3E19] block mb-1">
              Sob Medida
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E] mb-2">
              Crie uma peça só sua
            </h2>
            <p className="text-xs sm:text-sm text-[#6B5A4E]">
              Quer uma cor específica para sua sala ou um presente personalizado? Descreva sua ideia e nossas artesãs responderão com orçamento.
            </p>
          </div>

          <form onSubmit={handleCustomSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                Descrição do que você imagina *
              </label>
              <textarea
                rows={3}
                required
                value={customDesc}
                onChange={(e) => setCustomDesc(e.target.value)}
                placeholder="Ex: Gostaria de uma manta de sofá tecida em algodão cru, com detalhes em azul marinho e franjas laterais..."
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-[#D9CDBF] bg-white text-[#2D241E] placeholder-[#9C8A7C] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                  Medidas aproximadas
                </label>
                <input
                  type="text"
                  value={customDim}
                  onChange={(e) => setCustomDim(e.target.value)}
                  placeholder="Ex: 1,80m x 1,20m"
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#D9CDBF] bg-white text-[#2D241E] placeholder-[#9C8A7C] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                  Paleta de cores sugerida
                </label>
                <input
                  type="text"
                  value={customCol}
                  onChange={(e) => setCustomCol(e.target.value)}
                  placeholder="Ex: Tons terrosos, verde musgo..."
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-[#D9CDBF] bg-white text-[#2D241E] placeholder-[#9C8A7C] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-[#8E3E19] hover:bg-[#733113] text-white text-xs font-bold py-3 rounded-xl transition-colors cursor-pointer shadow-2xs"
            >
              Enviar Solicitação de Encomenda
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};
