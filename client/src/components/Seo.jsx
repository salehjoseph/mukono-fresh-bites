import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { BUSINESS } from '../constants/business';

function setTag(selector, create, attr, value) {
  let el = document.querySelector(selector);
  if (!el) {
    el = create();
    document.head.appendChild(el);
  }
  el.setAttribute(attr, value);
}

export default function Seo({ title, description }) {
  const { pathname } = useLocation();

  useEffect(() => {
    const fullTitle = title
      ? title + ' | ' + BUSINESS.name
      : BUSINESS.name + ' | Fresh food in Mukono';
    document.title = fullTitle;

    if (description) {
      setTag(
        'meta[name="description"]',
        () => Object.assign(document.createElement('meta'), { name: 'description' }),
        'content',
        description,
      );
      setTag(
        'meta[property="og:description"]',
        () => {
          const m = document.createElement('meta');
          m.setAttribute('property', 'og:description');
          return m;
        },
        'content',
        description,
      );
    }

    setTag(
      'meta[property="og:title"]',
      () => {
        const m = document.createElement('meta');
        m.setAttribute('property', 'og:title');
        return m;
      },
      'content',
      fullTitle,
    );

    const site = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
    setTag(
      'link[rel="canonical"]',
      () => Object.assign(document.createElement('link'), { rel: 'canonical' }),
      'href',
      site + pathname,
    );
  }, [title, description, pathname]);

  return null;
}