import React, { useState } from 'react';
import { Search, Filter, Heart, MessageSquare, ShoppingBag, ArrowUpDown, Sparkles, X, Check } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';

interface CustomerProductsViewProps {
  initialCategory?: string;
}

export const CustomerProductsView: React.FC<CustomerProductsViewProps> = ({ initialCategory }) => {
  const {
    products,
    navigate,
    addToCart,
    startChatWithArtisan,
    toggleFavorite,
    isFavorite,
  } = useMarketplace();

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory || 'all');
  const [priceRange, setPriceRange] = useState<'all' | 'under100' | '100to200' | 'over200'>('all');
  const [availability, setAvailability] = useState<'all' | 'ready' | 'custom'>('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price_asc' | 'price_desc' | 'rating'>('featured');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const categories = [
    { id: 'all', label: 'Todas as Categorias', icon: '✨' },
    { id: 'Crochê & Amigurumi', label: 'Crochê & Amigurumi', icon: '🧶' },
    { id: 'Cerâmica', label: 'Cerâmica', icon: '🏺' },
    { id: 'Bordado', label: 'Bordado', icon: '🪡' },
    { id: 'Macramê', label: 'Macramê', icon: '🌾' },
  ];

  const activeFiltersCount =
    (category !== 'all' ? 1 : 0) +
    (priceRange !== 'all' ? 1 : 0) +
    (availability !== 'all' ? 1 : 0) +
    (search.trim() ? 1 : 0);

  const filteredProducts = products.filter((p) => {
    // Search filter
    const matchesSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      p.artisanName.toLowerCase().includes(search.toLowerCase()) ||
      p.materials.some((m) => m.toLowerCase().includes(search.toLowerCase()));

    // Category filter
    const matchesCat = category === 'all' || p.category.toLowerCase() === category.toLowerCase();

    // Price range
    let matchesPrice = true;
    if (priceRange === 'under100') matchesPrice = p.priceCents < 10000;
    else if (priceRange === '100to200') matchesPrice = p.priceCents >= 10000 && p.priceCents <= 20000;
    else if (priceRange === 'over200') matchesPrice = p.priceCents > 20000;

    // Availability
    let matchesAvail = true;
    if (availability === 'ready') matchesAvail = p.isReadyToShip;
    else if (availability === 'custom') matchesAvail = !p.isReadyToShip || p.isCustomizable;

    return matchesSearch && matchesCat && matchesPrice && matchesAvail;
  });

  // Sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price_asc') return a.priceCents - b.priceCents;
    if (sortBy === 'price_desc') return b.priceCents - a.priceCents;
    if (sortBy === 'rating') return b.rating - a.rating;
    return 0; // featured default
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 sm:space-y-8">
      {/* Title & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 sm:pb-6 border-b border-[#EADBCC]">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
            {category === 'all' ? 'Vitrine de Artesanato Brasileiro' : `Categoria: ${category}`}
          </h1>
          <p className="text-xs text-[#6B5A4E] mt-1">
            {sortedProducts.length} peças encontradas criadas por artesãs independentes
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-[#8C7667] absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Pesquisar por peça, material..."
            className="w-full bg-white border border-[#D9CDBF] rounded-xl pl-9 pr-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
          />
        </div>
      </div>

      {/* Mobile Horizontal Category Quick Scroll */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategory(cat.id)}
            className={`px-3 py-1.5 rounded-full whitespace-nowrap font-medium transition-colors cursor-pointer flex items-center gap-1.5 shrink-0 border ${
              category === cat.id
                ? 'bg-[#8E3E19] text-white border-[#8E3E19] shadow-2xs font-bold'
                : 'bg-white text-[#5C4A3E] border-[#E0D4C5] hover:border-[#8E3E19]'
            }`}
          >
            <span>{cat.icon}</span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>

      {/* Mobile Filter Trigger Button & Sorter Row */}
      <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-[#EADBCC] text-xs">
        <div className="flex items-center gap-2">
          {/* Mobile Filter Sheet Trigger Button (hidden on lg) */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 bg-[#FAF7F2] hover:bg-[#F2EAE0] text-[#4A3B32] border border-[#D9CDBF] px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
          >
            <Filter className="w-3.5 h-3.5 text-[#8E3E19]" />
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="bg-[#8E3E19] text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <span className="text-[#8C7667] text-[11px] sm:text-xs">
            {sortedProducts.length} itens
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <span className="text-[#5C4A3E] font-medium hidden sm:inline">Ordenar:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#FAF6F0] border border-[#D9CDBF] rounded-lg px-2 sm:px-2.5 py-1 text-[11px] sm:text-xs text-[#2D241E] focus:outline-none"
          >
            <option value="featured">Destaques</option>
            <option value="price_asc">Menor Preço</option>
            <option value="price_desc">Maior Preço</option>
            <option value="rating">Melhor Avaliados</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters (hidden on mobile, uses bottom sheet instead) */}
        <div className="hidden lg:block bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE0]">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#8E3E19]" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#2D241E]">Filtros</h3>
            </div>
            {activeFiltersCount > 0 && (
              <button
                onClick={() => {
                  setSearch('');
                  setCategory('all');
                  setPriceRange('all');
                  setAvailability('all');
                }}
                className="text-[11px] text-[#8E3E19] hover:underline font-semibold cursor-pointer"
              >
                Limpar ({activeFiltersCount})
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <label className="block text-xs font-bold text-[#3D2E24] mb-2">Técnica & Categoria</label>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center justify-between ${
                    category === cat.id
                      ? 'bg-[#F8EFE9] text-[#8E3E19] font-bold'
                      : 'text-[#5C4A3E] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div>
            <label className="block text-xs font-bold text-[#3D2E24] mb-2">Faixa de Preço</label>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'Todos os preços' },
                { id: 'under100', label: 'Até R$ 100,00' },
                { id: '100to200', label: 'R$ 100,00 a R$ 200,00' },
                { id: 'over200', label: 'Acima de R$ 200,00' },
              ].map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPriceRange(p.id as any)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    priceRange === p.id
                      ? 'bg-[#F8EFE9] text-[#8E3E19] font-bold'
                      : 'text-[#5C4A3E] hover:bg-[#FAF6F0]'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Availability */}
          <div>
            <label className="block text-xs font-bold text-[#3D2E24] mb-2">Disponibilidade</label>
            <div className="space-y-1">
              {[
                { id: 'all', label: 'Todas as peças' },
                { id: 'ready', label: 'Apenas Pronta Entrega' },
                { id: 'custom', label: 'Feito Sob Encomenda' },
              ].map((av) => (
                <button
                  key={av.id}
                  onClick={() => setAvailability(av.id as any)}
                  className={`w-full text-left text-xs px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    availability === av.id
                      ? 'bg-[#F8EFE9] text-[#8E3E19] font-bold'
                      : 'text-[#5C4A3E] hover:bg-[#FAF6F0]'
                  }`}
                >
                  {av.label}
                </button>
              ))}
            </div>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setSearch('');
              setCategory('all');
              setPriceRange('all');
              setAvailability('all');
            }}
            className="w-full text-center text-xs text-[#8C7667] hover:text-[#8E3E19] font-semibold py-1 cursor-pointer"
          >
            Limpar todos os filtros
          </button>
        </div>

        {/* Product Grid Area */}
        <div className="lg:col-span-3 space-y-4">
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-[#EADBCC]">
              <Sparkles className="w-10 h-10 text-[#C4B5A5] mx-auto mb-2" />
              <h3 className="font-serif font-bold text-base text-[#2D241E] mb-1">Nenhuma peça encontrada</h3>
              <p className="text-xs text-[#8C7667] mb-4">Tente ajustar seus filtros ou selecionar outra técnica manual.</p>
              <button
                onClick={() => {
                  setCategory('all');
                  setSearch('');
                  setPriceRange('all');
                  setAvailability('all');
                }}
                className="bg-[#8E3E19] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer"
              >
                Limpar Filtros e Ver Todas
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {sortedProducts.map((prod) => (
                <div
                  key={prod.id}
                  className="bg-white rounded-2xl overflow-hidden border border-[#EADBCC] shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
                >
                  <div>
                    <div
                      className="relative aspect-4/3 bg-[#F4EDE2] cursor-pointer overflow-hidden"
                      onClick={() => navigate(`/produto/${prod.id}`)}
                    >
                      <img
                        src={prod.imageUrl}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                      />
                      {prod.badge && (
                        <span className="absolute top-2 left-2 bg-[#8E3E19] text-white text-[9px] font-bold uppercase px-2 py-0.5 rounded-md">
                          {prod.badge}
                        </span>
                      )}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(prod.id);
                        }}
                        className={`absolute top-2 right-2 p-1.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                          isFavorite(prod.id)
                            ? 'bg-rose-500 text-white'
                            : 'bg-white/80 text-[#8C7667] hover:text-[#8E3E19]'
                        }`}
                      >
                        <Heart className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    <div className="p-3.5 sm:p-4 cursor-pointer" onClick={() => navigate(`/produto/${prod.id}`)}>
                      <div className="flex items-center justify-between text-[11px] text-[#8C7667] mb-1">
                        <span className="truncate">{prod.artisanName}</span>
                        <span>★ {prod.rating}</span>
                      </div>
                      <h3 className="font-bold text-sm text-[#2D241E] group-hover:text-[#8E3E19] transition-colors line-clamp-1 mb-1">
                        {prod.title}
                      </h3>
                      <p className="text-xs text-[#6B5A4E] line-clamp-2">{prod.description}</p>
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4 pt-0 border-t border-[#F2EAE0] flex items-center justify-between gap-2">
                    <div>
                      <span className="text-[9px] uppercase font-semibold text-[#8C7667] block">Preço</span>
                      <span className="font-bold text-sm text-[#2D241E] tabular-nums">{formatCurrency(prod.priceCents)}</span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => startChatWithArtisan(prod)}
                        className="p-2 border border-[#D9CDBF] hover:bg-[#FAF6F0] rounded-xl text-[#8E3E19] cursor-pointer"
                        title="Conversar com artesã"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          addToCart(prod, 1);
                          navigate('/carrinho');
                        }}
                        className="bg-[#8E3E19] hover:bg-[#733113] text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer"
                      >
                        Comprar
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet / Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs animate-in fade-in"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          <div className="relative w-full bg-white rounded-t-3xl shadow-2xl p-5 max-h-[85vh] overflow-y-auto space-y-5 border-t border-[#EADBCC] animate-in slide-in-from-bottom duration-250 z-10">
            <div className="flex items-center justify-between pb-3 border-b border-[#F2EAE0]">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-[#8E3E19]" />
                <h3 className="font-bold text-sm text-[#2D241E]">Filtros do Catálogo</h3>
              </div>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 rounded-lg text-[#8C7667] hover:text-[#2D241E]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Categories */}
            <div>
              <label className="block text-xs font-bold text-[#3D2E24] mb-2">Técnica Artesanal</label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setCategory(cat.id)}
                    className={`p-2.5 rounded-xl text-xs font-medium text-left border flex items-center justify-between cursor-pointer ${
                      category === cat.id
                        ? 'bg-[#F8EFE9] border-[#8E3E19] text-[#8E3E19] font-bold'
                        : 'bg-white border-[#E0D4C5] text-[#5C4A3E]'
                    }`}
                  >
                    <span className="truncate">{cat.label}</span>
                    {category === cat.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-xs font-bold text-[#3D2E24] mb-2">Faixa de Preço</label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'all', label: 'Todos os preços' },
                  { id: 'under100', label: 'Até R$ 100' },
                  { id: '100to200', label: 'R$ 100 a R$ 200' },
                  { id: 'over200', label: 'Acima de R$ 200' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPriceRange(p.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-medium text-left border flex items-center justify-between cursor-pointer ${
                      priceRange === p.id
                        ? 'bg-[#F8EFE9] border-[#8E3E19] text-[#8E3E19] font-bold'
                        : 'bg-white border-[#E0D4C5] text-[#5C4A3E]'
                    }`}
                  >
                    <span>{p.label}</span>
                    {priceRange === p.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div>
              <label className="block text-xs font-bold text-[#3D2E24] mb-2">Disponibilidade</label>
              <div className="grid grid-cols-1 gap-2">
                {[
                  { id: 'all', label: 'Todas as peças' },
                  { id: 'ready', label: 'Pronta Entrega' },
                  { id: 'custom', label: 'Feito Sob Encomenda' },
                ].map((av) => (
                  <button
                    key={av.id}
                    onClick={() => setAvailability(av.id as any)}
                    className={`p-2.5 rounded-xl text-xs font-medium text-left border flex items-center justify-between cursor-pointer ${
                      availability === av.id
                        ? 'bg-[#F8EFE9] border-[#8E3E19] text-[#8E3E19] font-bold'
                        : 'bg-white border-[#E0D4C5] text-[#5C4A3E]'
                    }`}
                  >
                    <span>{av.label}</span>
                    {availability === av.id && <Check className="w-3.5 h-3.5 shrink-0" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Apply & Reset Buttons */}
            <div className="pt-2 flex items-center gap-3">
              <button
                onClick={() => {
                  setCategory('all');
                  setPriceRange('all');
                  setAvailability('all');
                  setSearch('');
                }}
                className="w-1/3 py-3 border border-[#D9CDBF] rounded-xl text-xs font-semibold text-[#5C4A3E] hover:bg-[#FAF6F0]"
              >
                Limpar
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-3 bg-[#8E3E19] hover:bg-[#733113] text-white rounded-xl text-xs font-bold shadow-2xs"
              >
                Ver {sortedProducts.length} Peças
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

