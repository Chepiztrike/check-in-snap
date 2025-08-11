import { useEffect } from "react";

interface SeoProps {
  title: string;
  description?: string;
  canonical?: string;
  jsonLd?: object;
}

const ensureTag = (selector: string, create: () => HTMLElement) => {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  return el;
};

export const Seo = ({ title, description, canonical, jsonLd }: SeoProps) => {
  useEffect(() => {
    document.title = title;

    if (description) {
      const metaDesc = ensureTag('meta[name="description"]', () => {
        const m = document.createElement('meta');
        m.setAttribute('name', 'description');
        return m;
      }) as HTMLMetaElement;
      metaDesc.setAttribute('content', description);
    }

    if (canonical) {
      const link = ensureTag('link[rel="canonical"]', () => {
        const l = document.createElement('link');
        l.setAttribute('rel', 'canonical');
        return l;
      }) as HTMLLinkElement;
      link.setAttribute('href', canonical);
    }

    if (jsonLd) {
      let script = document.getElementById('ld-json');
      if (!script) {
        script = document.createElement('script');
        script.setAttribute('type', 'application/ld+json');
        script.id = 'ld-json';
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(jsonLd);
    }
  }, [title, description, canonical, jsonLd]);

  return null;
};

export default Seo;
