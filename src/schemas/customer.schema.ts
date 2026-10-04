import { z } from 'zod';

export const addressSchema = z.object({
  recipientName: z.string().trim().min(3, 'Nome de quem vai receber a encomenda'),
  cep: z.string().trim().min(8, 'CEP válido é obrigatório'),
  street: z.string().trim().min(3, 'Endereço/Rua'),
  number: z.string().trim().min(1, 'Número'),
  complement: z.string().trim().optional(),
  neighborhood: z.string().trim().min(2, 'Bairro'),
  city: z.string().trim().min(2, 'Cidade'),
  state: z.string().trim().length(2, 'UF (ex: SP, PE, MG)'),
});

export type AddressFormData = z.infer<typeof addressSchema>;

export const checkoutSchema = z.object({
  clientName: z.string().trim().min(3, 'Nome completo'),
  clientEmail: z.string().trim().email('E-mail válido para confirmação do pedido'),
  clientPhone: z.string().trim().min(10, 'Telefone com DDD para rastreio'),
  shippingAddress: addressSchema,
  paymentMethod: z.enum(['pix', 'credit_card']),
  shippingMethod: z.enum(['PAC', 'Sedex', 'Transportadora']),
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;

export const chatMessageSchema = z.object({
  content: z.string().trim().min(1, 'A mensagem não pode estar vazia'),
});

export type ChatMessageFormData = z.infer<typeof chatMessageSchema>;
