/**
 * Financial precision formatters & calculation engines.
 * Avoids floating-point rounding errors by handling monetary values in integer cents.
 */

export const formatCurrency = (cents: number): string => {
  const value = (cents || 0) / 100;
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const parseBRLToCents = (val: string | number): number => {
  if (typeof val === 'number') return Math.round(val * 100);
  const clean = val.replace(/[^\d,]/g, '').replace(',', '.');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : Math.round(parsed * 100);
};

export interface PricingFormulaInput {
  materialCostCents: number;
  hoursSpent: number;
  hourlyRateCents: number;
  extraCostsCents: number; // packaging, labels, ribbons
  profitMarginPercent: number; // e.g. 30 for 30%
  platformFeePercent: number; // e.g. 10 for 10%
}

export interface PricingFormulaOutput {
  laborCostCents: number;
  directCostCents: number;
  operationalCostCents: number;
  totalProductionCostCents: number;
  suggestedSalePriceCents: number;
  platformFeeCents: number;
  netProfitCents: number;
  artisanNetPayoutCents: number;
}

/**
 * Robust pricing formula adhering to artisanal accounting best practices:
 * 1. Labor Cost = Hours * Hourly Rate
 * 2. Total Direct Cost = Materials + Labor + Extras (packaging/tags)
 * 3. Operational Reserve (5% overhead for utilities/tools maintenance)
 * 4. Profit addition based on chosen profit margin
 * 5. Platform fee incorporation so fee doesn't eat into artisan's net profit
 */
export const calculateCraftPrice = (input: PricingFormulaInput): PricingFormulaOutput => {
  const {
    materialCostCents,
    hoursSpent,
    hourlyRateCents,
    extraCostsCents,
    profitMarginPercent,
    platformFeePercent,
  } = input;

  const laborCostCents = Math.round(hoursSpent * hourlyRateCents);
  const directCostCents = materialCostCents + laborCostCents + extraCostsCents;
  const operationalCostCents = Math.round(directCostCents * 0.05); // 5% indirect overhead
  const totalProductionCostCents = directCostCents + operationalCostCents;

  const targetMarginFactor = 1 + profitMarginPercent / 100;
  const priceBeforePlatformFee = totalProductionCostCents * targetMarginFactor;

  // With a platform fee of e.g. 10%, Final Price = PriceBefore / (1 - fee%)
  const feeRate = platformFeePercent / 100;
  const suggestedSalePriceCents = Math.round(priceBeforePlatformFee / (1 - feeRate));

  const platformFeeCents = Math.round(suggestedSalePriceCents * feeRate);
  const artisanNetPayoutCents = suggestedSalePriceCents - platformFeeCents;
  const netProfitCents = artisanNetPayoutCents - totalProductionCostCents;

  return {
    laborCostCents,
    directCostCents,
    operationalCostCents,
    totalProductionCostCents,
    suggestedSalePriceCents,
    platformFeeCents,
    netProfitCents,
    artisanNetPayoutCents,
  };
};
