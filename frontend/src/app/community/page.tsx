'use client';

import { useState } from 'react';
import { Users, Hammer, Sun, Trees, Gavel, Truck, Camera, Paintbrush, Search, ArrowLeft, Newspaper } from 'lucide-react';

const categories = [
  { key: 'legal', name: 'Legal & Conveyancing', icon: Gavel },
  { key: 'cabro', name: 'Cabro & Paving', icon: Hammer },
  { key: 'solar', name: 'Solar & Utilities', icon: Sun },
  { key: 'landscaping', name: 'Landscaping', icon: Trees },
  { key: 'movers', name: 'Professional Movers', icon: Truck },
  { key: 'photography', name: 'Real Estate Photography', icon: Camera },
  { key: 'interior', name: 'Interior Design & Staging', icon: Paintbrush },
  { key: 'real-estate-agent', name: 'Real Estate Agents', icon: Users },
  { key: 'property-manager', name: 'Property Managers', icon: Users },
];

const experts = [
  { name: 'Apex Conveyancers LLP', category: 'legal', location: 'Nairobi', tagline: 'Property transfers, due diligence & titles', rating: 4.8 },
  { name: 'SunGrid Solar', category: 'solar', location: 'Kiambu', tagline: 'Solar PV installs and backup power', rating: 4.7 },
  { name: 'GreenEdge Landscapes', category: 'landscaping', location: 'Ruiru', tagline: 'Hardscape, lawns & irrigation', rating: 4.6 },
  { name: 'SwiftMove Logistics', category: 'movers', location: 'Nairobi', tagline: 'Home and office moves', rating: 4.5 },
  { name: 'PaveMaster Cabro', category: 'cabro', location: 'Thika', tagline: 'Driveways, walkways & compounds', rating: 4.7 },
  { name: 'Focus Realty Shots', category: 'photography', location: 'Westlands', tagline: 'Property photos, video & 3D scans', rating: 4.9 },
  { name: 'Atelier Interiors', category: 'interior', location: 'Kilimani', tagline: 'Furnishing and staging', rating: 4.6 },
];

export default function CommunityPage() {
  const [filter, setFilter] = useState<string>('');
  const [query, setQuery] = useState('');

  const filtered = experts.filter((e) => (filter ? e.category === filter : true))
    .filter((e) => (query ? (e.name.toLowerCase().includes(query.toLowerCase()) || e.location.toLowerCase().includes(query.toLowerCase())) : true));

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-6 flex items-center justify-between">
          <button onClick={()=>history.back()} className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"><ArrowLeft className="w-5 h-5"/> Home</button>
          <button onClick={()=>location.assign('/news')} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border text-black"><Newspaper className="w-4 h-4"/> News & Insights</button>
        </div>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 inline-flex items-center gap-3 justify-center"><Users className="text-primary-600"/> Community Experts</h1>
          <p className="text-gray-700 mt-2">Vetted professionals you can trust at every step of your property journey.</p>
          <div className="mt-6">
            <button 
              onClick={() => {
                window.location.href = '/experts/register';
              }}
              className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 transition-colors"
            >
              <Users className="w-5 h-5" />
              Become an Expert
            </button>
          </div>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex-1 min-w-[280px] flex items-center bg-white border rounded-lg px-3">
              <Search className="w-4 h-4 text-gray-500"/>
              <input value={query} onChange={(e)=>setQuery(e.target.value)} className="flex-1 px-2 py-2 outline-none !text-gray-900" style={{ color: '#111827' }} placeholder="Search by name or location"/>
            </div>
            <div className="flex gap-2 overflow-x-auto">
              <button onClick={()=>setFilter('')} className={`px-3 py-2 rounded-lg border ${filter===''?'bg-primary-600 text-white border-primary-600':'bg-white text-black'}`}>All</button>
              {categories.map((c)=>{
                const Icon = c.icon; return (
                  <button key={c.key} onClick={()=>setFilter(c.key)} className={`px-3 py-2 rounded-lg border flex items-center gap-2 ${filter===c.key?'bg-primary-600 text-white border-primary-600':'bg-white text-black'}`}>
                    <Icon className="w-4 h-4"/>{c.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((e, idx) => (
            <div key={idx} className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition-shadow p-5">
              <div className="text-sm text-gray-500 mb-1">{categories.find(c=>c.key===e.category)?.name}</div>
              <h3 className="text-lg font-semibold text-gray-900">{e.name}</h3>
              <p className="text-gray-600 text-sm">{e.tagline}</p>
              <div className="text-gray-500 text-sm mt-2">{e.location} • ⭐ {e.rating}</div>
              <div className="mt-4 flex gap-2">
                <button className="px-4 py-2 rounded-lg bg-primary-600 text-white">Contact</button>
                <button className="px-4 py-2 rounded-lg border text-black">View Profile</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


