import React from 'react';
import { ArrowLeft, MessageSquare, Star, MapPin, Sparkles, Heart } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';

interface CustomerArtisanProfileViewProps {
  artisanId: string;
}

export const CustomerArtisanProfileView: React.FC<CustomerArtisanProfileViewProps> = ({ artisanId }) => {
  const {
    artisans,
    products,
    navigate,
    startChatWithArtisan,
    addToCart,
    toggleFavorite,
    isFavorite,
  } = useMarketplace();

  const artisan = artisans.find((a) => a.id === artisanId) || artisans[0];
  const artisanProducts = products.filter((p) => p.artisanId === artisan.id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      <button
        onClick={() => navigate('/produtos')}
        className="flex items-center gap-1.5 text-xs font-semibold text-[#8C7667] hover:text-[#2D241E] cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Voltar para Vitrine</span>
      </button>

      {/* Artisan Cover & Studio Card */}
      <div className="bg-[#FAF6F0] rounded-3xl p-6 sm:p-10 border border-[#E8DCCF] shadow-sm">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
          <div className="relative">
            <img
              src={artisan.avatarUrl}
              alt={artisan.name}
              className="w-28 h-28 sm:w-36 sm:h-36 rounded-3xl object-cover border-4 border-white shadow-md"
            />
            <span className="absolute -bottom-2 -right-2 bg-[#8E3E19] text-white p-1.5 rounded-full shadow-sm">
              <Sparkles className="w-4 h-4" />
            </span>
          </div>

          <div className="flex-1 text-center md:text-left space-y-3">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E3E19] block">
                  {artisan.studioName}
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
                  {artisan.name}
                </h1>
                <p className="text-xs text-[#6B5A4E] flex items-center justify-center md:justify-start gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#8E3E19]" />
                  <span>{artisan.location}</span>
                  <span>·</span>
                  <span className="font-semibold text-emerald-700">★ {artisan.rating}</span>
                  <span>·</span>
                  <span>{artisan.totalSales} peças vendidas</span>
                </p>
              </div>

              <button
                onClick={() => {
                  const firstProd = artisanProducts[0] || products[0];
                  startChatWithArtisan(firstProd);
                }}
                className="bg-[#8E3E19] hover:bg-[#733113] text-white px-5 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Conversar com a Artesã</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#4A3B32] leading-relaxed">
              {artisan.bio}
            </p>

            {/* Story Box */}
            <div className="bg-white p-4 rounded-2xl border border-[#EADBCC] text-xs text-[#5C4A3E]">
              <span className="font-bold text-[#8E3E19] block mb-1">História de Tradição:</span>
              <p className="italic leading-relaxed">“{artisan.story}”</p>
            </div>

            {/* Specialties */}
            <div className="flex items-center justify-center md:justify-start gap-2 flex-wrap pt-1 text-xs">
              <span className="text-[#8C7667] font-semibold text-[11px]">Especialidades:</span>
              {artisan.specialties.map((spec) => (
                <span key={spec} className="bg-[#EFE7DC] text-[#4A3B32] px-2.5 py-0.5 rounded-full text-[11px] font-medium">
                  {spec}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Catalog of this Artisan */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold font-serif text-[#2D241E]">
            Peças Criadas por {artisan.name}
          </h2>
          <p className="text-xs text-[#6B5A4E]">
            {artisanProducts.length} criações artesanais autênticas disponíveis
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {artisanProducts.map((prod) => (
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

                <div className="p-4 cursor-pointer" onClick={() => navigate(`/produto/${prod.id}`)}>
                  <div className="flex items-center justify-between text-[11px] text-[#8C7667] mb-1">
                    <span>{prod.category}</span>
                    <span>★ {prod.rating}</span>
                  </div>
                  <h3 className="font-bold text-sm text-[#2D241E] group-hover:text-[#8E3E19] transition-colors line-clamp-1 mb-1">
                    {prod.title}
                  </h3>
                  <p className="text-xs text-[#6B5A4E] line-clamp-2">{prod.description}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-[#F2EAE0] flex items-center justify-between gap-2">
                <div>
                  <span className="text-[9px] uppercase font-semibold text-[#8C7667] block">Preço</span>
                  <span className="font-bold text-sm text-[#2D241E] tabular-nums">{formatCurrency(prod.priceCents)}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => startChatWithArtisan(prod)}
                    className="p-2 border border-[#D9CDBF] hover:bg-[#FAF6F0] rounded-xl text-[#8E3E19] cursor-pointer"
                    title="Conversar com a artesã"
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
      </div>
    </div>
  );
};
