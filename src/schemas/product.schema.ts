import { z } from 'zod';

export const productSchema = z.object({
  title: z.string().trim().min(3, 'O título da peça deve ter no mínimo 3 caracteres'),
  category: z.string().trim().min(1, 'Selecione uma categoria de artesanato'),
  price: z.coerce.number().positive('O valor deve ser maior que zero'),
  stock: z.coerce.number().int().min(0, 'O estoque não pode ser negativo'),
  description: z.string().trim().min(10, 'A descrição deve ter no mínimo 10 caracteres'),
  story: z.string().trim().optional(),
  materials: z.string().trim().min(2, 'Informe os materiais utilizados (ex: Argila, Algodão, Carnaúba)'),
  dimensions: z.string().trim().min(2, 'Informe as dimensões aproximadas (ex: 25cm x 15cm x 10cm)'),
  weightGrams: z.coerce.number().positive('Informe o peso em gramas para cálculo do frete'),
  productionDays: z.coerce.number().int().min(0, 'Informe o prazo de confecção em dias'),
  isCustomizable: z.boolean().default(false),
  isReadyToShip: z.boolean().default(true),
  badge: z.string().trim().optional(),
  imageUrl: z.string().trim().min(1, 'A foto principal da peça é obrigatória'),
});

export type ProductFormData = z.infer<typeof productSchema>;
