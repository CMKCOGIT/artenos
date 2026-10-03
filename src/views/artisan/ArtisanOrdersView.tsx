import React from 'react';
import { ShoppingBag, Truck, CheckCircle2, Clock, ShieldCheck, ArrowRight } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';

export const ArtisanOrdersView: React.FC = () => {
  const { orders, updateOrderStatus, currentArtisan } = useMarketplace();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
          Pedidos dos Clientes
        </h1>
        <p className="text-xs text-[#6B5A4E]">
          Acompanhe o pagamento, inicie a produção e envie o código de rastreamento
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => {
          const statusLabels: Record<string, { label: string; color: string }> = {
            created: { label: 'Pedido Criado', color: 'bg-amber-100 text-amber-900 border-amber-300' },
            paid: { label: 'Pagamento Aprovado', color: 'bg-blue-100 text-blue-900 border-blue-300' },
            in_production: { label: 'Em Confecção', color: 'bg-purple-100 text-purple-900 border-purple-300' },
            shipped: { label: 'Enviado / Em Trânsito', color: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
            completed: { label: 'Entregue e Concluído', color: 'bg-green-100 text-green-900 border-green-300' },
          };

          return (
            <div
              key={order.id}
              className="bg-white p-6 rounded-3xl border border-[#EADBCC] shadow-xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-[#F2EAE0] gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-base text-[#2D241E]">{order.orderNumber}</span>
                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusLabels[order.status].color}`}>
                      {statusLabels[order.status].label}
                    </span>
                  </div>
                  <p className="text-xs text-[#8C7667] mt-0.5">
                    Cliente: <strong>{order.clientName}</strong> · Telefone/WhatsApp: <strong>{order.clientPhone}</strong>
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-[10px] text-[#8C7667] uppercase block font-semibold">Seu Repasse Líquido (90%)</span>
                  <span className="text-base font-bold text-[#1A543E] tabular-nums">
                    {formatCurrency(order.artisanPayoutCents)}
                  </span>
                </div>
              </div>

              {/* Items and Address */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#EADBCC] space-y-2">
                  <span className="font-bold text-[#3D2E24] uppercase text-[10px] block">Peças a confeccionar:</span>
                  {order.items.map((i, idx) => (
                    <div key={idx} className="flex justify-between items-center">
                      <span className="font-semibold text-[#2D241E]">{i.quantity}x {i.title}</span>
                      <span className="tabular-nums">{formatCurrency(i.unitPriceCents * i.quantity)}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-[#FAF6F0] p-3.5 rounded-2xl border border-[#EADBCC] space-y-1">
                  <span className="font-bold text-[#3D2E24] uppercase text-[10px] block">Endereço de Entrega do Cliente:</span>
                  <p className="text-[#2D241E]">{order.clientAddress.street}, {order.clientAddress.number} {order.clientAddress.complement}</p>
                  <p className="text-[#6B5A4E]">{order.clientAddress.neighborhood} - {order.clientAddress.city}/{order.clientAddress.state} - CEP: {order.clientAddress.cep}</p>
                  <p className="text-[#8E3E19] font-medium pt-1">Método: Correios {order.shippingMethod}</p>
                </div>
              </div>

              {/* Action Buttons to Advance Order State */}
              <div className="pt-3 border-t border-[#F2EAE0] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-1.5 text-[#5C4A3E]">
                  <Truck className="w-4 h-4 text-[#8E3E19]" />
                  <span>Código de Rastreio: <strong>{order.trackingCode || 'Pendente de postagem'}</strong></span>
                </div>

                <div className="flex items-center gap-2">
                  {order.status === 'paid' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'in_production')}
                      className="px-4 py-2 bg-[#8E3E19] hover:bg-[#733113] text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      Iniciar Confecção no Atelier
                    </button>
                  )}
                  {order.status === 'in_production' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'shipped', `BR-CORREIOS-${Math.floor(10000000 + Math.random() * 90000000)}`)}
                      className="px-4 py-2 bg-[#1A543E] hover:bg-[#123D2C] text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      Marcar como Enviado (Gerar Rastreio)
                    </button>
                  )}
                  {order.status === 'shipped' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                      className="px-4 py-2 bg-[#2D241E] hover:bg-black text-white rounded-xl font-bold cursor-pointer transition-colors shadow-xs"
                    >
                      Marcar como Entregue
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
