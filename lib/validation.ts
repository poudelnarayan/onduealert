import { z } from "zod";

export const emailSchema = z.string().email().max(320);
export const passwordSchema = z.string().min(8).max(72);

export const reminderCategorySchema = z.enum([
  "TAX",
  "CONTRACT",
  "LICENSE",
  "CUSTOM",
]);

export const reminderFrequencySchema = z.enum([
  "ONE_TIME",
  "WEEKLY",
  "MONTHLY",
  "YEARLY",
  "CUSTOM",
]);

export const offsetsDaysSchema = z
  .array(z.number().int().min(0).max(3650))
  .max(12)
  .default([]);

export const dateOnlySchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/);

export const createReminderSchema = z.object({
  clientName: z.string().max(140).optional().nullable(),
  title: z.string().min(1).max(140),
  description: z.string().max(2000).optional().nullable(),
  category: reminderCategorySchema,
  frequency: reminderFrequencySchema,
  interval: z.number().int().min(1).max(365).optional(),
  customIntervalDays: z.number().int().min(1).max(3650).optional(),
  cronExpression: z.string().max(200).optional(),
  dueDate: dateOnlySchema,
  timezone: z.string().min(1).max(64).optional(),
  offsetsDays: offsetsDaysSchema,
});

export const updateReminderSchema = createReminderSchema.partial().extend({
  // still validate if present
  dueDate: dateOnlySchema.optional(),
});


