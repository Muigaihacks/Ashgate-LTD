'use client';

import { useParams, useRouter } from 'next/navigation';

const content: Record<string, { title: string; body: string; date: string; author: string }> = {
  'plant-trees-on-idle-land': {
    title: 'Plant trees on idle land: species by Kenyan region',
    date: '2025-10-30',
    author: 'Ashgate Editorial',
    body: 'Idle land can generate long-term value through timber, fruit or carbon credits. In high rainfall zones, consider grevillea and macadamia; in drier areas, drought-tolerant species like melia volkensii perform better...'
  },
  'buying-process-checklist': {
    title: 'Buying land or a home: step-by-step checklist',
    date: '2025-10-29',
    author: 'Legal Desk',
    body: 'From initial offer to registration, here are the key steps: conduct a search, verify beacon positions, obtain consent where required, and ensure proper transfer instruments are executed...'
  },
  'solar-payback': {
    title: 'Solar for homes: costs, payback and incentives',
    date: '2025-10-28',
    author: 'Energy Desk',
    body: 'Solar PV economics depend on consumption, sunlight and tariffs. Typical payback in urban Kenya ranges 3–6 years with net metering alternatives under consideration...'
  }
};

export default function ArticlePage() {
  const params = useParams();
  const router = useRouter();
  const slug = String(params?.slug || '');
  const article = content[slug];

  if (!article) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl font-semibold">Article not found</div>
          <button onClick={() => router.push('/news')} className="mt-4 px-4 py-2 rounded-lg border">Back to News</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 relative z-10">
        <button onClick={() => router.push('/news')} className="text-gray-700 hover:text-gray-900">← Back to News</button>
        <h1 className="text-4xl font-bold text-gray-900 mt-3">{article.title}</h1>
        <div className="text-sm text-gray-500 mt-1">{article.date} • {article.author}</div>
        <div className="prose prose-lg mt-6 text-gray-800">
          {article.body}
        </div>
      </div>
    </div>
  );
}


