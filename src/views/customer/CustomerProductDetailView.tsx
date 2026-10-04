import React, { useState } from 'react';
import {
  ArrowLeft,
  Heart,
  MessageSquare,
  ShoppingBag,
  Star,
  Ruler,
  Clock,
  Sparkles,
  ShieldCheck,
  Truck,
  Check,
  Share2,
  Package,
} from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';

interface CustomerProductDetailViewProps {
  productId: string;
}

export const CustomerProductDetailView: React.FC<CustomerProductDetailViewProps> = ({ productId }) => {
  const {
    products,
    artisans,
    navigate,
    addToCart,
    startChatWithArtisan,
    toggleFavorite,
    isFavorite,
  } = useMarketplace();

  const [quantity, setQuantity] = useState(1);
  const [customNote, setCustomNote] = useState('');
  const [addedNotice, setAddedNotice] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const product = products.find((p) => p.id === productId);
  const artisan = product ? artisans.find((a) => a.id === product.artisanId) || null : null;

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <EmptyState
          icon={Package}
          title="Produto não encontrado"
          description="A peça que você procura não está cadastrada ou foi removida. Navegue pelo catálogo para conhecer as criações das artesãs brasileiras."
          actionText="Voltar para a Vitrine de Produtos"
          onAction={() => navigate('/produtos')}
        />
      </div>
    );
  }

  const handleAdd = () => {
    addToCart(product, quantity, customNote || undefined);
    setAddedNotice(true);
    setTimeout(() => setAddedNotice(false), 3000);
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 3000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Back Breadcrumb */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/produtos')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8C7667] hover:text-[#2D241E] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para Vitrine de Produtos</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 text-xs text-[#8C7667] hover:text-[#2D241E] p-2 rounded-xl bg-white border border-[#EADBCC] cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link copiado!' : 'Compartilhar'}</span>
          </button>
          <button
            onClick={() => toggleFavorite(product.id)}
            className={`p-2 rounded-xl border border-[#EADBCC] cursor-pointer transition-colors ${
              isFavorite(product.id) ? 'bg-rose-50 border-rose-200 text-rose-600' : 'bg-white text-[#8C7667]'
            }`}
          >
            <Heart className="w-4 h-4 fill-current" />
          </button>
        </div>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">
        {/* Left: Product Imagery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-[#F4EDE2] border border-[#E0D0C0] shadow-sm">
            <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
            {product.badge && (
              <span className="absolute top-4 left-4 bg-[#8E3E19] text-white text-[10px] font-bold uppercase px-3 py-1 rounded-md shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Value props */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-white p-3.5 rounded-2xl border border-[#EADBCC] flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-[#1A543E] shrink-0" />
              <div>
                <span className="font-bold text-[#2D241E] block">Split Seguro</span>
                <span className="text-[11px] text-[#8C7667]">90% direto para a artesã</span>
              </div>
            </div>
            <div className="bg-white p-3.5 rounded-2xl border border-[#EADBCC] flex items-center gap-2.5">
              <Truck className="w-5 h-5 text-[#8E3E19] shrink-0" />
              <div>
                <span className="font-bold text-[#2D241E] block">Envio Nacional</span>
                <span className="text-[11px] text-[#8C7667]">Melhor Envio / Correios</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Purchase Module */}
        <div className="space-y-6">
          <div>
            <span className="text-xs uppercase font-bold tracking-wider text-[#8E3E19] block mb-1">
              {product.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E] mb-2">
              {product.title}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-3xl font-extrabold font-serif text-[#8E3E19] tabular-nums">
                {formatCurrency(product.priceCents)}
              </span>
              <span className="text-xs bg-[#EDF6F1] text-[#1A543E] font-bold px-2.5 py-1 rounded-full">
                {product.stock > 0 ? `${product.stock} un. em estoque` : 'Sob encomenda'}
              </span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#5C4A3E] leading-relaxed">
            {product.description}
          </p>

          {/* Storytelling of this specific piece */}
          <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#E8DCCF] text-xs text-[#5C4A3E] space-y-1">
            <span className="font-bold text-[#8E3E19] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              História por trás da peça:
            </span>
            <p className="italic">“{product.story}”</p>
          </div>

          {/* Specifications Box */}
          <div className="bg-white p-4 rounded-2xl border border-[#EADBCC] space-y-2.5 text-xs text-[#5C4A3E]">
            <div className="flex items-center gap-2">
              <Ruler className="w-4 h-4 text-[#8C7667] shrink-0" />
              <span>Dimensões: <strong>{product.dimensions}</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#8C7667] shrink-0" />
              <span>Prazo de confecção: <strong>{product.productionDays} dia(s) úteis</strong></span>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-[#8C7667] shrink-0 mt-0.5" />
              <span>Materiais: <strong>{product.materials.join(', ')}</strong></span>
            </div>
          </div>

          {/* Artisan Profile Mini-Banner */}
          {artisan ? (
            <div
              onClick={() => navigate(`/artesa/${artisan.id}`)}
              className="bg-white p-4 rounded-2xl border border-[#EADBCC] flex items-center justify-between cursor-pointer hover:border-[#8E3E19] transition-colors"
            >
              <div className="flex items-center gap-3">
                <img src={artisan.avatarUrl || product.artisanAvatar} alt={artisan.name} className="w-12 h-12 rounded-full object-cover border border-[#D9CDBF]" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C7667] block">Artesã Responsável</span>
                  <h4 className="text-sm font-bold text-[#2D241E]">{artisan.name}</h4>
                  <p className="text-[11px] text-[#8E3E19] font-medium">{artisan.location} · {artisan.studioName}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#2D241E] block">★ {artisan.rating}</span>
                <span className="text-[10px] text-[#8C7667]">Ver Atelier →</span>
              </div>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-2xl border border-[#EADBCC] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={product.artisanAvatar} alt={product.artisanName} className="w-12 h-12 rounded-full object-cover border border-[#D9CDBF]" />
                <div>
                  <span className="text-[10px] uppercase font-bold text-[#8C7667] block">Artesã Responsável</span>
                  <h4 className="text-sm font-bold text-[#2D241E]">{product.artisanName}</h4>
                  <p className="text-[11px] text-[#8E3E19] font-medium">{product.artisanLocation}</p>
                </div>
              </div>
            </div>
          )}

          {/* Customization notes */}
          {product.isCustomizable && (
            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                Personalização especial (cores, iniciais, detalhes)
              </label>
              <input
                type="text"
                value={customNote}
                onChange={(e) => setCustomNote(e.target.value)}
                placeholder="Ex: laço terroso ou inicial bordada..."
                className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3.5 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>
          )}

          {/* Added to cart feedback */}
          {addedNotice && (
            <div className="p-3 bg-[#EDF6F1] text-[#1A543E] rounded-xl text-xs font-semibold border border-[#C5E3D2] flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>Adicionado ao carrinho com sucesso!</span>
              </div>
              <button onClick={() => navigate('/carrinho')} className="underline font-bold">
                Ver Carrinho
              </button>
            </div>
          )}

          {/* Actions: Add to Cart and Chat */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              <div className="flex items-center border border-[#D9CDBF] rounded-xl overflow-hidden bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-xs font-bold hover:bg-[#FAF6F0] cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 py-2 text-xs font-bold tabular-nums">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-xs font-bold hover:bg-[#FAF6F0] cursor-pointer"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAdd}
                className="flex-1 bg-[#8E3E19] hover:bg-[#733113] text-white py-3 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Adicionar ao Carrinho</span>
              </button>
            </div>

            <button
              onClick={() => startChatWithArtisan(product)}
              className="w-full bg-white hover:bg-[#FAF6F0] text-[#8E3E19] border border-[#8E3E19]/40 py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Conversar com a Artesã {artisan?.name || product.artisanName}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Purchase Action Bar */}
      <div className="md:hidden fixed bottom-14 left-0 right-0 bg-white/95 backdrop-blur-md p-3 border-t border-[#EADBCC] flex items-center justify-between gap-3 shadow-lg z-30">
        <div>
          <span className="text-[10px] uppercase font-semibold text-[#8C7667] block">Valor da Peça</span>
          <span className="font-bold text-base text-[#2D241E] tabular-nums leading-tight">
            {formatCurrency(product.priceCents)}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => startChatWithArtisan(product)}
            className="p-2.5 rounded-xl border border-[#D9CDBF] text-[#8E3E19] bg-[#FAF7F2] cursor-pointer"
            title="Conversar"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
          <button
            onClick={handleAdd}
            className="bg-[#8E3E19] hover:bg-[#733113] text-white py-2.5 px-4 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Comprar Peça</span>
          </button>
        </div>
      </div>
    </div>
  );
};
