'use client';

import { useEffect, useRef } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

function getConsent(): { analytics: boolean; marketing: boolean } {
  if (typeof window === 'undefined') return { analytics: false, marketing: false };
  const consent = localStorage.getItem('ashgate_cookie_consent');
  if (consent !== 'accepted') return { analytics: false, marketing: false };
  try {
    const prefs = localStorage.getItem('ashgate_cookie_preferences');
    const p = prefs ? JSON.parse(prefs) : {};
    return { analytics: !!p.analytics, marketing: !!p.marketing };
  } catch {
    return { analytics: false, marketing: false };
  }
}

function loadGoogleAnalytics() {
  if (!GA_MEASUREMENT_ID || (window as any).__ashgate_ga_loaded) return;
  (window as any).__ashgate_ga_loaded = true;
  (window as any).dataLayer = (window as any).dataLayer || [];
  function gtag(...args: any[]) {
    (window as any).dataLayer.push(args);
  }
  (window as any).gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID, { page_path: window.location.pathname });

  const s1 = document.createElement('script');
  s1.async = true;
  s1.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(s1);
}

function loadFacebookPixel() {
  if (!FB_PIXEL_ID || (window as any).__ashgate_fb_loaded) return;
  (window as any).__ashgate_fb_loaded = true;
  (window as any).fbq = (window as any).fbq || function (...args: any[]) {
    ((window as any).fbq.queue = (window as any).fbq.queue || []).push(args);
  };
  (window as any).fbq.push = (window as any).fbq;
  (window as any).fbq.loaded = true;
  (window as any).fbq.version = '2.0';
  (window as any).fbq.queue = [];
  (window as any).fbq('init', FB_PIXEL_ID);
  (window as any).fbq('track', 'PageView');

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);
}

/**
 * Loads analytics and marketing scripts only when the user has given consent.
 * Listens for 'ashgate-cookie-consent-updated' so scripts load immediately after Accept without reload.
 *
 * SEO note: Cookies/analytics don't directly improve search rankings. Analytics gives you data
 * (search terms, landing pages, behavior) so you can improve content and UX, which can improve SEO.
 */
export default function Analytics() {
  const loadedRef = useRef({ analytics: false, marketing: false });

  useEffect(() => {
    const run = () => {
      const { analytics, marketing } = getConsent();
      if (analytics && GA_MEASUREMENT_ID && !loadedRef.current.analytics) {
        loadedRef.current.analytics = true;
        loadGoogleAnalytics();
      }
      if (marketing && FB_PIXEL_ID && !loadedRef.current.marketing) {
        loadedRef.current.marketing = true;
        loadFacebookPixel();
      }
    };

    run();

    const handler = () => {
      loadedRef.current = { analytics: false, marketing: false };
      run();
    };
    window.addEventListener('ashgate-cookie-consent-updated', handler);
    return () => window.removeEventListener('ashgate-cookie-consent-updated', handler);
  }, []);

  return null;
}
