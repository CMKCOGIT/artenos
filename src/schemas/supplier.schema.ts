import { z } from 'zod';

export const supplierMaterialSchema = z.object({
  name: z.string().trim().min(3, 'Nome do material é obrigatório'),
  category: z.string().trim().min(2, 'Categoria do insumo é obrigatória'),
  description: z.string().trim().min(10, 'Descrição detalhada do insumo'),
  price: z.coerce.number().positive('Preço unitário deve ser maior que zero'),
  unit: z.string().trim().min(1, 'Unidade de medida (ex: kg, rolo 500g, novelo, metro)'),
  minOrderQty: z.coerce.number().int().positive('Quantidade mínima para pedido'),
  stockQty: z.coerce.number().int().min(0, 'Estoque disponível'),
  location: z.string().trim().min(2, 'Local de envio (Cidade - UF)'),
  batchCode: z.string().trim().optional(),
  shadeTone: z.string().trim().optional(),
  imageUrl: z.string().trim().min(1, 'Foto do insumo é obrigatória'),
});

export type SupplierMaterialFormData = z.infer<typeof supplierMaterialSchema>;

export const supplierQuoteSchema = z.object({
  price: z.coerce.number().positive('Valor do orçamento deve ser maior que zero'),
  shippingCost: z.coerce.number().min(0, 'Custo de frete (ou 0 se grátis)'),
  shippingDays: z.coerce.number().int().positive('Prazo estimado de entrega em dias'),
  notes: z.string().trim().min(5, 'Observações e condições comerciais'),
});

export type SupplierQuoteFormData = z.infer<typeof supplierQuoteSchema>;
