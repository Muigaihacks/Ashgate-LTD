'use client';

import { useState, useEffect, useRef } from 'react';
import { 
  Search, 
  MapPin, 
  Users, 
  ArrowRight,
  Star,
  Shield,
  Globe,
  Landmark,
  Building2,
  Trees,
  HomeIcon,
  MapPin as LocationIcon,
  ChevronDown,
  FileText,
  BarChart3
} from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '', 
    confirmPassword: '', 
    phone: '', 
    acceptTerms: false 
  });
  const [currentVideo, setCurrentVideo] = useState('/videos/hero-video1.mp4'); // Default fallback
  const [logoStyle, setLogoStyle] = useState('bright'); // 'bright' or 'dark' based on video
  const [videoIndex, setVideoIndex] = useState(0);
  const [isSequentialMode, setIsSequentialMode] = useState(false); // Switched to time-based mode
  const [mounted, setMounted] = useState(false); // For hydration fix

  // Video array for sequential testing
  const videos = [
    { src: '/videos/hero-video1.mp4', name: 'Morning (5AM-10AM)', style: 'bright' },
    { src: '/videos/hero-video2.mp4', name: 'Day (10AM-5PM)', style: 'dark' },
    { src: '/videos/hero-video3.mp4', name: 'Evening (5PM-10PM)', style: 'bright' },
    { src: '/videos/hero-video4.mp4', name: 'Night (10PM-5AM)', style: 'bright' }
  ];

  // Fix hydration - only render client-side
  useEffect(() => {
    setMounted(true);
  }, []);

  // Sequential video testing - cycles through all videos
  useEffect(() => {
    if (isSequentialMode) {
      const currentVideoData = videos[videoIndex];
      setCurrentVideo(currentVideoData.src);
      setLogoStyle(currentVideoData.style);
      
      // Switch to next video every 8 seconds for testing
      const interval = setInterval(() => {
        setVideoIndex((prevIndex) => (prevIndex + 1) % videos.length);
      }, 8000); // 8 seconds per video
      
      return () => clearInterval(interval);
    }
  }, [videoIndex, isSequentialMode]);

  // Time-based video selection - Ready for production
  useEffect(() => {
    if (!isSequentialMode) {
      const getCurrentVideo = () => {
        const now = new Date();
        const hour = now.getHours();
        
        console.log('Getting video for hour:', hour);
        
        // Your custom schedule
        if (hour >= 5 && hour < 10) {
          // Morning: 5AM-10AM
          console.log('Setting morning video');
          return { src: '/videos/hero-video1.mp4', style: 'bright' };
        } else if (hour >= 10 && hour < 17) {
          // Day: 10AM-5PM
          console.log('Setting day video');
          return { src: '/videos/hero-video2.mp4', style: 'dark' };
        } else if (hour >= 17 && hour < 22) {
          // Evening: 5PM-10PM
          console.log('Setting evening video');
          return { src: '/videos/hero-video3.mp4', style: 'bright' };
        } else {
          // Night: 10PM-5AM
          console.log('Setting night video');
          return { src: '/videos/hero-video4.mp4', style: 'bright' };
        }
      };

      const videoData = getCurrentVideo();
      console.log('Setting video:', videoData);
      setCurrentVideo(videoData.src);
      setLogoStyle(videoData.style);
      
      // Update video every hour
      const interval = setInterval(() => {
        const newVideoData = getCurrentVideo();
        console.log('Hourly update - setting video:', newVideoData);
        setCurrentVideo(newVideoData.src);
        setLogoStyle(newVideoData.style);
      }, 60 * 60 * 1000); // Check every hour

      return () => clearInterval(interval);
    }
  }, [isSequentialMode]);

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
      icon: <Users className="w-6 h-6" />,
      title: 'Complete Real Estate Ecosystem',
      description: 'Beyond listings - access to verified experts: Cabro Specialists, Professional Movers, Solar Installers, Landscapers, Real Estate Lawyers, Quantity Surveyors, Photographers, and Interior Designers. Your one-stop solution for all property needs.'
    },
    {
      icon: <Building2 className="w-6 h-6" />,
      title: 'Full-Scale Property Management',
      description: 'Comprehensive property management with integrated payment systems, tenant management, maintenance tracking, and automated rent collection. From listing to lease management - we handle it all.'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: 'Expatriate Relocation Solutions',
      description: 'Specialized algorithms to help expatriates find fully furnished homes, understand local markets, and connect with relocation experts. Seamless transition to your new home in East Africa.'
    },
    {
      icon: <Trees className="w-6 h-6" />,
      title: 'Carbon Credits Integration',
      description: 'Pioneering sustainable real estate with carbon footprint tracking, green building certifications, and eco-friendly property options. Invest responsibly in the future.'
    },
    {
      icon: <Landmark className="w-6 h-6" />,
      title: 'Land Development Advisory',
      description: 'Expert guidance on land development feasibility, investment opportunities, and regulatory compliance. Turn your land investment into profitable developments.'
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: 'Verified & Secure',
      description: 'All properties, experts, and transactions are thoroughly verified. Secure payment processing and comprehensive legal support ensure your investment is protected.'
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
                <button 
                  className="nav-button text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  onClick={() => console.log('Buy clicked')}
                >
                  Buy
                </button>
                <button 
                  className="nav-button text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  onClick={() => console.log('Rent clicked')}
                >
                  Rent
                </button>
                <button 
                  className="nav-button text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  onClick={() => console.log('Sell clicked')}
                >
                  Sell
                </button>
                <button 
                  className="nav-button text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  onClick={() => console.log('Agents clicked')}
                >
                  Agents
                </button>
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
                      className="nav-button text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center"
                      onMouseEnter={() => {
                        if (dropdownTimeoutRef.current) {
                          clearTimeout(dropdownTimeoutRef.current);
                          dropdownTimeoutRef.current = null;
                        }
                        setIsCommunityOpen(true);
                      }}
                      onMouseLeave={() => {
                        dropdownTimeoutRef.current = setTimeout(() => {
                          setIsCommunityOpen(false);
                        }, 200); // 200ms delay before closing
                      }}
                      onClick={() => {
                        setIsCommunityOpen(!isCommunityOpen);
                      }}
                    >
                      Community
                      <ChevronDown className="ml-1 w-4 h-4" />
                    </button>
                    {isCommunityOpen && (
                      <div 
                        className="absolute top-full left-0 mt-0 w-48 bg-white rounded-md shadow-xl border border-gray-200 py-1 z-50"
                        onMouseEnter={() => {
                          if (dropdownTimeoutRef.current) {
                            clearTimeout(dropdownTimeoutRef.current);
                            dropdownTimeoutRef.current = null;
                          }
                          setIsCommunityOpen(true);
                        }}
                        onMouseLeave={() => {
                          dropdownTimeoutRef.current = setTimeout(() => {
                            setIsCommunityOpen(false);
                          }, 200);
                        }}
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
                  
                  <button 
                    className="nav-button text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center"
                    onClick={() => console.log('Property Manager clicked')}
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    <span className="text-primary-600">AshGate Property Manager</span>
                  </button>
                </div>
              </div>
              <button 
                className="nav-button text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                onClick={() => {
                  console.log('Sign In clicked');
                  setIsSignInOpen(true);
                }}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Video Background */}
      <section className="relative bg-gradient-to-b from-gray-900 to-gray-800 pt-4 pb-16 overflow-hidden min-h-[600px]">
        {/* Video Background - Time-based switching */}
        {mounted && currentVideo && (
          <video
            key={currentVideo} // Force re-render when video changes
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0"
            style={{ 
              minHeight: '100%', 
              objectPosition: 'center',
              width: '100%',
              height: '100%'
            }}
            poster="/images/hero-placeholder.jpg"
            onError={(e) => {
              console.error('Video loading error:', e);
            }}
          >
            <source src={currentVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        
        {/* Fallback background image when video doesn't load - Hidden when video is playing */}
        {(!mounted || !currentVideo) && (
          <div 
            className="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat z-[-1]"
            style={{
              backgroundImage: 'url(/images/hero-placeholder.jpg)',
              minHeight: '100%'
            }}
          ></div>
        )}
        
        {/* Dark overlay for text readability - Adjust opacity (0.3-0.6) as needed */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/50 z-10"></div>
        
        {/* Content - positioned above video and overlay */}
        <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">

            {/* Logo - Enhanced visibility with adaptive styling */}
            <div className="mb-8 -mt-20 relative inline-block">
              {/* Semi-transparent background circle for better contrast - Adapts to video */}
              <div 
                className="absolute inset-0 rounded-full mx-auto"
                style={{
                  width: '140px',
                  height: '140px',
                  left: '50%',
                  top: '50%',
                  transform: 'translate(-50%, -50%)',
                  background: logoStyle === 'bright' 
                    ? 'rgba(255, 255, 255, 0.2)' 
                    : 'rgba(0, 0, 0, 0.2)',
                  backdropFilter: 'blur(10px)',
                  border: logoStyle === 'bright'
                    ? '2px solid rgba(255, 255, 255, 0.4)'
                    : '2px solid rgba(255, 255, 255, 0.2)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                  zIndex: 1
                }}
              ></div>
              
              {/* Logo with enhanced visibility filters */}
              <img 
                src="/ashgate-logo.png" 
                alt="AshGate Limited" 
                className="h-24 w-auto max-w-full mx-auto relative z-10"
                style={{
                  maxWidth: '100%', 
                  height: 'auto', 
                  objectFit: 'contain',
                  filter: logoStyle === 'bright'
                    ? `
                        drop-shadow(0 0 10px rgba(255, 255, 255, 0.9))
                        drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))
                        drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8))
                        brightness(1.3)
                        contrast(1.2)
                      `
                    : `
                        drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))
                        drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))
                        drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))
                        brightness(1.1)
                        contrast(1.05)
                      `,
                  WebkitFilter: logoStyle === 'bright'
                    ? `
                        drop-shadow(0 0 10px rgba(255, 255, 255, 0.9))
                        drop-shadow(0 0 20px rgba(255, 255, 255, 0.6))
                        drop-shadow(0 4px 8px rgba(0, 0, 0, 0.8))
                        brightness(1.3)
                        contrast(1.2)
                      `
                    : `
                        drop-shadow(0 0 10px rgba(255, 255, 255, 0.5))
                        drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))
                        drop-shadow(0 4px 8px rgba(0, 0, 0, 0.6))
                        brightness(1.1)
                        contrast(1.05)
                      `
                }}
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 drop-shadow-lg" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.5)'}}>
              Find Your Perfect
              <span className="text-primary-100 block drop-shadow-lg">Property</span>
            </h1>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md" style={{textShadow: '1px 1px 3px rgba(0,0,0,0.5)'}}>
              Discover premium properties across East Africa. From luxury homes to prime land, 
              AshGate connects you with the best real estate opportunities.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl p-6 mb-12 border border-white border-opacity-30">
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
                  className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-white border-opacity-30 hover:border-primary-300 group"
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
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We&apos;re not just a property platform - we&apos;re East Africa&apos;s most comprehensive real estate ecosystem. From finding your dream home to managing your investment portfolio, we provide end-to-end solutions with verified experts and cutting-edge technology.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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

      {/* Testimonials Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              What Our <span className="text-primary-600">Clients</span> Say
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Don&apos;t just take our word for it - hear from satisfied customers who found their perfect property through AshGate.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold text-lg">SM</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Sarah Mwangi</h4>
                  <p className="text-gray-600 text-sm">Property Owner, Nairobi</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                &quot;AshGate helped me find the perfect apartment in Westlands within my budget. Their property management service is exceptional - rent collection is automated and maintenance requests are handled promptly.&quot;
              </p>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold text-lg">JK</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">James Kiprop</h4>
                  <p className="text-gray-600 text-sm">Land Developer, Nakuru</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                &quot;The land development advisory service was a game-changer. AshGate connected me with the right quantity surveyor and helped me navigate all the regulatory requirements. My project is now profitable!&quot;
              </p>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold text-lg">AO</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Aisha Ochieng</h4>
                  <p className="text-gray-600 text-sm">Expatriate, Kampala</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                &quot;As an expatriate relocating to Uganda, AshGate&apos;s specialized service was invaluable. They found me a fully furnished home and connected me with interior designers. The transition was seamless!&quot;
              </p>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            {/* Testimonial 4 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold text-lg">DN</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">David Njoroge</h4>
                  <p className="text-gray-600 text-sm">Investor, Mombasa</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                &quot;The carbon credits integration feature is brilliant! I can track my property&apos;s environmental impact and get certified as a green building. It&apos;s the future of real estate.&quot;
              </p>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            {/* Testimonial 5 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold text-lg">LM</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Linda Mwangi</h4>
                  <p className="text-gray-600 text-sm">Landlord, Kisumu</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                &quot;Managing multiple properties was a nightmare until I found AshGate. Their integrated payment system with M-Pesa makes rent collection effortless, and the maintenance tracking is top-notch.&quot;
              </p>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>

            {/* Testimonial 6 */}
            <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-bold text-lg">RT</span>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">Robert Tembo</h4>
                  <p className="text-gray-600 text-sm">Business Owner, Dar es Salaam</p>
                </div>
              </div>
              <p className="text-gray-700 leading-relaxed">
                &quot;The expert network is incredible! When I needed a solar installer, AshGate connected me with a verified professional who completed the job perfectly. The platform truly delivers on its promises.&quot;
              </p>
              <div className="flex text-yellow-400 mt-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Brands & Partnerships Section */}
      <section className="py-16 bg-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Trusted by Leading <span className="text-primary-600">Partners</span>
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We&apos;re proud to work with industry leaders and trusted partners across East Africa.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
            {/* Partner Logos - Placeholder for now */}
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center h-20">
              <span className="text-gray-400 font-semibold text-sm">Safaricom</span>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center h-20">
              <span className="text-gray-400 font-semibold text-sm">KCB Bank</span>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center h-20">
              <span className="text-gray-400 font-semibold text-sm">NSSF</span>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center h-20">
              <span className="text-gray-400 font-semibold text-sm">KRA</span>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center h-20">
              <span className="text-gray-400 font-semibold text-sm">NEMA</span>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300 flex items-center justify-center h-20">
              <span className="text-gray-400 font-semibold text-sm">KPA</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">AshGate</h3>
              <p className="text-gray-300 leading-relaxed">
                Your trusted partner in real estate across East Africa. Connecting dreams with reality.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Properties</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Houses</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Apartments</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Land</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Commercial</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors duration-200">Property Management</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Land Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Expert Network</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Carbon Credits</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Email: info@ashgate.co.ke</li>
                <li>Phone: +254 700 000 000</li>
                <li>Nairobi, Kenya</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 AshGate Limited. All rights reserved. | Building dreams, one property at a time.</p>
          </div>
        </div>
      </footer>

      {/* Sign In Modal */}
      {isSignInOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
              <button
                onClick={() => setIsSignInOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="p-6 space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  value={signInData.password}
                  onChange={(e) => setSignInData({...signInData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-500">
                  Forgot password?
                </a>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Sign In
              </button>
              
              <div className="text-center">
                <span className="text-sm text-gray-600">Don&apos;t have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignInOpen(false);
                    setIsSignUpOpen(true);
                  }}
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  Sign up here
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Sign Up Modal */}
      {isSignUpOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Create Account</h2>
              <button
                onClick={() => setIsSignUpOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    value={signUpData.firstName}
                    onChange={(e) => setSignUpData({...signUpData, firstName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="First name"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    value={signUpData.lastName}
                    onChange={(e) => setSignUpData({...signUpData, lastName: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Last name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="signup-email"
                  value={signUpData.email}
                  onChange={(e) => setSignUpData({...signUpData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  value={signUpData.phone}
                  onChange={(e) => setSignUpData({...signUpData, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Enter your phone number"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  id="signup-password"
                  value={signUpData.password}
                  onChange={(e) => setSignUpData({...signUpData, password: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Create a password"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={signUpData.confirmPassword}
                  onChange={(e) => setSignUpData({...signUpData, confirmPassword: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  placeholder="Confirm your password"
                  required
                />
              </div>
              
              <div className="flex items-start">
                <input
                  type="checkbox"
                  id="acceptTerms"
                  checked={signUpData.acceptTerms}
                  onChange={(e) => setSignUpData({...signUpData, acceptTerms: e.target.checked})}
                  className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                  required
                />
                <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-600">
                  By checking this box you accept{' '}
                  <a href="/terms-and-conditions.html" target="_blank" className="text-primary-600 hover:text-primary-500 underline">
                    AshGate Limited&apos;s Terms & Conditions
                  </a>{' '}
                  and{' '}
                  <a href="#" className="text-primary-600 hover:text-primary-500 underline">
                    Privacy Policy
                  </a>
                </label>
              </div>
              
              <button
                type="submit"
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium"
              >
                Create Account
              </button>
              
              <div className="text-center">
                <span className="text-sm text-gray-600">Already have an account? </span>
                <button
                  type="button"
                  onClick={() => {
                    setIsSignUpOpen(false);
                    setIsSignInOpen(true);
                  }}
                  className="text-sm text-primary-600 hover:text-primary-500 font-medium"
                >
                  Sign in here
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}