'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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

// Experts will be loaded from API
const experts: any[] = [];

export default function CommunityPage() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>('');
  const [query, setQuery] = useState('');
  const [expertsList, setExpertsList] = useState<any[]>([]);

  // Fetch experts from API
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/experts`);
        if (response.ok) {
          const data = await response.json();
          setExpertsList(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching experts:', error);
      }
    };
    fetchExperts();
  }, []);

  const filtered = expertsList.filter((e: any) => (filter ? e.details?.profession === filter : true))
    .filter((e: any) => (query ? (e.name?.toLowerCase().includes(query.toLowerCase()) || e.details?.location?.toLowerCase().includes(query.toLowerCase())) : true));

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
              onClick={() => router.push('/experts/register')}
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
          {filtered.length > 0 ? (
            filtered.map((e: any, idx: number) => (
              <div key={idx} className="bg-white rounded-xl border shadow-sm hover:shadow-lg transition-shadow p-5">
                <div className="text-sm text-gray-500 mb-1">{categories.find(c=>c.key===e.details?.profession)?.name || e.details?.profession}</div>
                <h3 className="text-lg font-semibold text-gray-900">{e.name}</h3>
                <p className="text-gray-600 text-sm">{e.details?.bio || 'Professional service provider'}</p>
                <div className="text-gray-500 text-sm mt-2">{e.details?.location || 'Nairobi'} • Verified Expert</div>
                <div className="mt-4 flex gap-2">
                  <a href={`mailto:${e.email}`} className="px-4 py-2 rounded-lg bg-primary-600 text-white">Contact</a>
                  <button className="px-4 py-2 rounded-lg border text-black">View Profile</button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500">No experts available yet. Experts will be displayed here once they are approved through the admin panel.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


