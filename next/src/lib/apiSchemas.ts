import { INPUT_LIMITS } from "@/lib/validation";
import { z } from "zod";

const optionalUrl = z.string().max(2048).optional().nullable();
const imagePosition = z.enum(["top", "center", "bottom", "left", "right"]);

export const blogCreateSchema = z
  .object({
    title: z.string().trim().min(1).max(INPUT_LIMITS.BLOG_TITLE_MAX),
    content: z.string().trim().min(1).max(INPUT_LIMITS.BLOG_CONTENT_MAX),
    imageUrl: optionalUrl,
    imagePosition: imagePosition.optional().default("center"),
  })
  .strict();

export const blogUpdateSchema = blogCreateSchema
  .omit({ imagePosition: true })
  .extend({ imagePosition: imagePosition.optional() })
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required.");

const newsContents = z.unknown().refine((value) => {
  if (value === null || value === undefined) return false;
  try {
    return JSON.stringify(value).length <= INPUT_LIMITS.NEWS_CONTENT_MAX;
  } catch {
    return false;
  }
}, `Contents must be at most ${INPUT_LIMITS.NEWS_CONTENT_MAX} characters.`);

const newsFields = {
  date: z.string().min(1).max(64),
  title: z.string().trim().min(1).max(INPUT_LIMITS.NEWS_TITLE_MAX),
  contents: newsContents,
  url: optionalUrl,
  color: z.enum(["black", "red", "blue", "green", "orange"]).optional(),
  pinned: z.boolean().optional(),
};

export const newsCreateSchema = z.object(newsFields).strict();

export const newsUpdateSchema = z
  .object(newsFields)
  .partial()
  .refine((value) => Object.keys(value).length > 0, "At least one field is required.");

export const contactRequestSchema = z
  .object({
    name: z.string().max(INPUT_LIMITS.NAME_MAX),
    email: z.string().max(INPUT_LIMITS.EMAIL_MAX),
    phone: z.string().max(INPUT_LIMITS.PHONE_MAX).optional().default(""),
    inquiry: z.string().max(INPUT_LIMITS.INQUIRY_MAX),
    token: z.string().max(4096),
  })
  .strict();

export const inquiryDeleteSchema = z
  .object({ id: z.union([z.number().int().positive(), z.string().regex(/^\d+$/)]) })
  .strict();
