/* ================================================================== */
/* CONTRACT ISA-AI — Envelope de salida estructurada                   */
/* ================================================================== */
/* Espejo ejecutable del schema de referencia `isa-ai.schema.json`     */
/* (MEXA-AI semantic envelope). `additionalProperties: false` del      */
/* schema se traduce en `.strict()`: cualquier clave extra invalida     */
/* el contrato (fail-closed en la capa HTTP).                          */
/* ================================================================== */

import { z } from 'zod';

export const isaAiHeptaDomainSchema = z.enum([
  'tourism',
  'rdm',
  'infra',
  'security',
  'observability',
  'blockchain',
  'governance',
]);

export const isaAiStructuredTypeSchema = z.enum([
  'text',
  'tool',
  'faq',
  'route',
  'event',
  'rdm-node',
  'diagnostic',
]);

export const isaAiToolKindSchema = z.enum([
  'filter',
  'security',
  'radar',
  'mdx',
  'blockchain',
  'governance',
  'library',
]);

export const isaAiToolStatusSchema = z.enum(['applied', 'failed', 'skipped']);

export const isaAiStructuredSchema = z.object({
  type: isaAiStructuredTypeSchema,
  toolName: z.string().optional(),
  tools: z
    .array(
      z.object({
        name: z.string(),
        kind: isaAiToolKindSchema,
        status: isaAiToolStatusSchema,
        result: z.unknown().optional(),
      }),
    )
    .default([]),
  pipelines: z
    .object({
      inputHex: z.string().optional(),
      outputHex: z.string().optional(),
    })
    .optional(),
  data: z.unknown().optional(),
});

export const isaAiEnvelopeSchema = z
  .object({
    version: z.string().min(1),
    provider: z.literal('isa-ai'),
    model: z.string().min(1),
    traceId: z.string().min(1),
    intent: z.string().min(1),
    confidence: z.number().min(0).max(1).optional(),
    heptaDomain: isaAiHeptaDomainSchema.optional(),
    topic: z.string().optional(),
    sessionId: z.string().optional(),
    content: z.string(),
    structured: isaAiStructuredSchema.optional(),
    policy: z
      .object({
        alignment: z.string().optional(),
        dataScope: z.string().optional(),
        korimaCodex: z
          .object({
            appliedPolicies: z.array(z.string()).default([]),
          })
          .optional(),
      })
      .optional(),
    observability: z
      .object({
        radars: z
          .array(
            z.object({
              name: z.string(),
              status: z.string(),
              latencyMs: z.number().nonnegative().optional(),
            }),
          )
          .default([]),
        latencyMs: z.number().nonnegative().optional(),
      })
      .optional(),
    security: z
      .object({
        systems: z
          .array(
            z.object({
              name: z.string(),
              status: z.string(),
              decision: z.string().optional(),
            }),
          )
          .default([]),
      })
      .optional(),
    kb: z
      .object({
        entriesUsed: z
          .array(
            z.object({
              id: z.string(),
              score: z.number().min(0).max(1).optional(),
            }),
          )
          .default([]),
      })
      .optional(),
  })
  .strict();

export type IsaAiHeptaDomain = z.infer<typeof isaAiHeptaDomainSchema>;
export type IsaAiStructuredType = z.infer<typeof isaAiStructuredTypeSchema>;
export type IsaAiToolKind = z.infer<typeof isaAiToolKindSchema>;
export type IsaAiToolStatus = z.infer<typeof isaAiToolStatusSchema>;
export type IsaAiStructured = z.infer<typeof isaAiStructuredSchema>;
export type IsaAiEnvelope = z.infer<typeof isaAiEnvelopeSchema>;
