import React, { useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, Truck, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';

export const CustomerCartView: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateCartQty,
    navigate,
  } = useMarketplace();

  const [cep, setCep] = useState('');
  const [shippingMethod, setShippingMethod] = useState<'PAC' | 'Sedex'>('PAC');
  const [isCalc, setIsCalc] = useState(false);

  const subtotalCents = cart.reduce(
    (acc, item) => acc + item.product.priceCents * item.quantity,
    0
  );

  const shippingRates = {
    PAC: 2150,
    Sedex: 3890,
  };

  const shippingCents = cart.length > 0 ? shippingRates[shippingMethod] : 0;
  const totalCents = subtotalCents + shippingCents;

  const handleSimulateShipping = (e: React.FormEvent) => {
    e.preventDefault();
    setIsCalc(true);
    setTimeout(() => setIsCalc(false), 500);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 bg-[#F4EDE2] text-[#8E3E19] rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-serif text-[#2D241E]">
          Seu carrinho está vazio
        </h2>
        <p className="text-xs sm:text-sm text-[#6B5A4E]">
          Navegue pelas criações das nossas artesãs e apoie o trabalho manual brasileiro.
        </p>
        <button
          onClick={() => navigate('/produtos')}
          className="bg-[#8E3E19] hover:bg-[#733113] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
        >
          Explorar Vitrine
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
            Meu Carrinho de Compras
          </h1>
          <p className="text-xs text-[#6B5A4E]">
            {cart.length} item(s) selecionados de artesãs independentes
          </p>
        </div>

        <button
          onClick={() => navigate('/produtos')}
          className="text-xs font-semibold text-[#8E3E19] hover:underline flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Continuar Comprando</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item.product.id}
              className="bg-white p-4 rounded-2xl border border-[#EADBCC] shadow-xs flex flex-col sm:flex-row gap-4 items-center justify-between"
            >
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-20 h-20 rounded-xl object-cover border border-[#E0D0C0] shrink-0"
                />
                <div>
                  <span className="text-[10px] text-[#8E3E19] font-bold block">
                    {item.product.artisanName} ({item.product.artisanLocation})
                  </span>
                  <h3 className="font-bold text-sm text-[#2D241E] line-clamp-1 mb-1">
                    {item.product.title}
                  </h3>
                  <span className="text-xs font-bold text-[#2D241E] tabular-nums">
                    {formatCurrency(item.product.priceCents)}
                  </span>
                  {item.customizationNotes && (
                    <p className="text-[11px] text-[#6B5A4E] italic mt-1">
                      Obs: {item.customizationNotes}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-[#F2EAE0]">
                {/* Quantity */}
                <div className="flex items-center border border-[#D9CDBF] rounded-xl overflow-hidden bg-[#FAF6F0]">
                  <button
                    onClick={() => updateCartQty(item.product.id, item.quantity - 1)}
                    className="px-2.5 py-1 text-xs font-bold hover:bg-[#EAE0D2] cursor-pointer"
                  >
                    -
                  </button>
                  <span className="px-3 py-1 text-xs font-bold tabular-nums">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQty(item.product.id, item.quantity + 1)}
                    className="px-2.5 py-1 text-xs font-bold hover:bg-[#EAE0D2] cursor-pointer"
                  >
                    +
                  </button>
                </div>

                <span className="font-bold text-sm text-[#2D241E] tabular-nums">
                  {formatCurrency(item.product.priceCents * item.quantity)}
                </span>

                <button
                  onClick={() => removeFromCart(item.product.id)}
                  className="text-[#8C7667] hover:text-[#E11D48] p-1.5 cursor-pointer"
                  title="Remover peça"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary & Shipping */}
        <div className="bg-white p-6 rounded-3xl border border-[#EADBCC] shadow-xs space-y-6">
          <h2 className="font-serif font-bold text-base text-[#2D241E] pb-3 border-b border-[#F2EAE0]">
            Resumo do Pedido
          </h2>

          {/* Shipping CEP */}
          <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#E6D8CA] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[#2D241E] flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-[#8E3E19]" />
                Calcular Frete
              </span>
              <span className="text-[10px] text-[#8C7667]">Melhor Envio</span>
            </div>

            <form onSubmit={handleSimulateShipping} className="flex gap-2">
              <input
                type="text"
                value={cep}
                onChange={(e) => setCep(e.target.value)}
                placeholder="00000-000"
                className="flex-1 bg-white border border-[#D9CDBF] rounded-xl px-3 py-1.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
              <button
                type="submit"
                className="bg-[#2D241E] hover:bg-black text-white px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
              >
                {isCalc ? '...' : 'OK'}
              </button>
            </form>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setShippingMethod('PAC')}
                className={`p-2 rounded-xl border text-left cursor-pointer transition-colors ${
                  shippingMethod === 'PAC'
                    ? 'border-[#8E3E19] bg-[#F8EFE9] text-[#8E3E19] font-bold'
                    : 'border-[#D9CDBF] bg-white text-[#5C4A3E]'
                }`}
              >
                <span className="block text-[10px]">PAC (5 a 8 dias)</span>
                <span className="tabular-nums">{formatCurrency(shippingRates.PAC)}</span>
              </button>

              <button
                type="button"
                onClick={() => setShippingMethod('Sedex')}
                className={`p-2 rounded-xl border text-left cursor-pointer transition-colors ${
                  shippingMethod === 'Sedex'
                    ? 'border-[#8E3E19] bg-[#F8EFE9] text-[#8E3E19] font-bold'
                    : 'border-[#D9CDBF] bg-white text-[#5C4A3E]'
                }`}
              >
                <span className="block text-[10px]">Sedex (2 a 3 dias)</span>
                <span className="tabular-nums">{formatCurrency(shippingRates.Sedex)}</span>
              </button>
            </div>
          </div>

          {/* Pricing Totals */}
          <div className="space-y-2 text-xs text-[#5C4A3E]">
            <div className="flex justify-between">
              <span>Subtotal dos produtos:</span>
              <span className="font-semibold text-[#2D241E] tabular-nums">{formatCurrency(subtotalCents)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frete ({shippingMethod}):</span>
              <span className="font-semibold text-[#2D241E] tabular-nums">{formatCurrency(shippingCents)}</span>
            </div>
            <div className="pt-3 border-t border-[#F2EAE0] flex justify-between text-base font-bold text-[#2D241E]">
              <span>Total a pagar:</span>
              <span className="text-[#8E3E19] tabular-nums">{formatCurrency(totalCents)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-[#8E3E19] hover:bg-[#733113] text-white py-3.5 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Ir para o Checkout Seguro</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#1A543E]">
            <ShieldCheck className="w-4 h-4" />
            <span>Split garantido: 90% direto para a artesã</span>
          </div>
        </div>
      </div>
    </div>
  );
};
