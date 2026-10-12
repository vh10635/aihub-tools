import data from './tools.json';
import type { Tool } from '@/components/hub/tool-card';
type ToolRow = [string, string, string, string];
function normalize(row: string[]): ToolRow { return [row[0] ?? "", row[1] ?? "", row[2] ?? "", row[3] ?? "Varies"]; }
export const categories = data.categories.map(c => ({ ...c, tools: c.tools.map(normalize) }));
export const steps = data.steps.map(s => ({ ...s, tools: s.tools.map(normalize) }));
export const tools: Tool[] = categories.flatMap((category, categoryIndex) => category.tools.map(([name, url, description, price]) => ({ name, url: `https://${url}`, description, price, category: category.name, categoryIndex })));
export const uniqueTools = tools.filter((tool, index) => tools.findIndex(t => t.name === tool.name) === index);
export const categoryLabels = ['Chatbots & assistants', 'Writing & content', 'Image & design', 'Video & animation', 'Voice & music', 'Coding & development', 'Website & app builders', 'Research & education', 'Office & productivity', 'Marketing & SEO', 'Automation & agents', 'Data & analytics', 'Support & sales', 'Translation & accessibility', 'Open-source models', 'Free starter tools'];
