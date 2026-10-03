import React from 'react';
import { Heart, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';

export const CustomerFavoritesView: React.FC = () => {
  const {
    products,
    customerProfile,
    toggleFavorite,
    addToCart,
    navigate,
  } = useMarketplace();

  const favoriteProducts = products.filter((p) =>
    customerProfile.favoriteProductIds.includes(p.id)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
          Meus Favoritos
        </h1>
        <p className="text-xs text-[#6B5A4E]">
          Peças artesanais salvas na sua lista de desejos
        </p>
      </div>

      {favoriteProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EADBCC] space-y-3">
          <Heart className="w-12 h-12 text-[#C4B5A5] mx-auto" />
          <h3 className="font-serif font-bold text-base text-[#2D241E]">Nenhuma peça salva ainda</h3>
          <p className="text-xs text-[#6B5A4E]">Clique no ícone de coração em qualquer peça para salvar aqui.</p>
          <button
            onClick={() => navigate('/produtos')}
            className="bg-[#8E3E19] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
          >
            Explorar Produtos
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {favoriteProducts.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-2xl overflow-hidden border border-[#EADBCC] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div
                  className="relative aspect-4/3 bg-[#F4EDE2] cursor-pointer"
                  onClick={() => navigate(`/produto/${prod.id}`)}
                >
                  <img src={prod.imageUrl} alt={prod.title} className="w-full h-full object-cover" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(prod.id);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200 cursor-pointer"
                    title="Remover dos favoritos"
                  >
                    <Heart className="w-4 h-4 fill-current" />
                  </button>
                </div>

                <div className="p-4 cursor-pointer" onClick={() => navigate(`/produto/${prod.id}`)}>
                  <span className="text-[11px] text-[#8C7667]">{prod.category} · {prod.artisanName}</span>
                  <h3 className="font-bold text-sm text-[#2D241E] line-clamp-1 mb-1">{prod.title}</h3>
                  <p className="text-xs text-[#6B5A4E] line-clamp-2">{prod.description}</p>
                </div>
              </div>

              <div className="p-4 pt-0 border-t border-[#F2EAE0] flex items-center justify-between">
                <span className="font-bold text-sm text-[#2D241E] tabular-nums">
                  {formatCurrency(prod.priceCents)}
                </span>
                <button
                  onClick={() => {
                    addToCart(prod, 1);
                    navigate('/carrinho');
                  }}
                  className="bg-[#8E3E19] hover:bg-[#733113] text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer flex items-center gap-1.5"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Comprar</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
