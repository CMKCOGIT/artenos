export class ShippingService {
  /**
   * Cálculo dimensional de frete.
   * Integração com Melhor Envio / Correios configurada para a próxima etapa.
   */
  static async calculateShipping(cep: string, weightGrams: number = 500): Promise<{
    pac: { priceCents: number; days: number };
    sedex: { priceCents: number; days: number };
  } | null> {
    const cleanCep = cep.replace(/\D/g, '');
    if (cleanCep.length !== 8) return null;

    const baseCents = 2490 + Math.floor(weightGrams / 500) * 450;
    return {
      pac: { priceCents: baseCents, days: 6 },
      sedex: { priceCents: baseCents + 1800, days: 2 },
    };
  }
}
