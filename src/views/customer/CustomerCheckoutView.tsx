import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle,
  Copy,
  CreditCard,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Truck,
  Check,
} from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';
import { Order } from '../../types';

export const CustomerCheckoutView: React.FC = () => {
  const {
    cart,
    createOrder,
    navigate,
    customerProfile,
  } = useMarketplace();

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [clientName, setClientName] = useState(customerProfile.fullName);
  const [clientEmail, setClientEmail] = useState(customerProfile.email);
  const [clientPhone, setClientPhone] = useState(customerProfile.phone);
  const [street, setStreet] = useState(customerProfile.address.street);
  const [number, setNumber] = useState(customerProfile.address.number);
  const [complement, setComplement] = useState(customerProfile.address.complement || '');
  const [neighborhood, setNeighborhood] = useState(customerProfile.address.neighborhood);
  const [city, setCity] = useState(customerProfile.address.city);
  const [state, setState] = useState(customerProfile.address.state);
  const [cep, setCep] = useState(customerProfile.address.cep);

  // Card fields
  const [cardNumber, setCardNumber] = useState('•••• •••• •••• 4242');
  const [cardHolder, setCardHolder] = useState(customerProfile.fullName.toUpperCase());
  const [cardExp, setCardExp] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('•••');
  const [installments, setInstallments] = useState('1');

  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [copiedPix, setCopiedPix] = useState(false);

  const subtotalCents = cart.reduce(
    (acc, item) => acc + item.product.priceCents * item.quantity,
    0
  );
  const shippingCents = 2150;
  const totalCents = subtotalCents + shippingCents;
  const platformFeeCents = Math.round(subtotalCents * 0.1);
  const artisanPayoutCents = subtotalCents - platformFeeCents;

  const mockPixCode = '00020126580014br.gov.bcb.pix0136artspan-split-artenos-pix-token-4819520400005303986540' + totalCents + '5802BR5915ARTENOS BRASIL6009SAO PAULO62070503***6304ABCD';

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    setIsProcessing(true);
    setTimeout(() => {
      const order = createOrder({
        clientName,
        clientEmail,
        clientPhone,
        clientAddress: {
          street,
          number,
          complement,
          neighborhood,
          city,
          state,
          cep,
        },
        items: cart.map((i) => ({
          productId: i.product.id,
          title: i.product.title,
          artisanId: i.product.artisanId,
          artisanName: i.product.artisanName,
          unitPriceCents: i.product.priceCents,
          quantity: i.quantity,
          imageUrl: i.product.imageUrl,
          customizationNotes: i.customizationNotes,
        })),
        subtotalCents,
        shippingCents,
        shippingMethod: 'PAC',
        totalCents,
        platformFeeCents,
        artisanPayoutCents,
        paymentMethod,
        status: 'paid', // Immediately authorized in sandbox
        trackingCode: 'BR-PAC-' + Math.floor(10000000 + Math.random() * 90000000),
      });

      setIsProcessing(false);
      setPlacedOrder(order);
    }, 1200);
  };

  const handleCopyPix = () => {
    navigator.clipboard?.writeText(mockPixCode);
    setCopiedPix(true);
    setTimeout(() => setCopiedPix(false), 3000);
  };

  if (placedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center space-y-6">
        <div className="w-16 h-16 bg-[#EEF6F2] text-[#1A543E] rounded-full flex items-center justify-center mx-auto ring-8 ring-[#EEF6F2]/60">
          <CheckCircle className="w-8 h-8" />
        </div>

        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#1A543E] block mb-1">
            Pagamento Aprovado no Split Transparente
          </span>
          <h1 className="text-3xl font-bold font-serif text-[#2D241E] mb-2">
            Pedido {placedOrder.orderNumber} Confirmado!
          </h1>
          <p className="text-xs sm:text-sm text-[#6B5A4E] max-w-md mx-auto">
            As artesãs já receberam a confirmação do seu pagamento e iniciarão a preparação das peças com todo carinho.
          </p>
        </div>

        {/* Receipt Box */}
        <div className="bg-white p-6 rounded-3xl border border-[#EADBCC] text-left text-xs space-y-3 max-w-lg mx-auto shadow-xs">
          <div className="flex justify-between pb-2 border-b border-[#F2EAE0]">
            <span className="text-[#8C7667]">Status:</span>
            <span className="font-bold text-[#1A543E]">Pagamento Aprovado</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8C7667]">Rastreamento PAC:</span>
            <span className="font-bold text-[#8E3E19]">{placedOrder.trackingCode}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8C7667]">Destinatário:</span>
            <span className="font-semibold text-[#2D241E]">{placedOrder.clientName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#8C7667]">Endereço:</span>
            <span className="text-[#2D241E] text-right">
              {placedOrder.clientAddress.street}, {placedOrder.clientAddress.number} - {placedOrder.clientAddress.city}/{placedOrder.clientAddress.state}
            </span>
          </div>
          <div className="pt-3 border-t border-[#F2EAE0] flex justify-between font-bold text-sm text-[#2D241E]">
            <span>Valor Total Pago:</span>
            <span className="text-[#8E3E19] tabular-nums">{formatCurrency(placedOrder.totalCents)}</span>
          </div>

          <div className="pt-2 border-t border-[#F2EAE0] bg-[#EEF6F2] p-2.5 rounded-xl text-[10px] text-[#1A543E] flex items-center justify-between">
            <span>Repasse direto para a conta da artesã:</span>
            <span className="font-bold tabular-nums">{formatCurrency(placedOrder.artisanPayoutCents)} (90%)</span>
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            onClick={() => navigate('/meus-pedidos')}
            className="bg-[#8E3E19] hover:bg-[#733113] text-white px-6 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Acompanhar em Meus Pedidos
          </button>
          <button
            onClick={() => navigate('/produtos')}
            className="bg-white hover:bg-[#FAF6F0] text-[#4A3B32] border border-[#D9CDBF] px-6 py-2.5 rounded-xl text-xs font-bold transition-colors cursor-pointer"
          >
            Continuar Navegando
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
            Finalizar Compra Segura
          </h1>
          <p className="text-xs text-[#6B5A4E]">
            Ambiente seguro com Split automático Mercado Pago / Pagar.me
          </p>
        </div>

        <button
          onClick={() => navigate('/carrinho')}
          className="text-xs font-semibold text-[#8C7667] hover:text-[#2D241E] flex items-center gap-1 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Voltar ao Carrinho</span>
        </button>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Form Fields (Left) */}
        <div className="md:col-span-7 space-y-6">
          {/* Split Notice */}
          <div className="bg-[#EEF6F2] border border-[#C6E2D2] p-4 rounded-2xl flex items-center justify-between text-xs text-[#1A543E]">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 shrink-0" />
              <div>
                <span className="font-bold block">Split Transparente de Pagamento</span>
                <span className="text-[11px]">90% do valor vai direto para a artesã criadora da peça.</span>
              </div>
            </div>
            <span className="font-bold tabular-nums shrink-0">{formatCurrency(artisanPayoutCents)}</span>
          </div>

          {/* 1. Address Section */}
          <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-4">
            <h2 className="font-serif font-bold text-sm text-[#2D241E] pb-2 border-b border-[#F2EAE0]">
              1. Dados de Envio
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#5C4A3E] mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5C4A3E] mb-1">WhatsApp / Telefone</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-[11px] font-bold text-[#5C4A3E] mb-1">Endereço (Rua / Av)</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-[#5C4A3E] mb-1">Número</label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-[#5C4A3E] mb-1">Bairro</label>
                <input
                  type="text"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#5C4A3E] mb-1">Cidade / UF</label>
                <input
                  type="text"
                  required
                  value={`${city}/${state}`}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-[#5C4A3E] mb-1">CEP</label>
                <input
                  type="text"
                  required
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>
            </div>
          </div>

          {/* 2. Payment Selector */}
          <div className="bg-white p-5 rounded-2xl border border-[#EADBCC] space-y-4">
            <h2 className="font-serif font-bold text-sm text-[#2D241E] pb-2 border-b border-[#F2EAE0]">
              2. Forma de Pagamento
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'pix'
                    ? 'border-[#8E3E19] bg-[#F8EFE9] text-[#8E3E19] font-bold'
                    : 'border-[#D9CDBF] bg-white text-[#5C4A3E]'
                }`}
              >
                <QrCode className="w-4 h-4" />
                <span className="text-xs">Pix Instantâneo</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-3.5 rounded-xl border flex items-center justify-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-[#8E3E19] bg-[#F8EFE9] text-[#8E3E19] font-bold'
                    : 'border-[#D9CDBF] bg-white text-[#5C4A3E]'
                }`}
              >
                <CreditCard className="w-4 h-4" />
                <span className="text-xs">Cartão de Crédito</span>
              </button>
            </div>

            {paymentMethod === 'pix' && (
              <div className="p-4 bg-[#FAF6F0] rounded-2xl border border-[#E8DCCF] text-center space-y-2 text-xs">
                <QrCode className="w-16 h-16 text-[#8E3E19] mx-auto" />
                <p className="text-[#5C4A3E]">
                  Ao confirmar, o QR Code e o código Copia e Cola Pix serão gerados para pagamento instantâneo.
                </p>
              </div>
            )}

            {paymentMethod === 'credit_card' && (
              <div className="space-y-3 pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-[#5C4A3E] mb-1">Número do Cartão</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs font-mono text-[#2D241E]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-[#5C4A3E] mb-1">Validade</label>
                    <input
                      type="text"
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-[#5C4A3E] mb-1">CVV</label>
                    <input
                      type="text"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-[#FAF6F0] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E]"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Order Summary (Right) */}
        <div className="md:col-span-5 bg-white p-6 rounded-3xl border border-[#EADBCC] shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-base text-[#2D241E] pb-2 border-b border-[#F2EAE0]">
            Resumo dos Valores
          </h2>

          <div className="space-y-2 text-xs text-[#5C4A3E]">
            <div className="flex justify-between">
              <span>Peças ({cart.length}):</span>
              <span className="font-semibold text-[#2D241E] tabular-nums">{formatCurrency(subtotalCents)}</span>
            </div>
            <div className="flex justify-between">
              <span>Frete Correios (PAC):</span>
              <span className="font-semibold text-[#2D241E] tabular-nums">{formatCurrency(shippingCents)}</span>
            </div>
            <div className="pt-2 border-t border-[#F2EAE0] flex justify-between font-bold text-base text-[#2D241E]">
              <span>Total:</span>
              <span className="text-[#8E3E19] tabular-nums">{formatCurrency(totalCents)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isProcessing || cart.length === 0}
            className="w-full bg-[#8E3E19] hover:bg-[#733113] disabled:opacity-50 text-white py-3.5 rounded-xl text-xs font-bold shadow-md transition-colors cursor-pointer flex items-center justify-center gap-2"
          >
            <span>{isProcessing ? 'Processando Split de Pagamento...' : 'Concluir Pagamento'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </form>
    </div>
  );
};
