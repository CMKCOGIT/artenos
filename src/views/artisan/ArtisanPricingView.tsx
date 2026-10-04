import React, { useState } from 'react';
import { Calculator, ArrowRight, Sparkles, DollarSign, Info, RotateCcw } from 'lucide-react';
import { useMarketplace } from '../../store/marketplaceStore';
import { formatCurrency, parseBRLToCents } from '../../utils/formatters';

export const ArtisanPricingView: React.FC = () => {
  const { navigate, platformSettings } = useMarketplace();

  // All fields start clean and empty as required
  const [materialCostInput, setMaterialCostInput] = useState('');
  const [hoursSpentInput, setHoursSpentInput] = useState('');
  const [hourlyRateInput, setHourlyRateInput] = useState('');
  const [packagingCostInput, setPackagingCostInput] = useState('');
  const [fixedOverheadInput, setFixedOverheadInput] = useState('');
  const [profitMarginInput, setProfitMarginInput] = useState('');

  // Parsed values in cents and numbers
  const materialCostCents = parseBRLToCents(materialCostInput);
  const hoursSpent = parseFloat(hoursSpentInput) || 0;
  const hourlyRateCents = parseBRLToCents(hourlyRateInput);
  const laborCostCents = Math.round(hoursSpent * hourlyRateCents);
  const packagingCostCents = parseBRLToCents(packagingCostInput);
  const fixedOverheadCents = parseBRLToCents(fixedOverheadInput);
  const profitMarginPercent = parseFloat(profitMarginInput) || 0;
  const platformFeePercent = platformSettings.commissionPercent || 10;

  // 1. Custo Base de Produção (Insumos + Mão de obra + Embalagem + Custos adicionais)
  const baseCostCents = materialCostCents + laborCostCents + packagingCostCents + fixedOverheadCents;

  // 2. Margem de Lucro sobre o custo base
  const profitAmountCents = Math.round(baseCostCents * (profitMarginPercent / 100));

  // 3. Subtotal com Margem de Lucro
  const subtotalWithProfitCents = baseCostCents + profitAmountCents;

  // 4. Preço Sugerido Final considerando a taxa da plataforma (Split 90/10)
  // Fórmula: precoFinal = subtotal / (1 - taxaPlataforma/100)
  const platformFeeDecimal = platformFeePercent / 100;
  const suggestedPriceCents =
    platformFeeDecimal < 1 && baseCostCents > 0
      ? Math.round(subtotalWithProfitCents / (1 - platformFeeDecimal))
      : subtotalWithProfitCents;

  // 5. Taxa retida pela plataforma no split
  const platformFeeAmountCents = Math.round(suggestedPriceCents * platformFeeDecimal);

  // 6. Lucro Líquido Real da Artesã (Margem de lucro + pagamento da mão de obra)
  const netEarningsCents = profitAmountCents + laborCostCents;

  const hasData = baseCostCents > 0;

  const handleReset = () => {
    setMaterialCostInput('');
    setHoursSpentInput('');
    setHourlyRateInput('');
    setPackagingCostInput('');
    setFixedOverheadInput('');
    setProfitMarginInput('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#2D241E]">
            Calculadora de Precificação Inteligente
          </h1>
          <p className="text-xs text-[#6B5A4E]">
            Calcule o preço justo de suas criações considerando materiais, valor da hora, embalagem, lucro e split
          </p>
        </div>

        {hasData && (
          <button
            onClick={handleReset}
            className="self-start sm:self-auto inline-flex items-center gap-1.5 text-xs text-[#8C7667] hover:text-[#8E3E19] px-3 py-1.5 rounded-xl border border-[#D9CDBF] bg-white cursor-pointer transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpar campos</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Form Inputs (Left) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-[#EADBCC] shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
              1. Matéria-Prima (Fios, linhas, argila, tecidos, miçangas)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-[#8C7667]">R$</span>
              <input
                type="text"
                value={materialCostInput}
                onChange={(e) => setMaterialCostInput(e.target.value)}
                placeholder="0,00"
                className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] font-bold focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                2. Tempo de Confecção (Horas)
              </label>
              <input
                type="number"
                step="0.5"
                min="0"
                value={hoursSpentInput}
                onChange={(e) => setHoursSpentInput(e.target.value)}
                placeholder="0"
                className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] px-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] font-bold focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                3. Valor da sua Hora (R$/h)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-[#8C7667]">R$</span>
                <input
                  type="text"
                  value={hourlyRateInput}
                  onChange={(e) => setHourlyRateInput(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] font-bold focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                4. Embalagem & Tags
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-[#8C7667]">R$</span>
                <input
                  type="text"
                  value={packagingCostInput}
                  onChange={(e) => setPackagingCostInput(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] font-bold focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                5. Custos Adicionais / Fixos
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-xs font-semibold text-[#8C7667]">R$</span>
                <input
                  type="text"
                  value={fixedOverheadInput}
                  onChange={(e) => setFixedOverheadInput(e.target.value)}
                  placeholder="0,00"
                  className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] font-bold focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                6. Margem de Lucro Desejada (%)
              </label>
              <div className="relative">
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-[#8C7667]">%</span>
                <input
                  type="number"
                  min="0"
                  max="500"
                  value={profitMarginInput}
                  onChange={(e) => setProfitMarginInput(e.target.value)}
                  placeholder="Ex: 30"
                  className="w-full bg-[#FAF6F0] rounded-xl border border-[#D9CDBF] px-3.5 py-2.5 text-xs sm:text-sm text-[#2D241E] font-bold focus:outline-none focus:ring-1 focus:ring-[#8E3E19]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#3D2E24] mb-1">
                7. Taxa da Plataforma
              </label>
              <div className="p-2.5 rounded-xl border border-[#EADBCC] bg-[#F7F2EB] text-xs font-bold text-[#8E3E19] flex items-center justify-between">
                <span>Comissão Artenós</span>
                <span>{platformFeePercent}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Calculation Result Panel (Right) */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-[#EADBCC] shadow-xs space-y-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8E3E19] block mb-1">
              Resultado em Tempo Real
            </span>
            <h3 className="font-serif font-bold text-xl text-[#2D241E]">
              Preço Sugerido de Venda
            </h3>
          </div>

          {/* Big Price Display */}
          <div className="p-5 rounded-2xl bg-[#FAF6F0] border border-[#EADBCC] text-center space-y-1">
            <span className="text-xs text-[#8C7667] uppercase tracking-wider block">Preço Final Recomendado</span>
            <div className="text-3xl sm:text-4xl font-bold font-serif text-[#8E3E19] tabular-nums">
              {formatCurrency(suggestedPriceCents)}
            </div>
            <p className="text-[11px] text-[#6B5A4E] pt-1">
              Valor ideal para cadastrar na vitrine da loja
            </p>
          </div>

          {/* Transparent Mathematical Breakdown */}
          <div className="space-y-2.5 text-xs text-[#5C4A3E] border-t border-[#F2EAE0] pt-4">
            <div className="flex justify-between">
              <span>Custo de Materiais:</span>
              <span className="font-semibold text-[#2D241E] tabular-nums">{formatCurrency(materialCostCents)}</span>
            </div>

            <div className="flex justify-between">
              <span>Mão de Obra ({hoursSpent}h x {formatCurrency(hourlyRateCents)}):</span>
              <span className="font-semibold text-[#2D241E] tabular-nums">{formatCurrency(laborCostCents)}</span>
            </div>

            <div className="flex justify-between">
              <span>Embalagem & Custos Fixos:</span>
              <span className="font-semibold text-[#2D241E] tabular-nums">{formatCurrency(packagingCostCents + fixedOverheadCents)}</span>
            </div>

            <div className="flex justify-between font-bold border-t border-[#F2EAE0] pt-1.5 text-[#2D241E]">
              <span>Custo Base de Produção:</span>
              <span className="tabular-nums">{formatCurrency(baseCostCents)}</span>
            </div>

            <div className="flex justify-between text-[#1A543E]">
              <span>Margem de Lucro ({profitMarginPercent}%):</span>
              <span className="font-semibold tabular-nums">+{formatCurrency(profitAmountCents)}</span>
            </div>

            <div className="flex justify-between text-[#8E3E19]">
              <span>Taxa da Plataforma ({platformFeePercent}% split):</span>
              <span className="font-semibold tabular-nums">-{formatCurrency(platformFeeAmountCents)}</span>
            </div>

            <div className="flex justify-between font-bold border-t border-[#F2EAE0] pt-2 text-sm text-[#1A543E]">
              <span>Remuneração Líquida da Artesã:</span>
              <span className="tabular-nums">{formatCurrency(netEarningsCents)}</span>
            </div>
          </div>

          {/* Action button */}
          <button
            onClick={() => navigate('/artesa/produtos')}
            className="w-full bg-[#8E3E19] hover:bg-[#733113] text-white text-xs font-bold py-3.5 rounded-xl transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2"
          >
            <span>Ir para Cadastro de Produtos</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
