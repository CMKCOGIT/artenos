import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().email('Informe um e-mail válido'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
  role: z.enum(['customer', 'artisan', 'supplier', 'admin']).default('customer'),
  rememberMe: z.boolean().optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerCustomerSchema = z.object({
  name: z.string().trim().min(3, 'Nome completo deve ter no mínimo 3 caracteres'),
  email: z.string().trim().email('Informe um e-mail válido'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
  phone: z.string().trim().min(10, 'Informe um telefone com DDD válido'),
  cpf: z.string().trim().optional(),
});

export type RegisterCustomerFormData = z.infer<typeof registerCustomerSchema>;

export const registerArtisanSchema = z.object({
  name: z.string().trim().min(3, 'Nome deve ter no mínimo 3 caracteres'),
  studioName: z.string().trim().min(2, 'Nome do atelier/estúdio é obrigatório'),
  email: z.string().trim().email('Informe um e-mail válido'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
  phone: z.string().trim().min(10, 'WhatsApp para contato é obrigatório'),
  location: z.string().trim().min(2, 'Cidade e Estado são obrigatórios (ex: Caruaru - PE)'),
  specialties: z.string().trim().min(2, 'Informe ao menos uma técnica ou especialidade artesanal'),
  pixKey: z.string().trim().optional(),
  bio: z.string().trim().optional(),
});

export type RegisterArtisanFormData = z.infer<typeof registerArtisanSchema>;

export const registerSupplierSchema = z.object({
  name: z.string().trim().min(3, 'Nome do responsável é obrigatório'),
  companyName: z.string().trim().min(2, 'Razão Social ou Nome Fantasia é obrigatório'),
  cnpj: z.string().trim().min(14, 'Informe um CNPJ válido'),
  category: z.string().trim().min(2, 'Categoria principal de insumos é obrigatória'),
  email: z.string().trim().email('Informe um e-mail corporativo válido'),
  password: z.string().min(6, 'A senha deve conter no mínimo 6 caracteres'),
  phone: z.string().trim().min(10, 'Telefone de contato comercial é obrigatório'),
  location: z.string().trim().min(2, 'Cidade e Estado são obrigatórios'),
});

export type RegisterSupplierFormData = z.infer<typeof registerSupplierSchema>;
