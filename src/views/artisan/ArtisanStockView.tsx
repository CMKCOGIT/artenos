import React from 'react';
import { Boxes, AlertTriangle, CheckCircle2, Plus, Minus, ArrowRight, Package } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency } from '../../utils/formatters';
import { EmptyState } from '../../components/common/EmptyState';

export const ArtisanStockView: React.FC = () => {
  const { products, currentArtisan, updateProductStock, navigate } = useMarketplace();

  const artisanProducts = currentArtisan
    ? products.filter((p) => p.artisanId === currentArtisan.id)
    : products;
  const lowStock = artisanProducts.filter((p) => p.stock <= 1);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
          Controle de Estoque Físico & Baixa Automática
        </h1>
        <p className="text-xs text-[#6B5A4E]">
          Evite vendas além da sua capacidade: o estoque é reservado e baixado automaticamente ao aprovar o pedido
        </p>
      </div>

      {artisanProducts.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Nenhum produto cadastrado no estoque ainda"
          description="Quando você cadastrar suas primeiras peças na loja, poderá gerenciar unidades para pronta entrega e controle de encomendas aqui."
          actionText="Cadastrar Primeiro Produto"
          onAction={() => navigate('/artesa/produtos')}
        />
      ) : (
        <>
          {lowStock.length > 0 && (
            <div className="bg-rose-50 border border-rose-200 p-4 rounded-2xl flex items-center justify-between text-xs text-rose-800">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
                <span>Você tem <strong>{lowStock.length} peça(s) com estoque baixo</strong> (≤ 1 unidade). Reabasteça para não perder vendas!</span>
              </div>
            </div>
          )}

          {/* Stock Table */}
          <div className="bg-white rounded-3xl border border-[#EADBCC] shadow-xs overflow-hidden">
            <div className="p-4 border-b border-[#F2EAE0] flex items-center justify-between">
              <h2 className="font-serif font-bold text-sm text-[#2D241E]">Estoque por Peça</h2>
              <span className="text-xs text-[#8C7667]">{artisanProducts.length} itens monitorados</span>
            </div>

            <div className="divide-y divide-[#F2EAE0]">
              {artisanProducts.map((prod) => (
                <div key={prod.id} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img src={prod.imageUrl} alt="" className="w-14 h-14 rounded-xl object-cover border border-[#EADBCC] shrink-0" />
                    <div>
                      <h3 className="font-bold text-sm text-[#2D241E]">{prod.title}</h3>
                      <span className="text-xs text-[#8C7667]">{prod.category} · {formatCurrency(prod.priceCents)}</span>
                      <div className="mt-1">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          prod.stock > 1 ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                        }`}>
                          {prod.stock > 1 ? 'Em Estoque Normal' : prod.stock === 1 ? 'Última Unidade!' : 'Esgotado / Sob Encomenda'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-6 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#F2EAE0]">
                    <div className="text-right">
                      <span className="text-[10px] text-[#8C7667] uppercase block font-semibold">Qtd Disponível</span>
                      <span className="text-xl font-bold font-serif text-[#2D241E] tabular-nums">
                        {prod.stock}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 bg-[#FAF6F0] p-1.5 rounded-xl border border-[#D9CDBF]">
                      <button
                        onClick={() => updateProductStock(prod.id, prod.stock - 1)}
                        className="w-8 h-8 rounded-lg bg-white text-sm font-bold hover:bg-[#F2EAE0] cursor-pointer flex items-center justify-center shadow-xs"
                        title="Diminuir unidade física"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => updateProductStock(prod.id, prod.stock + 1)}
                        className="w-8 h-8 rounded-lg bg-white text-sm font-bold hover:bg-[#F2EAE0] cursor-pointer flex items-center justify-center shadow-xs"
                        title="Adicionar unidade física"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
