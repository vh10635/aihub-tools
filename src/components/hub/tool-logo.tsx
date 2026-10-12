import { useEffect, useState } from 'react';

export function domainOf(url: string) {
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
}

export function ToolLogo({ name, url, size = 40 }: { name: string; url: string; size?: number }) {
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => setReady(true), []);
  const domain = domainOf(url);
  if (failed || !domain || !ready) return <span className="tool-logo tool-logo-fallback" style={{ width: size, height: size }} aria-hidden>{name.charAt(0).toUpperCase()}</span>;
  return <img className="tool-logo" src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} width={size} height={size} alt={`${name} logo`} loading="lazy" onError={() => setFailed(true)} />;
}
