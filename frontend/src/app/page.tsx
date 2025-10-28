'use client';

import { useState } from 'react';
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
  Globe
} from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  const propertyTypes = [
    { icon: <Home className="w-8 h-8" />, label: 'Houses', count: '1,234' },
    { icon: <Building className="w-8 h-8" />, label: 'Apartments', count: '856' },
    { icon: <TreePine className="w-8 h-8" />, label: 'Land', count: '2,145' },
    { icon: <Building className="w-8 h-8" />, label: 'Commercial', count: '423' },
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
    <div className="min-h-screen bg-secondary-50">
      {/* Navigation */}
      <nav className="bg-secondary-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Left Navigation */}
            <div className="hidden md:block">
              <div className="flex items-baseline space-x-6">
                <a href="#" className="text-accent-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Buy</a>
                <a href="#" className="text-accent-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Rent</a>
                <a href="#" className="text-accent-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Sell</a>
                <a href="#" className="text-accent-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Agents</a>
              </div>
            </div>
            
            {/* Center Logo */}
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold text-primary-600">AshGate</h1>
            </div>
            
            {/* Right Navigation */}
            <div className="flex items-center space-x-4">
              <div className="hidden md:block">
                <div className="flex items-baseline space-x-4">
                  <a href="#" className="text-accent-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">Services</a>
                  <a href="#" className="text-accent-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">About</a>
                </div>
              </div>
              <button className="text-accent-500 hover:text-primary-600 px-3 py-2 rounded-md text-sm font-medium">
                Sign In
              </button>
              <button className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium">
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-secondary-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-accent-500 mb-6">
              Find Your Perfect
              <span className="text-primary-600 block">Property</span>
            </h1>
            <p className="text-xl text-accent-400 mb-8 max-w-3xl mx-auto">
              Discover premium properties across East Africa. From luxury homes to prime land, 
              AshGate connects you with the best real estate opportunities.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl p-6 mb-12">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-300 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="What are you looking for?"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-accent-300 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Where?"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-accent-200 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center">
                  Search
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Property Types */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {propertyTypes.map((type, index) => (
                <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
                  <div className="text-primary-600 mb-3">{type.icon}</div>
                  <h3 className="text-lg font-semibold text-accent-500 mb-1">{type.label}</h3>
                  <p className="text-sm text-accent-400">{type.count} available</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-accent-500 mb-4">
              Why Choose AshGate?
            </h2>
            <p className="text-xl text-accent-400 max-w-3xl mx-auto">
              We're not just a property platform - we're your trusted partner in finding the perfect home or investment opportunity.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-600">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-semibold text-accent-500 mb-2">{feature.title}</h3>
                <p className="text-accent-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-primary-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to Find Your Dream Property?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-3xl mx-auto">
            Join thousands of satisfied customers who found their perfect home through AshGate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:bg-primary-50 transition-colors">
              Browse Properties
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-colors">
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
              <p className="text-primary-100">
                Your trusted partner in real estate across East Africa.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Properties</h4>
              <ul className="space-y-2 text-primary-100">
                <li><a href="#" className="hover:text-white">Houses</a></li>
                <li><a href="#" className="hover:text-white">Apartments</a></li>
                <li><a href="#" className="hover:text-white">Land</a></li>
                <li><a href="#" className="hover:text-white">Commercial</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-primary-100">
                <li><a href="#" className="hover:text-white">Property Management</a></li>
                <li><a href="#" className="hover:text-white">Valuation</a></li>
                <li><a href="#" className="hover:text-white">Legal Services</a></li>
                <li><a href="#" className="hover:text-white">Carbon Credits</a></li>
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
            <p>&copy; 2024 AshGate. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}