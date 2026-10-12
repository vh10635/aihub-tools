import { Link } from '@tanstack/react-router';
import { ArrowRight, Clapperboard, Search, Sparkles, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BrandMark } from '@/components/hub/brand-mark';
import banner from '@/assets/ai-robot-banner.jpg';

export function DiscoveryBanner({ count }: { count: number }) {
  return <section className="discovery-hero">
    <img className="hero-image" src={banner} width={1536} height={768} fetchPriority="high" alt="Friendly white AI robot surrounded by colorful creative tool icons" />
    <div className="hero-copy">
      <div className="eyebrow"><Sparkles size={15} />THE CURATED AI DIRECTORY</div>
      <h1><BrandMark />AI Hub<span className="brand-dot">.</span></h1>
      <h2>Your <span className="gradient-coral">next idea</span>,<br />meet your <span className="gradient-tool">next tool.</span></h2>
      <p>Discover, explore and use the best AI tools in one place.<br />From chatbots to video, coding to design — find the perfect tool to bring your ideas to life.</p>
      <div className="hero-links">
        <Button asChild className="hero-primary"><a href="#tool-directory"><Search size={16} />Explore the tools<ArrowRight size={16} /></a></Button>
        <Button asChild variant="outline" className="hero-secondary"><Link to="/video-toolkit"><Clapperboard size={16} />Video toolkit</Link></Button>
      </div>
    </div>
    <div className="hero-note"><Users size={13} />{count} tools. Endless possibilities.</div>
  </section>;
}