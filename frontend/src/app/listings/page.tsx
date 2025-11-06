'use client';

import { useMemo, useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Bed, Bath, CarFront, Ruler, Search, Filter, ArrowLeft } from 'lucide-react';

export default function ListingsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const initialType = params.get('type') || 'sale';
  const [type, setType] = useState<'sale'|'rent'>(initialType === 'rent' ? 'rent' : 'sale');
  const [query, setQuery] = useState(params.get('search') || '');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [category, setCategory] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selected, setSelected] = useState<any|null>(null);
  const [allListings, setAllListings] = useState<any[]>([]);

  useEffect(() => {
    const data = (window as any).__ASHGATE_LISTINGS__;
    if (Array.isArray(data)) setAllListings(data);
  }, []);

  const items = useMemo(() => {
    return allListings
      .filter((l: any) => (l.listingType === type))
      .filter((l: any) => (query ? (l.title?.toLowerCase().includes(query.toLowerCase()) || l.location?.toLowerCase().includes(query.toLowerCase())) : true))
      .filter((l: any) => (category ? l.category === category : true))
      .filter((l: any) => {
        const priceNum = parseInt(String(l.price).replace(/[^0-9]/g, ''), 10) || 0;
        const min = minPrice ? parseInt(minPrice, 10) : 0;
        const max = maxPrice ? parseInt(maxPrice, 10) : Infinity;
        return priceNum >= min && priceNum <= max;
      });
  }, [allListings, type, query, minPrice, maxPrice, category]);

  const [page, setPage] = useState(1);
  const pageSize = 9;
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const paginated = useMemo(() => {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
  }, [items, page]);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-2">
          <button onClick={() => router.push('/')} className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900">
            <ArrowLeft className="w-5 h-5" /> Home
          </button>
          <div className="flex gap-2">
            <button onClick={() => { setType('sale'); router.replace('/listings?type=sale'); }} className={`px-4 py-2 rounded-lg border ${type==='sale'?'bg-primary-600 text-white border-primary-600':'bg-white text-gray-700 border-gray-300'}`}>Buy</button>
            <button onClick={() => { setType('rent'); router.replace('/listings?type=rent'); }} className={`px-4 py-2 rounded-lg border ${type==='rent'?'bg-primary-600 text-white border-primary-600':'bg-white text-gray-700 border-gray-300'}`}>Rent</button>
          </div>
        </div>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">{type === 'sale' ? 'Explore our curated homes on sale' : 'Here is a pool of listings you can rent'}</h1>
          <p className="text-gray-600 mt-1">Use search and filters to narrow to location, budget and type.</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="flex-1 flex items-center bg-white border rounded-lg px-3">
              <Search className="w-4 h-4 text-gray-500" />
              <input value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1 px-2 py-2 outline-none !text-gray-900" style={{ color: '#111827' }} placeholder="Search by title or location" />
              <button onClick={() => setQuery(query)} className="px-3 py-1 text-sm rounded bg-primary-600 text-white">Enter</button>
            </div>
            <button onClick={() => setIsFilterOpen(true)} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border bg-white hover:bg-gray-50 text-black">
              <Filter className="w-4 h-4" /> Filters
            </button>
            <button onClick={() => { setQuery(''); setMinPrice(''); setMaxPrice(''); setCategory(''); setPage(1); }} className="px-3 py-2 rounded-lg border text-black">Reset</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {paginated.map((item: any, idx: number) => {
            const isDirectOwner = item.source === 'owner' || item.broker === 'Direct Owner';
            return (
            <div key={idx} className="bg-white rounded-xl overflow-hidden shadow card-hover-raise cursor-pointer" onClick={() => setSelected(item)}>
              <div className={`px-5 pt-4 text-xs font-semibold ${isDirectOwner ? 'text-blue-600' : 'text-gray-500'}`}>
                {isDirectOwner ? 'Direct Owner' : item.broker}
              </div>
              <div className="relative h-44 bg-gradient-to-br from-gray-200 to-gray-300">
                <div className="absolute top-2 left-2 flex gap-2">
                  {item.has3DTour && (<span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/90 text-gray-800 shadow">3D Tour</span>)}
                  {item.hasFloorPlan && (<span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/90 text-gray-800 shadow">Floor Plan</span>)}
                </div>
                <span className="absolute bottom-2 right-2 text-xs px-3 py-1 rounded-full bg-white/90 text-gray-800 shadow">{item.category}</span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-lg text-gray-900">{item.title}</h3>
                  <span className="text-primary-600 font-bold">{item.price}</span>
                </div>
                <p className="text-gray-600 mb-3">{item.location} • {item.details}</p>
                <div className="flex items-center gap-3 text-gray-700 text-sm">
                  {item.specs?.beds ? (<span className="inline-flex items-center gap-1"><Bed className="w-4 h-4" />{item.specs.beds}</span>) : null}
                  {item.specs?.baths ? (<span className="inline-flex items-center gap-1"><Bath className="w-4 h-4" />{item.specs.baths}</span>) : null}
                  {item.specs?.parking ? (<span className="inline-flex items-center gap-1"><CarFront className="w-4 h-4" />{item.specs.parking}</span>) : null}
                  {item.specs?.area ? (<span className="inline-flex items-center gap-1"><Ruler className="w-4 h-4" />{item.specs.area}m²</span>) : null}
                </div>
              </div>
            </div>
            );
          })}
        </div>
        {/* Pagination */}
        <div className="flex justify-center items-center gap-3 mt-8">
          <button disabled={page<=1} onClick={()=>setPage((p)=>Math.max(1,p-1))} className={`px-3 py-2 rounded-lg border text-black ${page<=1?'opacity-50 cursor-not-allowed':'hover:bg-gray-50'}`}>Prev</button>
          <span className="text-gray-700">Page {page} of {totalPages}</span>
          <button disabled={page>=totalPages} onClick={()=>setPage((p)=>Math.min(totalPages,p+1))} className={`px-3 py-2 rounded-lg border text-black ${page>=totalPages?'opacity-50 cursor-not-allowed':'hover:bg-gray-50'}`}>Next</button>
        </div>

        {/* Filters Modal */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={() => setIsFilterOpen(false)}>
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md" onClick={(e) => e.stopPropagation()}>
              <div className="p-5 border-b border-gray-200 font-semibold text-black">Filters</div>
              <div className="p-5 grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm text-gray-900 mb-1">Category</label>
                  <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full border rounded-lg px-3 py-2 !text-gray-900" style={{ color: '#111827' }}>
                    <option value="">Any</option>
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Commercial</option>
                    <option>Land</option>
                    <option>Industrial</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-900 mb-1">Min price (KSh)</label>
                    <input value={minPrice} onChange={(e)=>setMinPrice(e.target.value)} className="w-full border rounded-lg px-3 py-2 !text-gray-900 placeholder-gray-400" style={{ color: '#111827' }} placeholder="e.g. 5000000" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-900 mb-1">Max price (KSh)</label>
                    <input value={maxPrice} onChange={(e)=>setMaxPrice(e.target.value)} className="w-full border rounded-lg px-3 py-2 !text-gray-900 placeholder-gray-400" style={{ color: '#111827' }} placeholder="e.g. 20000000" />
                  </div>
                </div>
              </div>
              <div className="p-5 border-t border-gray-200 flex justify-end gap-2">
                <button className="px-4 py-2 rounded-lg border text-black" onClick={()=>setIsFilterOpen(false)}>Close</button>
                <button className="px-4 py-2 rounded-lg bg-primary-600 text-white" onClick={()=>{ setPage(1); setIsFilterOpen(false); }}>Apply</button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal (simplified copy) */}
        {selected && (
          <DetailsModal listing={selected} onClose={()=>setSelected(null)} />
        )}
      </div>
    </div>
  );
}


function DetailsModal({ listing, onClose }: { listing: any, onClose: ()=>void }) {
  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mt-8" onClick={(e)=>e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{listing.title}</h3>
            <p className="text-gray-600">{listing.location}</p>
          </div>
          <div className="text-right">
            <div className="text-primary-600 font-bold text-xl">{listing.price}</div>
            <div className={`text-xs font-semibold ${listing.source === 'owner' || listing.broker === 'Direct Owner' ? 'text-blue-600' : 'text-gray-500'}`}>
              {listing.source === 'owner' || listing.broker === 'Direct Owner' ? 'Direct Owner' : listing.broker}
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
          <div className="lg:col-span-2">
            <div className="h-72 bg-gray-200 flex items-center justify-center">Image Gallery (placeholder)</div>
            <div className="px-6 py-3 border-t border-gray-200">
              <div className="flex flex-wrap gap-4 text-sm text-gray-800">
                {listing?.specs?.beds ? (<span className="inline-flex items-center gap-1"><Bed className="w-4 h-4"/> {listing.specs.beds} Beds</span>) : null}
                {listing?.specs?.baths ? (<span className="inline-flex items-center gap-1"><Bath className="w-4 h-4"/> {listing.specs.baths} Baths</span>) : null}
                {listing?.specs?.parking ? (<span className="inline-flex items-center gap-1"><CarFront className="w-4 h-4"/> {listing.specs.parking} Parking</span>) : null}
                {listing?.specs?.area ? (<span className="inline-flex items-center gap-1"><Ruler className="w-4 h-4"/> {listing.specs.area} m²</span>) : null}
              </div>
            </div>
            <div className="px-6 py-2 text-gray-700">{listing.details}</div>
            <div className="px-6">
              <div className="flex flex-wrap gap-2 mb-4">
                {listing.has3DTour && (<span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800 border">3D Tour</span>)}
                {listing.hasFloorPlan && (<span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800 border">Floor Plan</span>)}
              </div>
            </div>
          </div>
          <aside className="border-l border-gray-200 p-6">
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <div className="font-semibold text-gray-900 mb-1">{listing.source === 'owner' || listing.broker === 'Direct Owner' ? 'Contact Owner' : 'Contact Agent'}</div>
              <p className="text-sm text-gray-600 mb-3">Have questions or want to schedule a tour?</p>
              <button className="w-full bg-primary-600 text-white rounded-lg py-3 font-semibold hover:bg-primary-700">
                {listing.source === 'owner' || listing.broker === 'Direct Owner' ? 'Email Owner' : 'Email Agent'}
              </button>
            </div>
            <div className="text-sm text-gray-600">Listed by: <span className={`font-semibold ${listing.source === 'owner' || listing.broker === 'Direct Owner' ? 'text-blue-600' : 'text-gray-900'}`}>
              {listing.source === 'owner' || listing.broker === 'Direct Owner' ? 'Direct Owner' : listing.broker}
            </span></div>
          </aside>
        </div>
        <div className="px-6 py-4 border-t border-gray-200">
          <TabsLite listing={listing} />
        </div>
        <div className="p-5 border-t border-gray-200 flex justify-end">
          <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

function TabsLite({ listing }: { listing: any }) {
  const [active, setActive] = useState<'overview'|'map'|'floor'|'tour'>('overview');
  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const [amenitySelected, setAmenitySelected] = useState<Record<string, boolean>>({});
  const [mapToast, setMapToast] = useState<string>('');

  useEffect(() => {
    if (active !== 'map') return;
    if (!mapRef.current) return;
    const ensure = async () => {
      if (!(window as any).maplibregl) {
        const link = document.getElementById('maplibre-css');
        if (!link) {
          const l = document.createElement('link');
          l.id = 'maplibre-css'; l.rel = 'stylesheet'; l.href = 'https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.css';
          document.head.appendChild(l);
        }
        await new Promise<void>((resolve) => {
          const s = document.createElement('script');
          s.src = 'https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.js';
          s.onload = () => resolve();
          document.body.appendChild(s);
        });
      }
      const maplibregl = (window as any).maplibregl;
      if (!maplibregl || !MAPTILER_KEY) return;
      if (mapInstanceRef.current) return;
      const center = [listing?.coords?.lng ?? 36.8219, listing?.coords?.lat ?? -1.2921];
      const map = new maplibregl.Map({
        container: mapRef.current!,
        style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`,
        center,
        zoom: 13,
      });
      new maplibregl.Marker().setLngLat(center).addTo(map);
      mapInstanceRef.current = map;
      map.on('error', () => setMapToast('Map failed to load. Check your internet or API key.'));
      map.on('load', () => {
        const addAmenityLayer = (id: string, classes: string[], color: string) => {
          if (map.getLayer(id)) return;
          map.addLayer({
            id,
            type: 'circle',
            source: 'openmaptiles',
            'source-layer': 'poi',
            filter: ['in', ['get', 'class'], ['literal', ...classes]],
            paint: { 'circle-radius': 5, 'circle-color': color, 'circle-opacity': 0.9 }
          });
          map.setLayoutProperty(id, 'visibility', 'none');
        };
        addAmenityLayer('l-amenity-schools', ['school','college','university'], '#2563eb');
        addAmenityLayer('l-amenity-hospitals', ['hospital','clinic'], '#dc2626');
        addAmenityLayer('l-amenity-supermarkets', ['supermarket','grocery'], '#16a34a');
        addAmenityLayer('l-amenity-transit', ['bus','bus_stop','tram_stop','station'], '#7c3aed');
      });
    };
    ensure();
  }, [active, MAPTILER_KEY, listing]);

  // Toggle layer visibility based on amenitySelected
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const setVisible = (id: string, on: boolean) => {
      if (!map.getLayer(id)) return;
      map.setLayoutProperty(id, 'visibility', on ? 'visible' : 'none');
    };
    setVisible('l-amenity-schools', !!amenitySelected['Schools']);
    setVisible('l-amenity-hospitals', !!amenitySelected['Hospitals']);
    setVisible('l-amenity-supermarkets', !!amenitySelected['Supermarkets']);
    setVisible('l-amenity-transit', !!amenitySelected['Transit']);
  }, [amenitySelected]);

  return (
    <div>
      <div className="flex gap-4 text-sm flex-wrap">
        <button onClick={()=>setActive('overview')} className={`${active==='overview'?'font-semibold text-gray-900':'text-gray-600'}`}>Overview</button>
        <button onClick={()=>setActive('map')} className={`${active==='map'?'font-semibold text-gray-900':'text-gray-600'}`}>Map & Amenities</button>
        <button onClick={()=>setActive('floor')} className={`${active==='floor'?'font-semibold text-gray-900':'text-gray-600'}`}>Floor Plan</button>
        <button onClick={()=>setActive('tour')} className={`${active==='tour'?'font-semibold text-gray-900':'text-gray-600'}`}>3D Tour</button>
      </div>
      {active==='overview' && (
        <div className="mt-3 text-gray-700">Elegant property in {listing.location}. Great connectivity and neighborhood amenities.</div>
      )}
      {active==='map' && (
        <div className="mt-3">
          {!MAPTILER_KEY && (<div className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">Set NEXT_PUBLIC_MAPTILER_KEY in your env to enable the map.</div>)}
          <div className="flex gap-2 flex-wrap mb-3">
            {['Schools','Hospitals','Supermarkets','Transit'].map((a)=> (
              <button key={a} onClick={()=>setAmenitySelected((prev)=> ({...prev, [a]: !prev[a]}))} className={`px-3 py-1 rounded-full text-sm border ${amenitySelected[a]?'bg-primary-600 text-white border-primary-600':'bg-white text-gray-700 border-gray-300'}`}>{a}</button>
            ))}
          </div>
          <div ref={mapRef} className="w-full h-80 rounded-lg overflow-hidden shadow bg-gray-200" />
          {mapToast && (
            <div className="fixed bottom-6 right-6 z-[100] bg-black text-white text-sm px-4 py-2 rounded shadow">{mapToast}</div>
          )}
        </div>
      )}
      {active==='floor' && (<div className="mt-3 text-gray-700">Floor plan viewer placeholder.</div>)}
      {active==='tour' && (<div className="mt-3 text-gray-700">3D tour viewer placeholder.</div>)}
    </div>
  );
}


