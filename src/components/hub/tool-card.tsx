import { ArrowUpRight, Sparkles, AudioLines, Bot, Code2, Palette, Search, Aperture, Wind } from 'lucide-react';
import { Button } from '@/components/ui/button';
export type Tool = { name: string; url: string; description: string; price: string; category: string; categoryIndex: number };
const marks: Record<string, typeof Sparkles> = { ChatGPT: Bot, Claude: Sparkles, 'Google Gemini': Sparkles, Perplexity: Search, Midjourney: Wind, Runway: Aperture, ElevenLabs: AudioLines, Cursor: Code2, 'Canva AI': Palette };
export function ToolCard({ tool, featured = false }: { tool: Tool; featured?: boolean }) {
 const Icon = marks[tool.name] ?? [Bot, Code2, Palette, Aperture, AudioLines][tool.categoryIndex % 5] ?? Sparkles;
 return <article className={`tool-card ${featured ? 'featured-card' : ''}`}>
  <div className="tool-card-top"><div className={`tool-mark mark-${tool.categoryIndex % 5}`}><Icon size={25} strokeWidth={1.7} /></div><span className={`price-badge ${tool.price === 'Free' ? 'price-free' : ''}`}>{tool.price}</span></div>
  <h3>{tool.name}</h3><p className="tool-description">{tool.description}</p>
  <div className="tool-card-bottom"><span className="tool-category">{tool.category.split(' and ')[0]}</span><Button asChild variant="ghost" size="icon" className="visit-tool" title={`Visit ${tool.name}`}><a href={tool.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${tool.name}`}><ArrowUpRight /></a></Button></div>
 </article>;
}
