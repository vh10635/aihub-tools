import data from './tools.json';
import type { Tool } from '@/components/hub/tool-card';
export const categories = data.categories;
export const steps = data.steps;
export const tools: Tool[] = categories.flatMap((category, categoryIndex) => category.tools.map(([name, url, description, price]) => ({ name, url: `https://${url}`, description, price, category: category.name, categoryIndex })));
export const uniqueTools = tools.filter((tool, index) => tools.findIndex(t => t.name === tool.name) === index);
export const categoryLabels = ['Chatbots & assistants', 'Writing & content', 'Image & design', 'Video & animation', 'Voice & music', 'Coding & development', 'Website & app builders', 'Research & education', 'Office & productivity', 'Marketing & SEO', 'Automation & agents', 'Data & analytics', 'Support & sales', 'Translation & accessibility', 'Open-source models', 'Free starter tools'];
