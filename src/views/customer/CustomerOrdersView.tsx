import React from 'react';
import { Package, Truck, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';

export const CustomerOrdersView: React.FC = () => {
  const { orders, navigate } = useMarketplace();

  const statusMap = {
    created: { label: 'Pedido Realizado', step: 1, color: 'text-amber-700 bg-amber-50 border-amber-200' },
    paid: { label: 'Pagamento Aprovado', step: 2, color: 'text-blue-700 bg-blue-50 border-blue-200' },
    in_production: { label: 'Em Confecção pela Artesã', step: 3, color: 'text-purple-700 bg-purple-50 border-purple-200' },
    shipped: { label: 'Enviado / A Caminho', step: 4, color: 'text-emerald-700 bg-emerald-50 border-emerald-200' },
    completed: { label: 'Entregue com Sucesso', step: 5, color: 'text-green-800 bg-green-50 border-green-200' },
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
          Meus Pedidos & Rastreamento
        </h1>
        <p className="text-xs text-[#6B5A4E]">
          Acompanhe o status de confecção e entrega das suas peças exclusivas
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-[#EADBCC] space-y-3">
          <Package className="w-12 h-12 text-[#C4B5A5] mx-auto" />
          <h3 className="font-serif font-bold text-base text-[#2D241E]">Você ainda não fez nenhum pedido</h3>
          <p className="text-xs text-[#6B5A4E]">Navegue pela nossa vitrine para apoiar mestras artesãs do Brasil.</p>
          <button
            onClick={() => navigate('/produtos')}
            className="bg-[#8E3E19] text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
          >
            Explorar Produtos
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const currentStatus = statusMap[order.status] || statusMap.paid;

            return (
              <div
                key={order.id}
                className="bg-white rounded-3xl p-6 border border-[#EADBCC] shadow-xs space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#F2EAE0] gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-serif font-bold text-base text-[#2D241E]">
                        {order.orderNumber}
                      </span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${currentStatus.color}`}>
                        {currentStatus.label}
                      </span>
                    </div>
                    <span className="text-xs text-[#8C7667]">Realizado em {order.createdAt}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-[#8C7667] uppercase block font-semibold">Total Pago</span>
                    <span className="text-base font-bold text-[#8E3E19] tabular-nums">
                      {formatCurrency(order.totalCents)}
                    </span>
                  </div>
                </div>

                {/* Tracking Pipeline Visualizer */}
                <div className="space-y-2">
                  <div className="grid grid-cols-5 text-center text-[10px] font-semibold text-[#8C7667]">
                    <span className={currentStatus.step >= 1 ? 'text-[#8E3E19] font-bold' : ''}>Realizado</span>
                    <span className={currentStatus.step >= 2 ? 'text-[#8E3E19] font-bold' : ''}>Aprovado</span>
                    <span className={currentStatus.step >= 3 ? 'text-[#8E3E19] font-bold' : ''}>Em Produção</span>
                    <span className={currentStatus.step >= 4 ? 'text-[#8E3E19] font-bold' : ''}>Enviado</span>
                    <span className={currentStatus.step >= 5 ? 'text-[#1A543E] font-bold' : ''}>Entregue</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="w-full bg-[#FAF6F0] h-2 rounded-full overflow-hidden border border-[#EADBCC]">
                    <div
                      className="bg-[#8E3E19] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${(currentStatus.step / 5) * 100}%` }}
                    />
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-[#3D2E24] uppercase tracking-wider block">
                    Peças no Pedido
                  </span>
                  {order.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs bg-[#FAF6F0] p-3 rounded-2xl border border-[#EADBCC]">
                      <div className="flex items-center gap-3">
                        <img src={item.imageUrl} alt="" className="w-12 h-12 rounded-xl object-cover border border-[#E0D0C0]" />
                        <div>
                          <h4 className="font-bold text-[#2D241E]">{item.title}</h4>
                          <span className="text-[11px] text-[#8E3E19]">Artesã: {item.artisanName}</span>
                          {item.customizationNotes && (
                            <p className="text-[10px] text-[#6B5A4E]">Obs: {item.customizationNotes}</p>
                          )}
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="font-bold text-[#2D241E] tabular-nums block">
                          {formatCurrency(item.unitPriceCents * item.quantity)}
                        </span>
                        <span className="text-[11px] text-[#8C7667]">Qtd: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer with Tracking info */}
                <div className="pt-3 border-t border-[#F2EAE0] flex flex-col sm:flex-row sm:items-center justify-between text-xs text-[#5C4A3E] gap-2">
                  <div className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#8E3E19]" />
                    <span>Rastreio Correios ({order.shippingMethod}): <strong>{order.trackingCode || 'Aguardando postagem'}</strong></span>
                  </div>
                  <span className="text-[11px] text-[#1A543E]">Split automático 90% repassado à artesã</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
