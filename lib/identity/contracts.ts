/* ================================================================== */
/* IDENTIDAD YUN — Contratos zod del dominio                           */
/* ================================================================== */
/* Registro de vecinos y comercios del territorio. Los cuerpos de las  */
/* rutas /api/auth/* se validan con estos contratos (única fuente de   */
/* verdad); nunca validación manual duplicada.                         */
/* ================================================================== */

import { z } from 'zod';

export const IDENTITY_ROLES = ['vecino', 'artesano', 'comerciante', 'operador', 'turista'] as const;

/** Registro de un habitante del Real (vecino/artesano/...). */
export const registerUserSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().max(120).refine(v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), 'email inválido'),
  role: z.enum(IDENTITY_ROLES).default('vecino'),
  occupation: z.string().trim().max(80).optional(),
  neighborhood: z.string().trim().max(80).optional(),
  interests: z.array(z.string().trim().min(1).max(40)).max(12).optional(),
  acceptTerms: z.boolean().refine(v => v === true, 'debe aceptar términos'),
});

/** Registro de un negocio del territorio (marketplace/planos II). */
export const registerBusinessSchema = z.object({
  businessName: z.string().trim().min(2).max(120),
  ownerName: z.string().trim().min(2).max(80),
  email: z.string().trim().toLowerCase().max(120).refine(v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v), 'email inválido'),
  category: z.string().trim().min(2).max(60),
  address: z.string().trim().max(160).optional(),
  phone: z.string().trim().max(24).optional(),
  acceptTerms: z.boolean().refine(v => v === true, 'debe aceptar términos'),
});

export type RegisterUserInput = z.infer<typeof registerUserSchema>;
export type RegisterBusinessInput = z.infer<typeof registerBusinessSchema>;

/** Entrada unificada de la ruta (kind discrimina vecino/negocio). */
export const registerSchema = z.discriminatedUnion('kind', [
  z.object({ kind: z.literal('user'), ...registerUserSchema.shape }),
  z.object({ kind: z.literal('business'), ...registerBusinessSchema.shape }),
]);

export type RegisterInput = z.infer<typeof registerSchema>;

/** Salida del registro (nunca expone datos sensibles). */
export interface RegisteredUser {
  id: string;
  kind: 'user' | 'business';
  name: string;
  email: string;
  createdAt: number;
}
