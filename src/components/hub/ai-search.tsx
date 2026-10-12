import { useState } from 'react';
import { ArrowUp, Loader2, Sparkles, Clapperboard, PenLine, Code2, FileText, AudioLines } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToolCard, type Tool } from '@/components/hub/tool-card';
import { uniqueTools } from '@/data/directory';
import { askAiHub } from '@/lib/ai-search.functions';

const examples = ['Make a cartoon video for kids', 'Write a blog post and fix grammar', 'Build a website without coding', 'Turn a PDF into study notes', 'Natural voiceover for my video'];
const exampleIcons = [Clapperboard, PenLine, Code2, FileText, AudioLines];
const stop = new Set('i want to a an the and or for my me of in on with make need some help how do can it is be that this from into without'.split(' '));

function keywordMatch(q: string, freeOnly: boolean): Tool[] {
  const words = q.toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length > 2 && !stop.has(w));
  const pool = uniqueTools.filter(t => !freeOnly || t.price !== 'Paid');
  return pool.map(t => {
    const hay = `${t.name} ${t.category} ${t.description}`.toLowerCase();
    const score = words.reduce((s, w) => s + (hay.includes(w) ? 2 : hay.includes(w.slice(0, 4)) ? 1 : 0), 0);
    return { t, score };
  }).filter(x => x.score > 0).sort((a, b) => b.score - a.score).map(x => x.t);
}

export function AiSearch() {
  const [text, setText] = useState('');
  const [freeOnly, setFreeOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ answer: string; tools: Tool[] } | null>(null);

  async function run(q: string) {
    const query = q.trim().slice(0, 300);
    if (!query || loading) return;
    setText(query); setLoading(true); setResult(null);
    const matched = keywordMatch(query, freeOnly);
    const candidates = (matched.length >= 8 ? matched : [...matched, ...uniqueTools.filter(t => (!freeOnly || t.price !== 'Paid') && !matched.includes(t))]).slice(0, 25);
    const fallback = () => setResult({ answer: 'Here are some tools from our directory that match what you described. Open a few, try their free plans, and keep the one that feels easiest.', tools: (matched.length ? matched : candidates).slice(0, 6) });
    try {
      const r = await askAiHub({ data: { query, freeOnly, candidates: candidates.map(t => ({ name: t.name, category: t.category, price: t.price, description: t.description })) } });
      const picks = r.ok ? r.picks.map(n => uniqueTools.find(t => t.name.toLowerCase() === n.toLowerCase())).filter((t): t is Tool => !!t && (!freeOnly || t.price !== 'Paid')) : [];
      if (r.ok && r.answer && picks.length) setResult({ answer: r.answer, tools: picks.slice(0, 6) });
      else if (r.error === 'rate_limited') setResult({ answer: 'You are asking a bit fast — please wait a minute. Meanwhile, here are some matching tools.', tools: (matched.length ? matched : candidates).slice(0, 6) });
      else fallback();
    } catch { fallback(); }
    setLoading(false);
  }

  return <section className="ai-search" aria-labelledby="ai-search-title">
    <h2 id="ai-search-title"><Sparkles size={26} /><span>Tell us <span className="gradient-prompt">what you want to do.</span></span></h2>
    <form className="ai-search-box" onSubmit={e => { e.preventDefault(); run(text); }}>
      <textarea aria-label="Describe what you want to do" maxLength={300} rows={2} placeholder="e.g. I want to make cartoon videos for my kids YouTube channel" value={text} onChange={e => setText(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); run(text); } }} />
      <div className="ai-search-actions">
        <select aria-label="Price preference" value={freeOnly ? 'free' : 'any'} onChange={e => setFreeOnly(e.target.value === 'free')}><option value="any">Any price</option><option value="free">Free options only</option></select>
        <span className="ai-count">{text.length}/300</span>
        <Button type="submit" size="icon" aria-label="Ask AI Hub" disabled={loading || !text.trim()}>{loading ? <Loader2 className="animate-spin" /> : <ArrowUp />}</Button>
      </div>
    </form>
    <div className="ai-chips">{examples.map((x, i) => { const Icon = exampleIcons[i] ?? Sparkles; return <Button variant="outline" type="button" key={x} onClick={() => run(x)} disabled={loading}><Icon size={16}/>{x}</Button>; })}</div>
    {loading && <div className="ai-results ai-loading" role="status"><Loader2 className="animate-spin" size={18} />Finding the best tools for you…</div>}
    {result && <div className="ai-results" aria-live="polite"><p className="ai-answer">{result.answer}</p><div className="tool-grid">{result.tools.map(t => <ToolCard key={t.name} tool={t} />)}</div></div>}
  </section>;
}
