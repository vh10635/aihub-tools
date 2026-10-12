import { createServerFn } from '@tanstack/react-start';
import { getRequestHeader } from '@tanstack/react-start/server';

type Candidate = { name: string; category: string; price: string; description: string };
type Input = { query: string; freeOnly: boolean; candidates: Candidate[] };

const hits = new Map<string, number[]>();
function limited(key: string) {
  const now = Date.now();
  const list = (hits.get(key) ?? []).filter(t => now - t < 60_000);
  list.push(now);
  hits.set(key, list);
  return list.length > 8;
}

export const askAiHub = createServerFn({ method: 'POST' })
  .inputValidator((data: Input) => {
    const query = String(data?.query ?? '').trim().slice(0, 300);
    if (!query) throw new Error('Please describe what you want to do.');
    const candidates = (Array.isArray(data?.candidates) ? data.candidates : []).slice(0, 25).map(c => ({
      name: String(c.name).slice(0, 80), category: String(c.category).slice(0, 80), price: String(c.price).slice(0, 20), description: String(c.description).slice(0, 160),
    }));
    return { query, freeOnly: !!data?.freeOnly, candidates };
  })
  .handler(async ({ data }): Promise<{ ok: boolean; answer: string; picks: string[]; error?: string }> => {
    const ip = getRequestHeader('cf-connecting-ip') || getRequestHeader('x-forwarded-for') || 'anon';
    if (limited(ip)) return { ok: false, answer: '', picks: [], error: 'rate_limited' };
    const key = process.env.LOVABLE_API_KEY;
    if (!key) return { ok: false, answer: '', picks: [], error: 'not_configured' };
    const list = data.candidates.map(c => `- ${c.name} | ${c.category} | ${c.price} | ${c.description}`).join('\n');
    try {
      const res = await fetch('https://ai.gateway.lovable.dev/v1/responses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Lovable-API-Key': key, 'X-Lovable-AIG-SDK': 'fetch' },
        body: JSON.stringify({
          model: 'openai/gpt-6-astra',
          stream: true,
          store: false,
          reasoning: { effort: 'low' },
          instructions: `You help beginners pick AI tools. Answer in 2-5 plain, friendly sentences with practical first steps. Then pick 3-6 tools ONLY from the candidate list, using their exact names.${data.freeOnly ? ' The user wants free options only; never pick Paid tools.' : ''}`,
          input: `User goal: ${data.query}\n\nCandidate tools (name | category | price | description):\n${list}`,
          text: { format: { type: 'json_schema', name: 'hub_answer', strict: true, schema: { type: 'object', additionalProperties: false, required: ['answer', 'picks'], properties: { answer: { type: 'string' }, picks: { type: 'array', items: { type: 'string' } } } } } },
        }),
      });
      if (!res.ok || !res.body) return { ok: false, answer: '', picks: [], error: `status_${res.status}` };
      const reader = res.body.getReader(); const dec = new TextDecoder(); let buf = ''; let text = '';
      for (;;) {
        const { done, value } = await reader.read(); if (done) break;
        buf += dec.decode(value, { stream: true });
        const lines = buf.split('\n'); buf = lines.pop() ?? '';
        for (const line of lines) {
          if (!line.startsWith('data:')) continue;
          const payload = line.slice(5).trim(); if (!payload || payload === '[DONE]') continue;
          try { const ev = JSON.parse(payload); if (ev.type === 'response.output_text.delta') text += ev.delta ?? ''; } catch { /* ignore */ }
        }
      }
      const parsed = JSON.parse(text);
      return { ok: true, answer: String(parsed.answer ?? ''), picks: Array.isArray(parsed.picks) ? parsed.picks.map(String) : [] };
    } catch {
      return { ok: false, answer: '', picks: [], error: 'failed' };
    }
  });
