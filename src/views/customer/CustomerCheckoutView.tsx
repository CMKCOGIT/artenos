import React, { useState } from 'react';
import {
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowLeft,
  Truck,
  ShoppingBag,
  Lock,
  CheckCircle2,
  AlertCircle,
  Copy,
  ExternalLink,
} from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';
import { checkoutSchema } from '../../schemas/customer.schema';
import type { Order } from '../../types';

export const CustomerCheckoutView: React.FC = () => {
  const {
    cart,
    navigate,
    customerProfile,
    createOrder,
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

  // Card fields
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [installments, setInstallments] = useState('1');

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);
  const [copiedPix, setCopiedPix] = useState(false);

  const subtotalCents = cart.reduce(
    (acc, item) => acc + item.product.priceCents * item.quantity,
    0
  );
  const shippingCents = cart.length > 0 ? 2150 : 0;
  const totalCents = subtotalCents + shippingCents;
  const platformFeeCents = Math.round(subtotalCents * 0.1);
  const artisanPayoutCents = subtotalCents - platformFeeCents;

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormErrors({});
    setSubmitError('');

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

    setIsSubmitting(true);
    try {
      const order = await createOrder({
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
        status: paymentMethod === 'pix' ? 'created' : 'paid',
      });

      setIsSubmitting(false);

      if (order) {
        setPlacedOrder(order);
      } else {
        setSubmitError('Erro ao registrar o pedido. Por favor, tente novamente.');
      }
    } catch (err: any) {
      setIsSubmitting(false);
      setSubmitError(err?.message || 'Falha ao processar o pedido.');
    }
  };

  // Order Confirmed State
  if (placedOrder) {
    const pixCopyPaste = `00020126580014br.gov.bcb.pix0136${placedOrder.id}520400005303986540${(placedOrder.totalCents / 100).toFixed(2)}5802BR5915ARTENOS BRASIL6009SAO PAULO62070503***6304`;

    return (
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-3xl border border-[#EADBCC] p-8 shadow-sm text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E3E19]">
              Pedido Registrado com Sucesso
            </span>
            <h2 className="text-2xl font-bold font-serif text-[#2D241E] mt-1">
              Obrigado pela sua compra!
            </h2>
            <p className="text-xs text-[#6B5A4E] mt-2">
              Número do Pedido: <strong className="text-[#2D241E]">{placedOrder.orderNumber}</strong>
            </p>
          </div>

          {/* Payment Specific Instructions */}
          {placedOrder.paymentMethod === 'pix' ? (
            <div className="bg-[#FAF6F0] p-6 rounded-2xl border border-[#EADBCC] text-left space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold text-[#8E3E19]">
                <QrCode className="w-4 h-4" />
                <span>Pagamento via Pix (Split Automático de 90% para a Artesã)</span>
              </div>
              <p className="text-xs text-[#5C4A3E]">
                Copie o código abaixo e utilize no aplicativo do seu banco para concluir o pagamento de{' '}
                <strong>{formatCurrency(placedOrder.totalCents)}</strong>:
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={pixCopyPaste}
                  className="flex-1 bg-white border border-[#D9CDBF] rounded-xl px-3 py-2 text-xs text-[#4A3B32] font-mono truncate"
                />
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText(pixCopyPaste);
                    setCopiedPix(true);
                    setTimeout(() => setCopiedPix(false), 2000);
                  }}
                  className="bg-[#8E3E19] hover:bg-[#733113] text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedPix ? 'Copiado!' : 'Copiar'}</span>
                </button>
              </div>
              <span className="text-[10px] text-[#8C7667] block">
                Tempo limite para pagamento: 30 minutos.
              </span>
            </div>
          ) : (
            <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs text-emerald-900 text-left flex items-start gap-2.5">
              <CreditCard className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block">Pagamento Confirmado no Cartão de Crédito</span>
                <span className="text-emerald-800">
                  O valor de {formatCurrency(placedOrder.totalCents)} foi autorizado. As artesãs já foram notificadas para iniciar a confecção.
                </span>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#EADBCC] flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={() => navigate('/meus-pedidos')}
              className="w-full sm:flex-1 bg-[#8E3E19] hover:bg-[#733113] text-white text-xs font-bold py-3.5 rounded-xl cursor-pointer transition-colors shadow-xs"
            >
              Acompanhar em Meus Pedidos
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full sm:flex-1 bg-[#F5ECE1] hover:bg-[#EADBCC] text-[#2D241E] text-xs font-semibold py-3.5 rounded-xl cursor-pointer transition-colors"
            >
              Continuar Comprando
            </button>
          </div>
        </div>
      </div>
    );
  }

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

      {submitError && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-xs text-red-800">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{submitError}</span>
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Column: Delivery & Payment Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* 1. Identification */}
          <div className="bg-white rounded-2xl p-6 border border-[#EADBCC] space-y-4">
            <h2 className="font-bold font-serif text-base text-[#2D241E]">
              1. Dados do Comprador
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Nome Completo</label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  placeholder="Nome do destinatário"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
                {formErrors.clientName && (
                  <span className="text-[11px] text-red-600 mt-1 block">{formErrors.clientName}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">E-mail</label>
                <input
                  type="email"
                  required
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="para envio do comprovante"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
                {formErrors.clientEmail && (
                  <span className="text-[11px] text-red-600 mt-1 block">{formErrors.clientEmail}</span>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">WhatsApp / Telefone</label>
                <input
                  type="tel"
                  required
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(00) 00000-0000"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
                {formErrors.clientPhone && (
                  <span className="text-[11px] text-red-600 mt-1 block">{formErrors.clientPhone}</span>
                )}
              </div>
            </div>
          </div>

          {/* 2. Delivery Address */}
          <div className="bg-white rounded-2xl p-6 border border-[#EADBCC] space-y-4">
            <h2 className="font-bold font-serif text-base text-[#2D241E]">
              2. Endereço de Entrega
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">CEP</label>
                <input
                  type="text"
                  required
                  value={cep}
                  onChange={(e) => setCep(e.target.value)}
                  placeholder="00000-000"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
                {formErrors['shippingAddress.cep'] && (
                  <span className="text-[11px] text-red-600 mt-1 block">{formErrors['shippingAddress.cep']}</span>
                )}
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Rua / Logradouro</label>
                <input
                  type="text"
                  required
                  value={street}
                  onChange={(e) => setStreet(e.target.value)}
                  placeholder="Nome da rua ou avenida"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
                {formErrors['shippingAddress.street'] && (
                  <span className="text-[11px] text-red-600 mt-1 block">{formErrors['shippingAddress.street']}</span>
                )}
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Número</label>
                <input
                  type="text"
                  required
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="123"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Complemento (opcional)</label>
                <input
                  type="text"
                  value={complement}
                  onChange={(e) => setComplement(e.target.value)}
                  placeholder="Apto 42, Bloco B"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Bairro</label>
                <input
                  type="text"
                  required
                  value={neighborhood}
                  onChange={(e) => setNeighborhood(e.target.value)}
                  placeholder="Seu bairro"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Cidade</label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Sua cidade"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Estado (UF)</label>
                <input
                  type="text"
                  required
                  maxLength={2}
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  placeholder="UF"
                  className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
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
                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                  paymentMethod === 'pix'
                    ? 'border-[#8E3E19] bg-[#FAF5F0] text-[#8E3E19]'
                    : 'border-[#EADBCC] hover:bg-[#FAF7F2] text-[#4A3B32]'
                }`}
              >
                <QrCode className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-semibold text-xs">PIX</p>
                  <p className="text-[10px] text-[#8C7667]">Aprovação imediata com split ético</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('credit_card')}
                className={`p-4 rounded-xl border text-left flex items-center gap-3 transition-colors cursor-pointer ${
                  paymentMethod === 'credit_card'
                    ? 'border-[#8E3E19] bg-[#FAF5F0] text-[#8E3E19]'
                    : 'border-[#EADBCC] hover:bg-[#FAF7F2] text-[#4A3B32]'
                }`}
              >
                <CreditCard className="w-5 h-5 shrink-0" />
                <div>
                  <p className="font-semibold text-xs">Cartão de Crédito</p>
                  <p className="text-[10px] text-[#8C7667]">Até 6x sem juros</p>
                </div>
              </button>
            </div>

            {paymentMethod === 'credit_card' && (
              <div className="pt-4 border-t border-[#F2EAE0] space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Número do Cartão</label>
                  <input
                    type="text"
                    required
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Nome Impresso no Cartão</label>
                  <input
                    type="text"
                    required
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Como no cartão"
                    className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                  />
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Validade</label>
                    <input
                      type="text"
                      required
                      value={cardExp}
                      onChange={(e) => setCardExp(e.target.value)}
                      placeholder="MM/AA"
                      className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#3D2E24] mb-1">CVV</label>
                    <input
                      type="text"
                      required
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      placeholder="123"
                      className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#3D2E24] mb-1">Parcelas</label>
                    <select
                      value={installments}
                      onChange={(e) => setInstallments(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-[#D9CDBF] rounded-xl px-3.5 py-2.5 text-xs text-[#2D241E] focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                    >
                      <option value="1">1x de {formatCurrency(totalCents)}</option>
                      <option value="2">2x de {formatCurrency(Math.round(totalCents / 2))}</option>
                      <option value="3">3x de {formatCurrency(Math.round(totalCents / 3))}</option>
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Order Summary & Ethical Split */}
        <div className="bg-white rounded-2xl p-6 border border-[#EADBCC] space-y-4 sticky top-24">
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
            disabled={isSubmitting}
            className="w-full bg-[#8E3E19] hover:bg-[#733113] text-white text-xs font-bold py-3.5 rounded-xl cursor-pointer transition-colors shadow-sm hover:shadow disabled:opacity-50"
          >
            {isSubmitting ? 'Processando Pedido...' : 'Finalizar Pedido'}
          </button>
        </div>
      </form>
    </div>
  );
};
