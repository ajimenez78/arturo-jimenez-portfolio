import OpenAI from 'openai';
import { digitalTwinInstructions } from '@/lib/digital-twin';
import type { Locale } from '@/lib/content';

export const runtime = 'nodejs';

type ChatMessage = {
  role: 'user' | 'assistant';
  content: string;
};

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 12;
const buckets = new Map<string, { count: number; resetAt: number }>();

function json(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

function clientId(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
    || request.headers.get('x-real-ip')
    || 'local';
}

function rateLimited(id: string) {
  const now = Date.now();
  const current = buckets.get(id);
  if (!current || current.resetAt <= now) {
    buckets.set(id, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  current.count += 1;
  return current.count > MAX_REQUESTS;
}

function validMessages(value: unknown): value is ChatMessage[] {
  if (!Array.isArray(value) || value.length === 0 || value.length > 10) return false;
  let totalLength = 0;
  for (const message of value) {
    if (!message || typeof message !== 'object') return false;
    const candidate = message as Partial<ChatMessage>;
    if (candidate.role !== 'user' && candidate.role !== 'assistant') return false;
    if (typeof candidate.content !== 'string' || candidate.content.trim().length === 0 || candidate.content.length > 1_500) return false;
    totalLength += candidate.content.length;
  }
  return totalLength <= 8_000 && value.at(-1)?.role === 'user';
}

export async function POST(request: Request) {
  let body: { locale?: unknown; messages?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }

  const locale: Locale = body.locale === 'es' ? 'es' : 'en';
  const errorCopy = locale === 'es'
    ? {
        invalid: 'No he podido leer ese mensaje.',
        limited: 'Hay muchas conversaciones en este momento. Inténtalo de nuevo en unos minutos.',
        unavailable: 'El Gemelo Virtual no está disponible en este momento. Inténtalo de nuevo más tarde.',
      }
    : {
        invalid: 'I could not read that message.',
        limited: 'There are many conversations right now. Please try again in a few minutes.',
        unavailable: 'The Virtual Twin is unavailable right now. Please try again later.',
      };

  if (!validMessages(body.messages)) return json({ error: errorCopy.invalid }, 400);
  if (rateLimited(clientId(request))) return json({ error: errorCopy.limited }, 429);
  if (!process.env.OPENAI_API_KEY) return json({ error: errorCopy.unavailable }, 503);

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await openai.responses.create({
      model: 'gpt-6-luna',
      instructions: digitalTwinInstructions(locale),
      input: body.messages,
      max_output_tokens: 400,
      store: false,
    });

    const answer = response.output_text.trim();
    if (!answer) return json({ error: errorCopy.unavailable }, 502);
    return json({ answer });
  } catch (error) {
    console.error('Digital Twin request failed', error instanceof Error ? error.message : 'Unknown error');
    return json({ error: errorCopy.unavailable }, 502);
  }
}
