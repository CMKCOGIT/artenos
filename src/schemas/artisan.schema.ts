import { z } from 'zod';

export const artisanProfileSchema = z.object({
  name: z.string().trim().min(3, 'Nome é obrigatório'),
  studioName: z.string().trim().min(2, 'Nome do Atelier/Estúdio é obrigatório'),
  bio: z.string().trim().min(10, 'Escreva uma breve biografia sobre seu trabalho'),
  story: z.string().trim().min(10, 'Conte como começou sua trajetória artesanal'),
  location: z.string().trim().min(3, 'Cidade e Estado (ex: Tiradentes - MG)'),
  specialties: z.string().trim().min(2, 'Especialidades separadas por vírgula'),
  phone: z.string().trim().min(10, 'WhatsApp para suporte'),
  instagram: z.string().trim().optional(),
  pixKey: z.string().trim().min(3, 'Chave Pix para repasses de vendas (split automático)'),
  bankName: z.string().trim().optional(),
});

export type ArtisanProfileFormData = z.infer<typeof artisanProfileSchema>;

export const assistedSignupSchema = z.object({
  artisanName: z.string().trim().min(3, 'Informe seu nome completo'),
  phoneWhatsapp: z.string().trim().min(10, 'Informe seu WhatsApp com DDD'),
  city: z.string().trim().min(2, 'Informe sua cidade'),
  state: z.string().trim().min(2, 'Informe seu estado (UF)'),
  craftType: z.string().trim().min(2, 'Qual técnica você pratica? (ex: Cerâmica, Crochê, Madeira)'),
  preferredChannel: z.enum(['whatsapp', 'call']).default('whatsapp'),
  preferredTime: z.string().trim().optional(),
  notes: z.string().trim().optional(),
});

export type AssistedSignupFormData = z.infer<typeof assistedSignupSchema>;
