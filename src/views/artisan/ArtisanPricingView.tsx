import React, { useState } from 'react';
import { Calculator, ArrowRight, Sparkles, Check, DollarSign } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { calculateCraftPrice, formatCurrency, parseBRLToCents } from '../../utils/formatters';

export const ArtisanPricingView: React.FC = () => {
  const { navigate, platformSettings } = useMarketplace();

  const [materialCostInput, setMaterialCostInput] = useState('20,00');
  const [hoursSpentInput, setHoursSpentInput] = useState('4');
  const [hourlyRateInput, setHourlyRateInput] = useState('15,00');
  const [extraCostsInput, setExtraCostsInput] = useState('5,00');
  const [profitMarginInput, setProfitMarginInput] = useState('30');

  const materialCostCents = parseBRLToCents(materialCostInput);
  const hoursSpent = parseFloat(hoursSpentInput) || 0;
  const hourlyRateCents = parseBRLToCents(hourlyRateInput);
  const extraCostsCents = parseBRLToCents(extraCostsInput);
  const profitMarginPercent = parseFloat(profitMarginInput) || 0;

  const result = calculateCraftPrice({
    materialCostCents,
    hoursSpent,
    hourlyRateCents,
    extraCostsCents,
    profitMarginPercent,
    platformFeePercent: platformSettings.commissionPercent,
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
          Calculadora de Precificação Artesanal
        </h1>
        <p className="text-xs text-[#6B5A4E]">
          Nunca mais trabalhe de graça: calcule o valor real da sua hora, custos ocultos e garanta seu lucro justo
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (Left) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#EADBCC] shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
              Custo de Materiais (Barbantes, tecidos, argilas, tintas)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-[#8C7667]">R$</span>
              <input
                type="text"
                value={materialCostInput}
                onChange={(e) => setMaterialCostInput(e.target.value)}
                placeholder="20,00"
                className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] font-bold focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                Tempo Gasto na Peça (Horas)
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={hoursSpentInput}
                onChange={(e) => setHoursSpentInput(e.target.value)}
                className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] px-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] font-bold focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                Valor da sua Hora de Trabalho (R$/h)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-[#8C7667]">R$</span>
                <input
                  type="text"
                  value={hourlyRateInput}
                  onChange={(e) => setHourlyRateInput(e.target.value)}
                  placeholder="15,00"
                  className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] font-bold focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                Custos Extras (Embalagem, fitas, tags)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-[#8C7667]">R$</span>
                <input
                  type="text"
                  value={extraCostsInput}
                  onChange={(e) => setExtraCostsInput(e.target.value)}
                  placeholder="5,00"
                  className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] font-bold focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                Margem de Lucro Desejada (%)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="5"
                  max="100"
                  value={profitMarginInput}
                  onChange={(e) => setProfitMarginInput(e.target.value)}
                  className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] px-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] font-bold focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-[#8C7667]">%</span>
              </div>
            </div>
          </div>

          <div className="bg-[#FAF6F0] p-4 rounded-2xl border border-[#EADBCC] text-xs text-[#5C4A3E]">
            <span className="font-bold text-[#8E3E19] block mb-1">Como a fórmula te protege:</span>
            <p className="leading-relaxed">
              A comissão da Artenós ({platformSettings.commissionPercent}%) é incorporada ao valor final, garantindo que o seu <strong>lucro líquido desejado permaneça 100% preservado</strong> no seu repasse.
            </p>
          </div>
        </div>

        {/* Results Card (Right) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-[#EADBCC] shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-base text-[#2D241E] pb-3 border-b border-[#F2EAE0]">
            Detalhamento Contábil
          </h2>

          <div className="space-y-2.5 text-xs text-[#5C4A3E]">
            <div className="flex justify-between">
              <span>Materiais:</span>
              <span className="font-semibold text-[#2D241E] tabular-nums">{formatCurrency(materialCostCents)}</span>
            </div>
            <div className="flex justify-between">
              <span>Mão de Obra ({hoursSpent}h):</span>
              <span className="font-semibold text-[#2D241E] tabular-nums">{formatCurrency(result.laborCostCents)}</span>
            </div>
            <div className="flex justify-between">
              <span>Embalagem & Extras:</span>
              <span className="font-semibold text-[#2D241E] tabular-nums">{formatCurrency(extraCostsCents)}</span>
            </div>
            <div className="flex justify-between">
              <span>Custos Operacionais Indiretos (5%):</span>
              <span className="font-semibold text-[#2D241E] tabular-nums">{formatCurrency(result.operationalCostCents)}</span>
            </div>
            <div className="pt-2 border-t border-[#F2EAE0] flex justify-between font-bold text-[#2D241E]">
              <span>Custo de Produção Total:</span>
              <span className="tabular-nums">{formatCurrency(result.totalProductionCostCents)}</span>
            </div>
            <div className="flex justify-between text-[#8C7667]">
              <span>Tarifa da Plataforma ({platformSettings.commissionPercent}%):</span>
              <span className="tabular-nums">{formatCurrency(result.platformFeeCents)}</span>
            </div>
            <div className="flex justify-between font-bold text-[#1A543E]">
              <span>Seu Lucro Líquido Garantido:</span>
              <span className="tabular-nums">{formatCurrency(result.netProfitCents)}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-[#EADBCC]">
            <div className="bg-[#8E3E19] text-white p-5 rounded-2xl text-center shadow-sm mb-4">
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#F5C7A9]">
                Preço Recomendado de Venda
              </span>
              <span className="text-3xl font-extrabold font-serif tabular-nums">
                {formatCurrency(result.suggestedSalePriceCents)}
              </span>
            </div>

            <button
              onClick={() => navigate('/artesa/produtos')}
              className="w-full bg-[#2D241E] hover:bg-black text-white py-3 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Aplicar este Preço em Novo Produto</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
