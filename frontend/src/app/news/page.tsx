'use client';

import Link from 'next/link';

const articles = [
  { slug: 'plant-trees-on-idle-land', title: 'Plant trees on idle land: species by Kenyan region', excerpt: 'A practical guide on what to plant and where for long-term value.', date: '2025-10-30', author: 'AshGate Editorial' },
  { slug: 'buying-process-checklist', title: 'Buying land or a home: step-by-step checklist', excerpt: 'From due diligence to transfer—what to expect and how to prepare.', date: '2025-10-29', author: 'Legal Desk' },
  { slug: 'solar-payback', title: 'Solar for homes: costs, payback and incentives', excerpt: 'When solar makes sense and how to choose the right system size.', date: '2025-10-28', author: 'Energy Desk' },
];

export default function NewsPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center justify-between mb-4">
          <a href="/" className="text-gray-700 hover:text-gray-900">← Home</a>
        </div>
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900">News & Insights</h1>
          <p className="text-gray-700 mt-2">Practical education from experts across law, energy, development and more.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {articles.map((a) => (
            <Link key={a.slug} href={`/news/${a.slug}`} className="block rounded-xl border border-blue-200 bg-white p-5 hover:shadow-lg hover:bg-blue-50 transition-all">
              <div className="text-sm text-blue-600">{a.date} • {a.author}</div>
              <h2 className="text-2xl font-semibold text-blue-700 mt-1">{a.title}</h2>
              <p className="text-gray-800 mt-2">{a.excerpt}</p>
              <div className="mt-3 inline-flex items-center gap-1 text-blue-700 font-semibold">Read more →</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}


