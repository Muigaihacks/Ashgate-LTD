'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Calendar, User, ArrowRight, FileText } from 'lucide-react';

// Articles will be loaded from API/admin panel
const articles: any[] = [];

export default function NewsPage() {
  const [articlesList, setArticlesList] = useState<any[]>([]);

  // Fetch articles from API
  useEffect(() => {
    const fetchArticles = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/news`);
        if (response.ok) {
          const data = await response.json();
          setArticlesList(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      }
    };
    fetchArticles();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 relative overflow-hidden">
      {/* Decorative Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <Link href="/" className="inline-flex items-center text-gray-600 hover:text-primary-600 transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" /> 
          Back to Home
        </Link>

        <div className="mb-12 text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center justify-center p-2 bg-blue-50 rounded-full mb-4">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight">
            News & <span className="text-blue-600">Insights</span>
          </h1>
          <p className="text-lg text-gray-600">
            Expert perspectives on real estate, sustainability, legal compliance, and investment in East Africa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {articlesList.length > 0 ? (
            articlesList.map((a: any) => (
            <Link 
              key={a.slug} 
              href={`/news/${a.slug}`} 
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full hover:-translate-y-1"
            >
              <div className="h-48 bg-gradient-to-br from-blue-50 to-indigo-50 w-full relative overflow-hidden">
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-blue-700 shadow-sm">
                  {a.category}
                </div>
                {a.featured_image ? (
                  <img 
                    src={a.featured_image} 
                    alt={a.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 opacity-10" style={{
                    backgroundImage: 'radial-gradient(circle at 2px 2px, gray 1px, transparent 0)',
                    backgroundSize: '20px 20px'
                  }}></div>
                )}
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {a.date}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3 h-3" />
                    {a.author}
                  </div>
                </div>
                
                <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-700 transition-colors line-clamp-2">
                  {a.title}
                </h2>
                
                <p className="text-gray-600 text-sm mb-6 flex-1 line-clamp-3">
                  {a.excerpt}
                </p>
                
                <div className="flex items-center text-blue-600 font-medium text-sm mt-auto group/link">
                  Read full article 
                  <ArrowRight className="w-4 h-4 ml-2 group-hover/link:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No articles available yet.</p>
              <p className="text-gray-400 text-sm mt-2">News articles will be displayed here once they are added through the admin panel.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
