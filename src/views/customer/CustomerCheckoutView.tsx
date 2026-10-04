import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowLeft,
  Truck,
  ShoppingBag,
  Database,
  Lock,
} from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { IntegrationPending } from '../../components/common/IntegrationPending';
import { checkoutSchema } from '../../schemas/customer.schema';

export const CustomerCheckoutView: React.FC = () => {
  const {
    cart,
    navigate,
    customerProfile,
    notifyPendingIntegration,
    setIsArchitectureOpen,
  } = useMarketplace();

  const [paymentMethod, setPaymentMethod] = useState<'pix' | 'credit_card'>('pix');
  const [clientName, setClientName] = useState(customerProfile.fullName || '');
  const [clientEmail, setClientEmail] = useState(customerProfile.email || '');
  const [clientPhone, setClientPhone] = useState(customerProfile.phone || '');
  const [street, setStreet] = useState(customerProfile.address?.street || '');
  const [number, setNumber] = useState(customerProfile.address?.number || '');
  const [complement, setComplement] = useState(customerProfile.address?.complement || '');
  const [neighborhood, setNeighborhood] = useState(customerProfile.address?.neighborhood || '');
  const [city, setCity] = useState(customerProfile.address?.city || '');
  const [state, setState] = useState(customerProfile.address?.state || '');
  const [cep, setCep] = useState(customerProfile.address?.cep || '');

  // Card fields (clean, empty inputs)
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPendingBanner, setShowPendingBanner] = useState(false);

  const subtotalCents = cart.reduce(
    (acc, item) => acc + item.product.priceCents * item.quantity,
    0
  );
  const shippingCents = cart.length > 0 ? 2150 : 0;
  const totalCents = subtotalCents + shippingCents;
  const platformFeeCents = Math.round(subtotalCents * 0.1);
  const artisanPayoutCents = subtotalCents - platformFeeCents;

  if (cart.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Não existem produtos para finalizar a compra"
          description="Seu carrinho está vazio. Adicione peças artesanais da vitrine antes de prosseguir para o checkout seguro."
          actionText="Explorar Vitrine de Peças"
          onAction={() => navigate('/produtos')}
        />
      </div>
    );
  }

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});

    const result = checkoutSchema.safeParse({
      clientName,
      clientEmail,
      clientPhone,
      shippingAddress: {
        recipientName: clientName,
        cep,
        street,
        number,
        complement,
        neighborhood,
        city,
        state,
      },
      paymentMethod,
      shippingMethod: 'PAC',
    });

    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path.join('.');
        errors[path] = issue.message;
      });
      setFormErrors(errors);
      return;
    }

    setShowPendingBanner(true);
    notifyPendingIntegration(
      'Checkout e Processamento de Pagamento',
      `Pedido no valor de R$ ${(totalCents / 100).toFixed(2)} com split automático de 90% para a artesã (R$ ${(artisanPayoutCents / 100).toFixed(2)}) e 10% para a Artenós (R$ ${(platformFeeCents / 100).toFixed(2)}). A autorização e emissão do Pix/Cartão serão ativadas com o gateway e o Supabase.`
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/carrinho')}
          className="flex items-center gap-1.5 text-xs font-semibold text-[#8C7667] hover:text-[#2D241E] cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Carrinho</span>
        </button>

        <span className="text-xs text-[#8C7667] flex items-center gap-1">
          <Lock className="w-3.5 h-3.5 text-[#1A543E]" />
          <span>Ambiente de Checkout Seguro</span>
        </span>
      </div>

      {showPendingBanner && (
        <IntegrationPending
          title="Integração de Pagamento Pendente"
          actionName="Processamento do Pedido"
          description="O formulário foi validado com sucesso pelo schema Zod. O split de pagamentos e a geração do QR Code Pix serão concluídos após a conexão com o Supabase e o gateway de pagamento."
          onViewArchitecture={() => setIsArchitectureOpen(true)}
          onClose={() => setShowPendingBanner(false)}
        />
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Identification */}
          <div className="bg-white rounded-2xl p-6 border border-[#EADBCC] space-y-4">
            <h2 className="font-bold font-serif text-base text-[#2D241E]">
              1. Dados do Comprador
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Nome Completo *</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nome e Sobrenome"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
                {formErrors.clientName && (
                  <span className="text-[11px] text-red-600 mt-0.5 block">{formErrors.clientName}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">E-mail para Rastreio *</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
                {formErrors.clientEmail && (
                  <span className="text-[11px] text-red-600 mt-0.5 block">{formErrors.clientEmail}</span>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Telefone WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(11) 98765-4321"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
                {formErrors.clientPhone && (
                  <span className="text-[11px] text-red-600 mt-0.5 block">{formErrors.clientPhone}</span>
                )}
              </div>
            </div>
          </div>

          {/* 2. Delivery Address */}
          <div className="bg-white rounded-2xl p-6 border border-[#EADBCC] space-y-4">
            <h2 className="font-bold font-serif text-base text-[#2D241E]">
              2. Endereço de Entrega
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">CEP *</label>
                <input
                  type="text"
                  required
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Rua / Logradouro *</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Rua, Avenida..."
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Número *</label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="123"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div className="col-span-2 sm:col-span-1">
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Complemento</label>
                <input
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Apto, Bloco..."
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Bairro *</label>
                <input
                  type="text"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Bairro"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Cidade *</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Cidade"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Estado (UF) *</label>
                <input
                  type="text"
                  maxLength={2}
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  placeholder="SP"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>
            </div>
          </div>

          {/* 3. Payment Method */}
          <div className="bg-white rounded-2xl p-6 border border-[#EADBCC] space-y-4">
            <h2 className="font-bold font-serif text-base text-[#2D241E]">
              3. Forma de Pagamento
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('pix')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'pix'
                    ? 'border-[#8E3E19] bg-[#FAF5F0] text-[#8E3E19] shadow-2xs'
                    : 'border-[#EADBCC] hover:bg-[#FAF7F2] text-[#6B5A4E]'
                }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="text-xs font-bold">Pix Instantâneo</span>
                <span className="text-[10px] text-[#1A543E] font-medium">Split Automático 90/10</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 cursor-pointer transition-all ${
                  paymentMethod === 'credit_card'
                    ? 'border-[#8E3E19] bg-[#FAF5F0] text-[#8E3E19] shadow-2xs'
                    : 'border-[#EADBCC] hover:bg-[#FAF7F2] text-[#6B5A4E]'
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span className="text-xs font-bold">Cartão de Crédito</span>
                <span className="text-[10px] text-[#8C7667]">Em até 12x</span>
              </button>
            </div>

            {paymentMethod === 'credit_card' && (
              <div className="p-4 bg-[#FAF7F2] rounded-xl border border-[#EADBCC] space-y-3 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Número do Cartão</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Nome no Cartão</label>
                    <input
                      type="text"
                      value={cardHolder}
                      onChange={(e) => setCardHolder(e.target.value)}
                      placeholder="COMO NO CARTÃO"
                      className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Validade</label>
                      <input
                        type="text"
                        value={cardExp}
                        onChange={(e) => setCardExp(e.target.value)}
                        placeholder="MM/AA"
                        className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-[#3D2E24] mb-1">CVV</label>
                      <input
                        type="text"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="123"
                        className="w-full bg-white border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary */}
        <div className="bg-white rounded-2xl p-6 border border-[#EADBCC] space-y-5 lg:sticky lg:top-24">
          <h3 className="font-serif font-bold text-base text-[#2D241E] border-b border-[#F2EAE0] pb-3">
            Resumo do Pedido ({cart.length} item{cart.length > 1 ? 's' : ''})
          </h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
            {cart.map((item) => (
              <div key={item.product.id} className="flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2 truncate">
                  <img
                    src={item.product.imageUrl}
                    alt={item.product.title}
                    className="w-10 h-10 rounded-lg object-cover border border-[#EADBCC] shrink-0"
                  />
                  <div className="truncate">
                    <p className="font-semibold text-[#2D241E] truncate">{item.product.title}</p>
                    <span className="text-[10px] text-[#8C7667]">Qtd: {item.quantity}</span>
                  </div>
                </div>
                <span className="font-semibold text-[#2D241E] shrink-0 tabular-nums">
                  {formatCurrency(item.product.priceCents * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="border-t border-[#F2EAE0] pt-4 space-y-2 text-xs text-[#6B5A4E]">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-[#2D241E] tabular-nums">{formatCurrency(subtotalCents)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-[#8E3E19]" />
                <span>Frete (PAC)</span>
              </span>
              <span className="font-semibold text-[#2D241E] tabular-nums">{formatCurrency(shippingCents)}</span>
            </div>
            <div className="border-t border-[#F2EAE0] pt-2 flex justify-between text-sm font-bold text-[#2D241E]">
              <span>Total a Pagar</span>
              <span className="text-[#8E3E19] tabular-nums">{formatCurrency(totalCents)}</span>
            </div>
          </div>

          {/* Ethical Split Breakdown */}
          <div className="p-3 bg-[#FAF5F0] rounded-xl border border-[#EADBCC] text-[11px] text-[#5C4A3E] space-y-1">
            <span className="font-bold text-[#8E3E19] flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              Split Ético Artenós:
            </span>
            <p>• <strong>90%</strong> ({formatCurrency(artisanPayoutCents)}) direto para a artesã criadora.</p>
            <p>• <strong>10%</strong> ({formatCurrency(platformFeeCents)}) para manutenção da plataforma.</p>
          </div>

          <button
            type="submit"
            className="w-full bg-[#8E3E19] hover:bg-[#733113] text-white text-xs font-bold py-3.5 rounded-xl cursor-pointer transition-colors shadow-sm hover:shadow"
          >
            Finalizar Pedido
          </button>
        </div>
      </form>
    </div>
  );
};
