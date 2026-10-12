import { ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ToolLogo } from '@/components/hub/tool-logo';
export type Tool = { name: string; url: string; description: string; price: string; category: string; categoryIndex: number };
export function ToolCard({ tool, featured = false }: { tool: Tool; featured?: boolean }) {
 return <article className={`tool-card ${featured ? 'featured-card' : ''}`}>
  <div className="tool-card-top"><div className={`tool-mark mark-${tool.categoryIndex % 5}`}><ToolLogo name={tool.name} url={tool.url} size={30} /></div><span className={`price-badge ${tool.price === 'Free' ? 'price-free' : ''}`}>{tool.price}</span></div>
  <h3>{tool.name}</h3><p className="tool-description">{tool.description}</p>
  <div className="tool-card-bottom"><span className="tool-category">{tool.category.split(' and ')[0]}</span><Button asChild variant="ghost" size="icon" className="visit-tool" title={`Visit ${tool.name}`}><a href={tool.url} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${tool.name}`}><ArrowUpRight /></a></Button></div>
 </article>;
}
