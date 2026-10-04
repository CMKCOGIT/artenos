import React, { useState } from 'react';
import { DollarSign, ShieldCheck, ArrowUpRight, Check, CreditCard, Banknote, ShoppingBag } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';

export const ArtisanFinancialView: React.FC = () => {
  const { currentArtisan, orders, navigate } = useMarketplace();

  const totalPayoutCents = orders.reduce((acc, o) => acc + o.artisanPayoutCents, 0);
  const platformFeeCents = orders.reduce((acc, o) => acc + o.platformFeeCents, 0);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
          Financeiro & Extrato de Repasses
        </h1>
        <p className="text-xs text-[#6B5A4E]">
          Split automático de 90%: o dinheiro das suas vendas vai direto para a sua conta
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-[#EADBCC] shadow-xs">
          <span className="text-xs text-[#8C7667] font-semibold block mb-1">Total Repassado à Artesã (90%)</span>
          <span className="text-3xl font-bold font-serif text-[#1A543E] tabular-nums block">
            {formatCurrency(totalPayoutCents)}
          </span>
          <span className="text-[11px] text-emerald-700 mt-2 block font-medium">
            ✓ Sem retenções abusivas ou taxas ocultas
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EADBCC] shadow-xs">
          <span className="text-xs text-[#8C7667] font-semibold block mb-1">Comissão Plataforma (10%)</span>
          <span className="text-3xl font-bold font-serif text-[#8E3E19] tabular-nums block">
            {formatCurrency(platformFeeCents)}
          </span>
          <span className="text-[11px] text-[#8C7667] mt-2 block">
            Cobre hospedagem, gateway, suporte e publicidade
          </span>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-[#EADBCC] shadow-xs">
          <span className="text-xs text-[#8C7667] font-semibold block mb-1">Chave PIX Cadastrada</span>
          <span className="text-sm font-bold text-[#2D241E] font-mono block truncate mt-1">
            {currentArtisan?.pixKey || 'Chave PIX não cadastrada'}
          </span>
          <span className="text-[11px] text-[#8C7667] mt-3 block font-semibold">
            {currentArtisan?.pixKey ? 'Status: Chave Validada para Split' : 'Cadastre sua chave no perfil da loja'}
          </span>
        </div>
      </div>

      {/* Transações e Repasses detalhados */}
      <div className="bg-white rounded-3xl border border-[#EADBCC] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#F2EAE0]">
          <h2 className="font-serif font-bold text-base text-[#2D241E]">
            Histórico de Pedidos e Repasses da sua Loja
          </h2>
          <p className="text-xs text-[#6B5A4E]">
            Valores discriminados por pedido com confirmação de split
          </p>
        </div>

        {orders.length === 0 ? (
          <div className="p-6">
            <EmptyState
              icon={ShoppingBag}
              title="Nenhum repasse financeiro registrado ainda"
              description="Quando você realizar suas primeiras vendas de peças na Artenós, o extrato detalhado de split e valores líquidos transferidos aparecerá aqui."
              actionText="Cadastrar Peça na Vitrine"
              onAction={() => navigate('/artesa/produtos')}
            />
          </div>
        ) : (
          <div className="divide-y divide-[#F2EAE0]">
            {orders.map((order) => (
              <div key={order.id} className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-[#2D241E]">{order.orderNumber}</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-bold">
                      Split Transferido
                    </span>
                  </div>
                  <p className="text-[#6B5A4E]">Cliente: {order.clientName} ({order.clientEmail})</p>
                  <p className="text-[#8C7667]">Data: {order.createdAt} · Método: {order.paymentMethod.toUpperCase()}</p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-[#8C7667] block">Valor Total do Pedido: {formatCurrency(order.totalCents)}</span>
                  <span className="text-base font-bold text-[#1A543E] tabular-nums block">
                    + {formatCurrency(order.artisanPayoutCents)} (90%)
                  </span>
                  <span className="text-[10px] text-[#8C7667]">Tarifa Artenós: {formatCurrency(order.platformFeeCents)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
