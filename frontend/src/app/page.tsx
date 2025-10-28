'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Home, 
  Building, 
  TreePine, 
  Users, 
  ArrowRight,
  Star,
  Shield,
  Globe,
  Key,
  Landmark,
  Building2,
  Trees,
  HomeIcon,
  BuildingIcon,
  MapPin as LocationIcon,
  Briefcase,
  ChevronDown,
  Settings,
  FileText,
  BarChart3,
  Wrench
} from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);

  // Real estate icons for rotation - more detailed and professional
  const realEstateIcons = [
    { icon: <HomeIcon className="w-7 h-7" />, label: 'Homes' },
    { icon: <Building2 className="w-7 h-7" />, label: 'Apartments' },
    { icon: <Trees className="w-7 h-7" />, label: 'Land' },
    { icon: <Users className="w-7 h-7" />, label: 'Experts' },
    { icon: <Landmark className="w-7 h-7" />, label: 'Commercial' },
    { icon: <LocationIcon className="w-7 h-7" />, label: 'Locations' }
  ];

  // Rotate icons every 2.5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIconIndex((prevIndex) => 
        (prevIndex + 1) % realEstateIcons.length
      );
    }, 2500);

    return () => clearInterval(interval);
  }, [realEstateIcons.length]);

  const propertyTypes = [
    { icon: <HomeIcon className="w-8 h-8" />, label: 'Houses', count: '1,234' },
    { icon: <Building2 className="w-8 h-8" />, label: 'Apartments', count: '856' },
    { icon: <Trees className="w-8 h-8" />, label: 'Land', count: '2,145' },
    { icon: <Landmark className="w-8 h-8" />, label: 'Commercial', count: '423' },
  ];

  const features = [
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Verified Listings',
      description: 'All properties are verified by our team of experts'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Global Reach',
      description: 'Connecting buyers and sellers across East Africa'
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: 'Expert Agents',
      description: 'Professional real estate agents at your service'
    },
    {
      icon: <Star className="w-6 h-6" />,
      title: 'Premium Service',
      description: 'Luxury properties and exceptional service'
    }
  ];

  return (
    <div className="min-h-screen bg-white" style={{backgroundColor: 'white'}}>
      {/* Navigation */}
      <nav className="bg-white shadow-md border-b border-gray-200" style={{backgroundColor: 'white'}}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Navigation */}
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-6">
                <button className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-primary-50 hover:text-primary-600" style={{color: '#374151'}}>Buy</button>
                <button className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-primary-50 hover:text-primary-600" style={{color: '#374151'}}>Rent</button>
                <button className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-primary-50 hover:text-primary-600" style={{color: '#374151'}}>Sell</button>
                <button className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-primary-50 hover:text-primary-600" style={{color: '#374151'}}>Agents</button>
              </div>
            </div>
            
            {/* Center - Rotating Real Estate Icons with Carousel Effect */}
            <div className="flex-shrink-0 flex items-center justify-center ml-36">
              <div className="relative w-20 h-16 overflow-hidden">
                {/* Previous icon sliding out */}
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-in-out transform"
                  style={{
                    transform: 'translateX(-100%)',
                    opacity: 0.3
                  }}
                >
                  <div className="text-accent-400 mb-1">
                    {realEstateIcons[(currentIconIndex - 1 + realEstateIcons.length) % realEstateIcons.length].icon}
                  </div>
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                    {realEstateIcons[(currentIconIndex - 1 + realEstateIcons.length) % realEstateIcons.length].label}
                  </span>
                </div>
                
                {/* Current icon in center */}
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-in-out transform"
                  style={{
                    transform: 'translateX(0)',
                    opacity: 1
                  }}
                >
                  <div className="text-accent-600 mb-1">
                    {realEstateIcons[currentIconIndex].icon}
                  </div>
                  <span className="text-xs text-gray-600 font-medium whitespace-nowrap">
                    {realEstateIcons[currentIconIndex].label}
                  </span>
                </div>
                
                {/* Next icon sliding in */}
                <div 
                  className="absolute inset-0 flex flex-col items-center justify-center transition-all duration-500 ease-in-out transform"
                  style={{
                    transform: 'translateX(100%)',
                    opacity: 0.3
                  }}
                >
                  <div className="text-accent-400 mb-1">
                    {realEstateIcons[(currentIconIndex + 1) % realEstateIcons.length].icon}
                  </div>
                  <span className="text-xs text-gray-400 font-medium whitespace-nowrap">
                    {realEstateIcons[(currentIconIndex + 1) % realEstateIcons.length].label}
                  </span>
                </div>
              </div>
            </div>
            
            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-4">
                  {/* Community Dropdown */}
                  <div className="relative">
                    <button 
                      className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-primary-50 hover:text-primary-600 flex items-center"
                      style={{color: '#374151'}}
                      onMouseEnter={() => setIsCommunityOpen(true)}
                      onMouseLeave={() => setIsCommunityOpen(false)}
                    >
                      Community
                      <ChevronDown className="ml-1 w-4 h-4" />
                    </button>
                    {isCommunityOpen && (
                      <div 
                        className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-xl border border-gray-200 py-1 z-50"
                        onMouseEnter={() => setIsCommunityOpen(true)}
                        onMouseLeave={() => setIsCommunityOpen(false)}
                      >
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          <Users className="w-4 h-4 mr-2" />
                          Relevant Experts
                        </a>
                        <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                          <FileText className="w-4 h-4 mr-2" />
                          News & Insights
                        </a>
                      </div>
                    )}
                  </div>
                  
                  <button className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-primary-50 hover:text-primary-600 flex items-center" style={{color: '#374151'}}>
                    <BarChart3 className="w-4 h-4 mr-1" />
                    AshGate Property Manager
                  </button>
                </div>
              </div>
              <button className="px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:bg-primary-50 hover:text-primary-600" style={{color: '#374151'}}>
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-white pt-4 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo - Positioned higher */}
            <div className="mb-8 -mt-20">
              <img 
                src="/ashgate-logo.png" 
                alt="AshGate Limited" 
                className="h-24 w-auto max-w-full mx-auto"
                style={{maxWidth: '100%', height: 'auto', objectFit: 'contain'}}
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6" style={{color: '#111827'}}>
              Find Your Perfect
              <span className="text-primary-600 block">Property</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Discover premium properties across East Africa. From luxury homes to prime land, 
              AshGate connects you with the best real estate opportunities.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6 mb-12 border border-gray-200">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="What are you looking for?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Where?"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 text-gray-900 placeholder-gray-500"
                    />
                  </div>
                </div>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors duration-200">
                  Search
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Property Types */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {propertyTypes.map((type, index) => (
                <div 
                  key={index} 
                  className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-200 hover:border-primary-300 group"
                >
                  <div className="text-primary-600 mb-3 group-hover:text-primary-700 transition-colors duration-200">
                    {type.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors duration-200">{type.label}</h3>
                  <p className="text-sm text-gray-600 group-hover:text-gray-700 transition-colors duration-200">{type.count} available</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-primary-600">AshGate</span>?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              We&apos;re not just a property platform - we&apos;re your trusted partner in finding the perfect home or investment opportunity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-all duration-300 shadow-md">
                  <div className="text-primary-600 group-hover:text-primary-700 transition-colors duration-200">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-primary-600 transition-colors duration-200">{feature.title}</h3>
                <p className="text-gray-600 group-hover:text-gray-700 transition-colors duration-200">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 via-primary-700 to-primary-800 relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who found their perfect home through AshGate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Browse Properties
            </button>
            <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              List Your Property
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">AshGate</h3>
              <p className="text-primary-100 leading-relaxed">
                Your trusted partner in real estate across East Africa. Connecting dreams with reality.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Properties</h4>
              <ul className="space-y-2 text-primary-100">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Houses</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Apartments</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Land</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Commercial</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-primary-100">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Property Management</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Valuation</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Legal Services</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Carbon Credits</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-primary-100">
                <li>Email: info@ashgate.co.ke</li>
                <li>Phone: +254 700 000 000</li>
                <li>Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-400 mt-8 pt-8 text-center text-primary-100">
            <p>&copy; 2024 AshGate. All rights reserved. | Building dreams, one property at a time.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}