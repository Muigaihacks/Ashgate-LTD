// stray code removed

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
  BarChart3,
  Newspaper,
  UsersRound,
  Bed,
  Bath,
  CarFront,
  Ruler,
  User,
  Home,
  ArrowUp,
  Facebook,
  Instagram,
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  Mail,
  Phone,
  Menu
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import ReCAPTCHA from 'react-google-recaptcha';

export default function HomePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [locations, setLocations] = useState<string[]>([]);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showLocationDropdown, setShowLocationDropdown] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const [filteredLocations, setFilteredLocations] = useState<string[]>([]);
  const [currentIconIndex, setCurrentIconIndex] = useState(0);
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const dropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSellDropdownOpen, setIsSellDropdownOpen] = useState(false);
  const sellDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [isAgentOpen, setIsAgentOpen] = useState(false);
  const [isPropertyOwnerOpen, setIsPropertyOwnerOpen] = useState(false);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false); // Will be connected to auth later
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [userType, setUserType] = useState<'homeowner' | 'agent' | 'landlord' | 'tenant' | null>(null); // Will be connected to auth later
  const [userName, setUserName] = useState<string>(''); // User's name for display
  const [isListPropertyDropdownOpen, setIsListPropertyDropdownOpen] = useState(false);
  const listPropertyDropdownTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
  const [currentVideo, setCurrentVideo] = useState('/videos/hero-video2.mp4'); // Fixed to video2
  const [logoStyle, setLogoStyle] = useState('bright'); // 'bright' or 'dark' based on video
  const [logoGlow, setLogoGlow] = useState(0.6); // controls intensity of logo backlight
  const [videoIndex, setVideoIndex] = useState(0);
  const [isSequentialMode, setIsSequentialMode] = useState(false); // Switched to time-based mode
  const [mounted, setMounted] = useState(false); // For hydration fix
  const [showScrollToTop, setShowScrollToTop] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);
  const [showCookieSettings, setShowCookieSettings] = useState(false);
  const [videoFade, setVideoFade] = useState(true); // For smooth video transitions
  const [isManuallyScrolling, setIsManuallyScrolling] = useState(false);
  
  // Auth & Registration States
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Agent Form State
  const [agentData, setAgentData] = useState({ firstName: '', lastName: '', email: '', phone: '', agency: '', about: '' });
  const [agentDocs, setAgentDocs] = useState<File[]>([]);
  const [agentCaptchaToken, setAgentCaptchaToken] = useState<string | null>(null);

  // Owner Form State
  const [ownerData, setOwnerData] = useState({ firstName: '', lastName: '', email: '', phone: '', address: '', reason: '', agreeViewing: false });
  const [ownerCaptchaToken, setOwnerCaptchaToken] = useState<string | null>(null);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify(signInData)
        });
        const data = await res.json();
        if (res.ok) {
            // Store token and user data
            if (data.token) {
              localStorage.setItem('ashgate_auth_token', data.token);
            }
            localStorage.setItem('ashgate_user', JSON.stringify(data.user));
            
            setIsUserLoggedIn(true);
            setUserName(data.user.name);
            
            // Derive type from backend roles
            const userRoles = data.user?.roles || [];
            let userTypeValue: 'homeowner' | 'agent' | 'landlord' | 'tenant' | null = 'homeowner';
            
            if (userRoles.some((r: any) => r.name === 'agent')) {
              userTypeValue = 'agent';
            } else if (userRoles.some((r: any) => r.name === 'property_owner')) {
              userTypeValue = 'homeowner';
            }
            
            setUserType(userTypeValue);
            setIsSignInOpen(false);
            setSignInData({ email: '', password: '' });
            
            if (data.require_password_change) {
                alert('Please change your password.');
                // Redirect to appropriate dashboard where they can change password
                const dashboardPath = userTypeValue === 'agent' ? '/dashboard/agent' : '/dashboard/homeowner';
                router.push(dashboardPath);
            }
        } else {
            alert(data.message || 'Login failed');
        }
    } catch (err) {
        console.error(err);
        alert('Login error');
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
      e.preventDefault();
      setIsSubmitting(true);
      try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/forgot-password`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
              body: JSON.stringify({ email: forgotPasswordEmail })
          });
          const data = await res.json();
          alert(data.message || 'If an account exists, a reset link has been sent.');
          setIsForgotPasswordOpen(false);
      } catch (err) {
          alert('Error sending reset link');
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleAgentSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!agentCaptchaToken) {
          alert('Please complete the CAPTCHA to confirm you are not a bot.');
          return;
      }

      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('firstName', agentData.firstName);
      formData.append('lastName', agentData.lastName);
      formData.append('email', agentData.email);
      formData.append('phone', agentData.phone);
      formData.append('profession', 'real-estate-agent');
      formData.append('yearsOfExperience', '0'); // Default
      formData.append('serialNumber', 'PENDING');
      formData.append('professionalBoard', agentData.agency); // Mapping agency to board field for now
      formData.append('bio', agentData.about);
      formData.append('recaptchaToken', agentCaptchaToken);
      agentDocs.forEach(file => formData.append('documents[]', file));

      try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
              method: 'POST',
              headers: { 'Accept': 'application/json' },
              body: formData
          });
          if (res.ok) {
              alert('Application submitted successfully!');
              setIsAgentOpen(false);
              setAgentCaptchaToken(null);
          } else {
              const d = await res.json();
              alert('Submission failed: ' + (d.message || JSON.stringify(d.errors)));
          }
      } catch (err) {
          alert('Error submitting application');
      } finally {
          setIsSubmitting(false);
      }
  };

  const handleOwnerSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!ownerCaptchaToken) {
          alert('Please complete the CAPTCHA to confirm you are not a bot.');
          return;
      }

      setIsSubmitting(true);
      const formData = new FormData();
      formData.append('firstName', ownerData.firstName);
      formData.append('lastName', ownerData.lastName);
      formData.append('email', ownerData.email);
      formData.append('phone', ownerData.phone);
      formData.append('profession', 'property-owner');
      formData.append('yearsOfExperience', '0');
      formData.append('serialNumber', 'N/A');
      formData.append('professionalBoard', 'N/A');
      formData.append('bio', `Address: ${ownerData.address}. Reason: ${ownerData.reason}. Agreed to viewing: ${ownerData.agreeViewing}`);
      formData.append('recaptchaToken', ownerCaptchaToken);

      try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/applications`, {
              method: 'POST',
              headers: { 'Accept': 'application/json' },
              body: formData
          });
          if (res.ok) {
              alert('Application submitted successfully!');
              setIsPropertyOwnerOpen(false);
              setOwnerCaptchaToken(null);
          } else {
              const d = await res.json();
              alert('Submission failed: ' + (d.message || JSON.stringify(d.errors)));
          }
      } catch (err) {
          alert('Error submitting application');
      } finally {
          setIsSubmitting(false);
      }
  };
  
  // Ref to track current video for comparison without stale closure
  const currentVideoRef = useRef(currentVideo);
  
  // Keep ref in sync with state
  useEffect(() => {
    currentVideoRef.current = currentVideo;
  }, [currentVideo]);

  useEffect(() => {
    if (isUserLoggedIn) {
      setIsProfileDropdownOpen(true);
    } else {
      setIsProfileDropdownOpen(false);
    }
  }, [isUserLoggedIn]);

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

  // Scroll to top button visibility
  useEffect(() => {
    const handleScroll = () => {
      // Get the community section element
      const communitySection = document.getElementById('community');
      if (communitySection) {
        const communityBottom = communitySection.offsetTop + communitySection.offsetHeight;
        // Show button when scrolled past community section (when Why Choose Ashgate section starts to be visible)
        setShowScrollToTop(window.scrollY > communityBottom - 100);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
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
  }, [videoIndex, isSequentialMode, videos]);

  // Time-based scheduling (default mode) with smooth transitions
  useEffect(() => {
    if (!isSequentialMode) {
      // Define setVideoByTime inside useEffect to access ref with current value
      // This fixes the stale closure issue - ref always has the latest value
      const setVideoByTime = () => {
        const hour = new Date().getHours();
        let newVideo = '';
        let newStyle = '';
        let newGlow = 0;
        
        if (hour >= 5 && hour < 10) {
          newVideo = '/videos/hero-video1.mp4';
          newStyle = 'bright';
          newGlow = 0.35;
        } else if (hour >= 10 && hour < 17) {
          newVideo = '/videos/hero-video2.mp4';
          newStyle = 'dark';
          newGlow = 0.45;
        } else if (hour >= 17 && hour < 22) {
          newVideo = '/videos/hero-video3.mp4';
          newStyle = 'bright';
          newGlow = 0.65;
        } else {
          newVideo = '/videos/hero-video4.mp4';
          newStyle = 'bright';
          newGlow = 0.9;
        }
        
        // Use ref to get current value (always up-to-date, no stale closure)
        if (currentVideoRef.current !== newVideo) {
          setVideoFade(false);
          setTimeout(() => {
            setCurrentVideo(newVideo);
            setLogoStyle(newStyle);
            setLogoGlow(newGlow);
            setVideoFade(true);
          }, 500); // Half second fade transition
        }
      };

      // Call immediately on mount
      setVideoByTime();
      // Then refresh every 5 minutes
      const timer = setInterval(setVideoByTime, 5 * 60 * 1000);
      return () => clearInterval(timer);
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

  const [propertyTypes, setPropertyTypes] = useState([
    { icon: <HomeIcon className="w-8 h-8" />, label: 'Houses', count: '0', apiName: 'House' },
    { icon: <Building2 className="w-8 h-8" />, label: 'Apartments', count: '0', apiName: 'Apartment' },
    { icon: <Trees className="w-8 h-8" />, label: 'Land', count: '0', apiName: 'Land' },
    { icon: <Landmark className="w-8 h-8" />, label: 'Commercial', count: '0', apiName: 'Commercial' },
  ]);

  // Fetch category counts and locations on mount
  useEffect(() => {
    const fetchCategoryCounts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/categories/counts`);
        if (response.ok) {
          const data = await response.json();
          const counts: Record<string, number> = {};
          data.data.forEach((item: any) => {
            counts[item.name] = item.count;
          });
          
          setPropertyTypes(prev => prev.map(type => ({
            ...type,
            count: counts[type.apiName] ? new Intl.NumberFormat('en-US').format(counts[type.apiName]) : '0'
          })));
        }
      } catch (error) {
        console.error('Error fetching category counts:', error);
      }
    };

    const fetchLocations = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties/locations/list`);
        if (response.ok) {
          const data = await response.json();
          setLocations(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching locations:', error);
      }
    };

    fetchCategoryCounts();
    fetchLocations();
  }, []);

  // Filter locations based on input
  useEffect(() => {
    if (searchLocation) {
      const filtered = locations.filter(loc => 
        loc.toLowerCase().includes(searchLocation.toLowerCase())
      );
      setFilteredLocations(filtered.slice(0, 10));
      setShowLocationDropdown(true);
    } else {
      setFilteredLocations([]);
      setShowLocationDropdown(false);
    }
  }, [searchLocation, locations]);

  // Featured listings - fetch from API
  const [featuredListings, setFeaturedListings] = useState<any[]>([]);
  const [isLoadingFeatured, setIsLoadingFeatured] = useState(true);
  
  useEffect(() => {
    const fetchFeaturedListings = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties?per_page=10`);
        if (response.ok) {
          const data = await response.json();
          // Filter for featured listings only (is_featured = true)
          const featured = (data.data || []).filter((p: any) => p.is_featured === true).slice(0, 10);
          
          // Transform API data to match expected format
          const transformed = featured.map((p: any) => {
            // Get primary image URL
            const primaryImage = p.images?.find((img: any) => img.is_primary);
            const imageUrl = primaryImage 
              ? (primaryImage.url.startsWith('http') ? primaryImage.url : `${process.env.NEXT_PUBLIC_API_URL}/storage/${primaryImage.url}`)
              : (p.images && p.images.length > 0 
                  ? (p.images[0].url.startsWith('http') ? p.images[0].url : `${process.env.NEXT_PUBLIC_API_URL}/storage/${p.images[0].url}`)
                  : null);
            
            // Get all image URLs
            const allImages = p.images && p.images.length > 0
              ? p.images
                  .sort((a: any, b: any) => (b.is_primary ? 1 : 0) - (a.is_primary ? 1 : 0))
                  .map((img: any) => img.url.startsWith('http') ? img.url : `${process.env.NEXT_PUBLIC_API_URL}/storage/${img.url}`)
              : [];
            
            return {
              id: p.id,
              title: p.title,
              price: p.listing_type === 'rent' 
                ? `${p.currency || 'KSh'} ${new Intl.NumberFormat('en-US').format(p.price)}/mo`
                : `${p.currency || 'KSh'} ${new Intl.NumberFormat('en-US').format(p.price)}`,
              listingType: p.listing_type,
              location: p.location_text,
              details: [
                p.beds ? `${p.beds} bed` : null,
                p.baths ? `${p.baths} bath` : null,
                p.area_sqm ? `${p.area_sqm}m²` : null,
              ].filter(Boolean).join(' • '),
              fullDescription: p.description || '',
              specs: { 
                beds: p.beds || 0, 
                baths: p.baths || 0, 
                parking: p.parking_spaces || 0, 
                area: p.area_sqm || 0, 
                year: p.year_built || 0 
              },
              category: p.property_type,
              broker: p.broker || 'Direct Owner',
              source: p.broker === 'Direct Owner' ? 'owner' : 'agent',
              has3DTour: p.has_3d_tour || false,
              hasFloorPlan: p.has_floor_plan || false,
              images: allImages.length > 0 ? allImages : (imageUrl ? [imageUrl] : []),
              coords: p.latitude && p.longitude ? { lat: parseFloat(p.latitude), lng: parseFloat(p.longitude) } : null,
              amenities: p.amenities || [],
              contact_email: p.contact_email || null,
              contact_phone: p.contact_phone || null
            };
          });
          
          setFeaturedListings(transformed);
        }
      } catch (error) {
        console.error('Error fetching featured listings:', error);
        setFeaturedListings([]);
      } finally {
        setIsLoadingFeatured(false);
      }
    };
    
    fetchFeaturedListings();
  }, []);

  const listingsScrollRef = useRef<HTMLDivElement | null>(null);
  const listingsAutoScrollRef = useRef<number | null>(null);
  const scrollListings = (direction: 'left' | 'right') => {
    const container = listingsScrollRef.current;
    if (!container) return;
    const amount = container.clientWidth * 0.9; // scroll ~1 viewport of cards
    container.scrollBy({ left: direction === 'left' ? -amount : amount, behavior: 'smooth' });
  };

  // Listing details modal state
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState<typeof featuredListings[0] | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageZoomed, setIsImageZoomed] = useState(false);
  const [isListingsHover, setIsListingsHover] = useState(false);

  // Reset image index when listing changes
  useEffect(() => {
    if (selectedListing) {
      setSelectedImageIndex(0);
      setIsImageZoomed(false);
    }
  }, [selectedListing]);

  // Keyboard navigation for zoomed images
  useEffect(() => {
    if (!isImageZoomed || !selectedListing?.images) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') {
        setSelectedImageIndex((prev) => (prev === 0 ? selectedListing.images.length - 1 : prev - 1));
      } else if (e.key === 'ArrowRight') {
        setSelectedImageIndex((prev) => (prev === selectedListing.images.length - 1 ? 0 : prev + 1));
      } else if (e.key === 'Escape') {
        setIsImageZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isImageZoomed, selectedListing]);

  // Expose listings for listings page (temporary until API)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).__ASHGATE_LISTINGS__ = featuredListings;
    }
  }, [featuredListings]);

  // Cookie banner visibility - show every time page loads (unless user is navigating to dashboard)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if user is navigating to dashboard - don't show cookie banner
    const path = window.location.pathname;
    if (path.startsWith('/dashboard')) {
      setShowCookieBanner(false);
      return;
    }
    
    // Check if cookie consent already given
    const consent = localStorage.getItem('ashgate_cookie_consent');
    if (!consent) {
      setShowCookieBanner(true);
    }
  }, []);

  const acceptCookies = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ashgate_cookie_consent', 'accepted');
      localStorage.setItem('ashgate_cookie_preferences', JSON.stringify({
        necessary: true,
        analytics: true,
        marketing: true
      }));
    }
    setShowCookieBanner(false);
    setShowCookieSettings(false);
  };

  const manageCookies = () => {
    setShowCookieSettings(true);
  };

  const saveCookiePreferences = () => {
    // This will be implemented when lawyer provides final policy
    // For now, just accept all
    acceptCookies();
  };

  // Auto-scroll featured listings - seamless infinite loop with smooth animation
  useEffect(() => {
    if (isManuallyScrolling) {
      if (listingsAutoScrollRef.current) {
        cancelAnimationFrame(listingsAutoScrollRef.current);
        listingsAutoScrollRef.current = null;
      }
      return;
    }
    
    const container = listingsScrollRef.current;
    if (!container) return;
    
    // Calculate one set width (one full set of listings)
    const oneSetWidth = container.scrollWidth / 3;
    const scrollSpeed = 0.8; // pixels per frame (smooth and visible)
    
    let lastTime = performance.now();
    
    const animate = (currentTime: number) => {
      if (!container) return;
      
      // If paused on hover, don't scroll but keep animation running
      if (!isListingsHover) {
        const deltaTime = currentTime - lastTime;
        const normalizedSpeed = scrollSpeed * (deltaTime / 16); // Normalize to 60fps
        
        container.scrollLeft += normalizedSpeed;
        
        // When we've scrolled through one full set, instantly reset to 0 (seamless loop)
        if (container.scrollLeft >= oneSetWidth) {
          container.style.scrollBehavior = 'auto';
          container.scrollLeft = 0;
          // Re-enable smooth scrolling after reset
          requestAnimationFrame(() => {
            container.style.scrollBehavior = 'smooth';
          });
        }
      }
      
      lastTime = currentTime;
      listingsAutoScrollRef.current = requestAnimationFrame(animate);
    };
    
    listingsAutoScrollRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (listingsAutoScrollRef.current) {
        cancelAnimationFrame(listingsAutoScrollRef.current);
        listingsAutoScrollRef.current = null;
      }
    };
  }, [isListingsHover, isManuallyScrolling]);

  // Mock testimonials (keep these until we have real ones)
  const mockTestimonials = [
    {
      id: 1,
      initials: 'SM',
      name: 'Sarah Mwangi',
      title: 'Property Owner, Nairobi',
      text: 'Ashgate helped me find the perfect apartment in Westlands within my budget. Their property management service is exceptional - rent collection is automated and maintenance requests are handled promptly.',
      rating: 5,
      socialMedia: 'https://twitter.com/sarahmwangi',
      platform: 'Twitter'
    },
    {
      id: 2,
      initials: 'JK',
      name: 'James Kiprop',
      title: 'Land Developer, Nakuru',
      text: 'The land development advisory service was a game-changer. Ashgate connected me with the right quantity surveyor and helped me navigate all the regulatory requirements. My project is now profitable!',
      rating: 5,
      socialMedia: 'https://linkedin.com/in/jameskiprop',
      platform: 'LinkedIn'
    },
    {
      id: 3,
      initials: 'AO',
      name: 'Aisha Ochieng',
      title: 'Expatriate, Kampala',
      text: 'As an expatriate relocating to Uganda, Ashgate\'s specialized service was invaluable. They found me a fully furnished home and connected me with interior designers. The transition was seamless!',
      rating: 5,
      socialMedia: 'https://facebook.com/aishaochieng',
      platform: 'Facebook'
    },
    {
      id: 4,
      initials: 'DN',
      name: 'David Njoroge',
      title: 'Investor, Mombasa',
      text: 'The carbon credits integration feature is brilliant! I can track my property\'s environmental impact and get certified as a green building. It\'s the future of real estate.',
      rating: 5,
      socialMedia: 'https://twitter.com/davidnjoroge',
      platform: 'Twitter'
    },
    {
      id: 5,
      initials: 'LM',
      name: 'Linda Mwangi',
      title: 'Landlord, Kisumu',
      text: 'Managing multiple properties was a nightmare until I found Ashgate. Their integrated payment system with M-Pesa makes rent collection effortless, and the maintenance tracking is top-notch.',
      rating: 5,
      socialMedia: 'https://linkedin.com/in/lindamwangi',
      platform: 'LinkedIn'
    },
    {
      id: 6,
      initials: 'RT',
      name: 'Robert Tembo',
      title: 'Business Owner, Dar es Salaam',
      text: 'The expert network is incredible! When I needed a solar installer, Ashgate connected me with a verified professional who completed the job perfectly. The platform truly delivers on its promises.',
      rating: 5,
      socialMedia: 'https://facebook.com/roberttembo',
      platform: 'Facebook'
    },
  ];

  // Real testimonials from API
  const [realTestimonials, setRealTestimonials] = useState<any[]>([]);
  
  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/testimonials`);
        if (response.ok) {
          const data = await response.json();
          setRealTestimonials(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };
    fetchTestimonials();
  }, []);

  // Combine mock and real testimonials (real ones take priority, then fill with mock)
  const testimonials = [...realTestimonials, ...mockTestimonials];

  // Close category dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        // Check if click is not on the input field
        const target = event.target as HTMLElement;
        if (!target.closest('input[placeholder="What are you looking for?"]')) {
          setShowCategoryDropdown(false);
        }
      }
    };

    if (showCategoryDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [showCategoryDropdown]);

  // Testimonials carousel - continuous smooth scrolling with pause on hover
  const testimonialsScrollRef = useRef<HTMLDivElement | null>(null);
  const [isTestimonialsHovered, setIsTestimonialsHovered] = useState(false);

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
          <div className="flex items-center h-16 gap-4">
            {/* Mobile Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-gray-700 p-2 rounded-md hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Mobile Sidebar */}
            {isMobileMenuOpen && (
              <>
                <div 
                  className="fixed inset-0 bg-black/50 z-40 md:hidden"
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50 md:hidden overflow-y-auto">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
                    <button
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="text-gray-500 hover:text-gray-700"
                      aria-label="Close menu"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                  <div className="p-4 space-y-2">
                    <button 
                      onClick={() => {
                        router.push('/listings?type=sale');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Buy
                    </button>
                    <button 
                      onClick={() => {
                        router.push('/listings?type=rent');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      Rent
                    </button>
                    <button 
                      onClick={() => {
                        setIsPropertyOwnerOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                    >
                      <Home className="w-4 h-4 mr-2" />
                      Sell - Property Owner
                    </button>
                    <button 
                      onClick={() => {
                        setIsAgentOpen(true);
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Sell - Agents
                    </button>
                    <button 
                      onClick={() => {
                        router.push('/community');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Community
                    </button>
                    <button 
                      onClick={() => {
                        router.push('/news');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      News & Insights
                    </button>
                    <button 
                      onClick={() => {
                        router.push('/community');
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors flex items-center"
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      <span className="text-primary-600">Ashgate Property Manager</span>
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Left Navigation - Desktop */}
            <div className="hidden md:block flex-shrink-0">
              <div className="flex items-baseline space-x-6">
                <button 
                  className="nav-button text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  onClick={() => router.push('/listings?type=sale')}
                >
                  Buy
                </button>
                <button 
                  className="nav-button text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                  onClick={() => router.push('/listings?type=rent')}
                >
                  Rent
                </button>
                {/* Sell Dropdown */}
                <div className="relative">
                  <button 
                    className="nav-button text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center"
                    onMouseEnter={() => {
                      if (sellDropdownTimeoutRef.current) {
                        clearTimeout(sellDropdownTimeoutRef.current);
                        sellDropdownTimeoutRef.current = null;
                      }
                      setIsSellDropdownOpen(true);
                    }}
                    onMouseLeave={() => {
                      sellDropdownTimeoutRef.current = setTimeout(() => {
                        setIsSellDropdownOpen(false);
                      }, 200);
                    }}
                    onClick={() => {
                      setIsSellDropdownOpen(!isSellDropdownOpen);
                    }}
                  >
                    Sell
                    <ChevronDown className="ml-1 w-4 h-4" />
                  </button>
                  {isSellDropdownOpen && (
                    <div 
                      className="absolute top-full left-0 mt-0 w-56 bg-white rounded-md shadow-xl border border-gray-200 py-1 z-50"
                      onMouseEnter={() => {
                        if (sellDropdownTimeoutRef.current) {
                          clearTimeout(sellDropdownTimeoutRef.current);
                          sellDropdownTimeoutRef.current = null;
                        }
                        setIsSellDropdownOpen(true);
                      }}
                      onMouseLeave={() => {
                        sellDropdownTimeoutRef.current = setTimeout(() => {
                          setIsSellDropdownOpen(false);
                        }, 200);
                      }}
                    >
                      <button 
                        onClick={() => {
                          setIsPropertyOwnerOpen(true);
                          setIsSellDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                      >
                        <Home className="w-4 h-4 mr-2" />
                        Property Owner
                      </button>
                      <button 
                        onClick={() => {
                          setIsAgentOpen(true);
                          setIsSellDropdownOpen(false);
                        }}
                        className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                      >
                        <Users className="w-4 h-4 mr-2" />
                        Agents
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Center - Rotating Real Estate Icons with Carousel Effect */}
            <div className="flex-shrink-0 flex items-center justify-center flex-1 md:flex-none md:ml-auto md:mr-6">
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
            <div className="flex items-center space-x-4 flex-shrink-0">
              {/* Desktop (lg+): Community & Ashgate Property Manager */}
              <div className="hidden lg:block">
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
                        }, 200);
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
                        <button 
                          onClick={() => router.push('/community')} 
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Experts
                        </button>
                        <button 
                          onClick={() => router.push('/news')} 
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          News & Insights
                        </button>
                </div>
                    )}
              </div>
                  
                  <button 
                    className="nav-button text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center"
                    onClick={() => router.push('/community')}
                  >
                    <BarChart3 className="w-4 h-4 mr-1" />
                    <span className="text-primary-600">Ashgate Property Manager</span>
                  </button>
                </div>
              </div>

              {/* Tablet (md to lg): Community & Sign In (instead of Ashgate Property Manager) */}
              <div className="hidden md:block lg:hidden">
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
                        }, 200);
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
                        <button 
                          onClick={() => router.push('/community')} 
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                        >
                          <Users className="w-4 h-4 mr-2" />
                          Experts
                        </button>
                        <button 
                          onClick={() => router.push('/news')} 
                          className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          News & Insights
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Sign In button (replaces Ashgate Property Manager on tablet) */}
                {isUserLoggedIn ? (
                  <button
                    className="nav-button text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2"
                    onClick={() => setIsProfileDropdownOpen(true)}
                    aria-expanded={isProfileDropdownOpen}
                  >
                    <User className="w-5 h-5" />
                      <span className="text-gray-700">{userName}</span>
                  </button>
                ) : (
                  <button 
                    className="nav-button text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2"
                    onClick={() => {
                      setIsSignInOpen(true);
                    }}
                  >
                    <User className="w-5 h-5" />
                      <span>Sign In</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Mobile & Desktop: Profile Icon / Sign In (only shows on mobile and desktop, hidden on tablet) */}
              <div className="relative md:hidden lg:block">
                {isUserLoggedIn ? (
                  <button
                    className="nav-button text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2"
                    onClick={() => setIsProfileDropdownOpen(true)}
                    aria-expanded={isProfileDropdownOpen}
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden lg:inline text-gray-700">{userName}</span>
                  </button>
                ) : (
                  <button 
                    className="nav-button text-gray-700 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 flex items-center gap-2"
                    onClick={() => {
                      setIsSignInOpen(true);
                    }}
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden lg:inline">Sign In</span>
                  </button>
                )}
                {isUserLoggedIn && isProfileDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-xl border border-gray-200 py-1 z-50">
                    {userType && (
                      <button 
                        onClick={() => {
                          setIsProfileDropdownOpen(false);
                          // Get user type from localStorage
                          const userStr = localStorage.getItem('ashgate_user');
                          const token = localStorage.getItem('ashgate_auth_token');
                          
                          if (userStr && token) {
                            const user = JSON.parse(userStr);
                            const userRoles = user.roles || [];
                            let dashboardPath = '/dashboard/homeowner'; // default
                            
                            if (userRoles.some((r: any) => r.name === 'agent')) {
                              dashboardPath = '/dashboard/agent';
                            } else if (userRoles.some((r: any) => r.name === 'property_owner')) {
                              dashboardPath = '/dashboard/homeowner';
                            }
                            
                            // Navigate to dashboard
                            router.push(dashboardPath);
                          } else {
                            router.push('/?login=true');
                          }
                        }}
                        className="w-full flex items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-primary-700 bg-primary-100 hover:bg-primary-200 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <Home className="w-4 h-4" />
                          {userType === 'homeowner' ? 'Homeowner Dashboard' : userType === 'agent' ? 'Agent Dashboard' : 'Dashboard'}
                        </span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                    <div className="px-4 py-2 text-xs text-gray-500 border-b border-gray-200">
                      Logged in as: {userName}
                    </div>
                    <button 
                      onClick={() => {
                        setIsUserLoggedIn(false);
                        setUserType(null);
                        setUserName('');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Video Background */}
      <section className="relative bg-gradient-to-b from-gray-900 to-gray-800 pt-4 pb-16 overflow-hidden min-h-[600px]">
        {/* Video Background - Time-based switching with smooth transitions */}
        {mounted && currentVideo && (
          <video
            key={currentVideo} // Force re-render when video changes
            autoPlay
            loop
            muted
            playsInline
            className="absolute top-0 left-0 w-full h-full object-cover z-0 transition-opacity duration-500 ease-in-out"
            style={{ 
              minHeight: '100%', 
              objectPosition: 'center',
              width: '100%',
              height: '100%',
              opacity: videoFade ? 1 : 0
            }}
            poster="/images/hero-placeholder.jpg"
            onLoadedData={(e) => {
              // Ensure video fades in smoothly when loaded
              setVideoFade(true);
            }}
            onError={(e) => {
              // Silent fail; toast is handled elsewhere
              // Force fallback image immediately
              setCurrentVideo('');
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
            <div className="mb-8 -mt-20 relative inline-block pt-20">
              {/* Semi-transparent background circle for better contrast - Adapts to video */}
              <div 
                className="absolute rounded-full mx-auto"
                style={{
                  width: '140px',
                  height: '140px',
                  left: '50%',
                  top: '70%',
                  transform: 'translate(-50%, -50%)',
                  background: logoStyle === 'bright' 
                    ? 'rgba(255, 255, 255, 0.18)' 
                    : 'rgba(0, 0, 0, 0.25)',
                  backdropFilter: 'blur(10px)',
                  border: logoStyle === 'bright'
                    ? '2px solid rgba(255, 255, 255, 0.4)'
                    : '2px solid rgba(255, 255, 255, 0.25)',
                  boxShadow: `0 0 40px rgba(255, 255, 255, ${logoGlow}), 0 10px 40px rgba(0,0,0,0.35)`,
                  zIndex: 1
                }}
              ></div>
              
              {/* Logo with enhanced visibility filters */}
              <Image 
                src="/ashgate-logo.png" 
                alt="Ashgate Limited" 
                width={5120}
                height={3840}
                className="h-[3840px] w-auto max-w-full mx-auto relative z-10"
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
              Ashgate connects you with the best real estate opportunities.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-4xl mx-auto bg-white bg-opacity-95 backdrop-blur-sm rounded-lg shadow-xl p-6 mb-12 border border-white border-opacity-30 relative" ref={categoryDropdownRef}>
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <input
                      type="text"
                      placeholder="What are you looking for?"
                      value={searchCategory}
                      readOnly
                      onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 !text-gray-900 placeholder-gray-500 cursor-pointer"
                      style={{ color: '#111827' }}
                    />
                    <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  </div>
                </div>
                <div className="flex-1">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
                    <input
                      type="text"
                      placeholder="Where?"
                      value={searchLocation}
                      onChange={(e) => setSearchLocation(e.target.value)}
                      onFocus={() => setShowLocationDropdown(true)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200 !text-gray-900 placeholder-gray-500"
                      style={{ color: '#111827' }}
                    />
                    {showLocationDropdown && filteredLocations.length > 0 && (
                      <div className="absolute z-[100] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                        {filteredLocations.map((loc, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              setSearchLocation(loc);
                              setShowLocationDropdown(false);
                            }}
                            className="w-full text-left px-4 py-2 hover:bg-gray-100 text-gray-700"
                          >
                            {loc}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <button onClick={() => {
                  const params = new URLSearchParams();
                  if (searchCategory) params.append('category', searchCategory);
                  if (searchLocation) params.append('location', searchLocation);
                  if (searchQuery) params.append('search', searchQuery);
                  router.push(`/listings?type=sale&${params.toString()}`);
                }} className="bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center justify-center transition-colors duration-200">
                  Search
                  <ArrowRight className="ml-2 w-5 h-5" />
                </button>
              </div>
              
              {/* Horizontal Category Dropdown */}
              {showCategoryDropdown && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-2xl z-[99999] p-2">
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setSearchCategory('');
                        setShowCategoryDropdown(false);
                      }}
                      className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                        searchCategory === '' 
                          ? 'bg-primary-600 text-white shadow-md' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      All Categories
                    </button>
                    {['House', 'Apartment', 'Land', 'Commercial'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSearchCategory(cat);
                          setShowCategoryDropdown(false);
                        }}
                        className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                          searchCategory === cat 
                            ? 'bg-primary-600 text-white shadow-md' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Property Types */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative z-0">
              {propertyTypes.map((type, index) => (
                <div 
                  key={index} 
                  className="bg-white bg-opacity-95 backdrop-blur-sm rounded-lg p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer border border-white border-opacity-30 hover:border-primary-300 group relative z-0"
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

      {/* Featured Listings */}
      <section id="listings" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">Featured <span className="text-primary-600">Listings</span></h2>
            <p className="text-gray-600 max-w-3xl mx-auto">A snapshot of premium homes, apartments, land and commercial spaces on Ashgate.</p>
          </div>
          <div className="relative overflow-hidden pr-16">
            {/* Navigation Arrows */}
            <button 
              aria-label="Previous" 
              onClick={(e) => {
                e.stopPropagation();
                setIsManuallyScrolling(true);
                const container = listingsScrollRef.current;
                if (container) {
                  // Scroll by approximately one card width (380px card + 24px gap = ~400px)
                  container.scrollBy({ left: -404, behavior: 'smooth' });
                  // Re-enable auto-scroll after a delay
                  setTimeout(() => setIsManuallyScrolling(false), 2000);
                }
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center transition-all hover:scale-110"
            >
              <ChevronLeft className="w-6 h-6 text-gray-700" />
            </button>
            <button 
              aria-label="Next" 
              onClick={(e) => {
                e.stopPropagation();
                setIsManuallyScrolling(true);
                const container = listingsScrollRef.current;
                if (container) {
                  // Scroll by approximately one card width (380px card + 24px gap = ~400px)
                  container.scrollBy({ left: 404, behavior: 'smooth' });
                  // Re-enable auto-scroll after a delay
                  setTimeout(() => setIsManuallyScrolling(false), 2000);
                }
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white shadow-lg rounded-full w-12 h-12 flex items-center justify-center transition-all hover:scale-110"
            >
              <ChevronRight className="w-6 h-6 text-gray-700" />
            </button>
            
            <div 
              ref={listingsScrollRef}
              className="flex gap-6 pb-2 overflow-x-auto"
              style={{ 
                scrollbarWidth: 'none', 
                msOverflowStyle: 'none',
                scrollBehavior: 'smooth'
              }}
              onMouseEnter={() => setIsListingsHover(true)}
              onMouseLeave={() => setIsListingsHover(false)}
              onScroll={() => {
                // Detect manual scrolling
                setIsManuallyScrolling(true);
                setTimeout(() => setIsManuallyScrolling(false), 2000);
              }}
            >
              {/* Render listings - use unique IDs to prevent duplicates */}
              {featuredListings.length > 0 ? (
                [...featuredListings, ...featuredListings, ...featuredListings].map((item, idx) => {
                const isDirectOwner = item.source === 'owner' || item.broker === 'Direct Owner';
                return (
                <div key={`${item.id}-${idx}`} className="flex-shrink-0 w-[380px] bg-white rounded-xl overflow-hidden shadow card-hover-raise cursor-pointer" onClick={() => { setSelectedListing(item); setIsDetailsOpen(true); setSelectedImageIndex(0); }}>
                  <div className={`px-5 pt-4 text-xs font-semibold ${isDirectOwner ? 'text-blue-600' : 'text-gray-500'}`}>
                    {isDirectOwner ? 'Direct Owner' : item.broker}
                  </div>
                  <div className="relative h-44 bg-gradient-to-br from-gray-200 to-gray-300 overflow-hidden">
                    {item.images && item.images.length > 0 ? (
                      <img 
                        src={item.images[0]} 
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : null}
                    <div className="absolute top-2 left-2 flex gap-2">
                      {item.has3DTour && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/90 text-gray-800 shadow">3D Tour</span>
                      )}
                      {item.hasFloorPlan && (
                        <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/90 text-gray-800 shadow">Floor Plan</span>
                      )}
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
                      {item.specs?.beds ? (<span className="inline-flex items-center gap-1"><Bed className="w-4 h-4"/>{item.specs.beds}</span>) : null}
                      {item.specs?.baths ? (<span className="inline-flex items-center gap-1"><Bath className="w-4 h-4"/>{item.specs.baths}</span>) : null}
                      {item.specs?.parking ? (<span className="inline-flex items-center gap-1"><CarFront className="w-4 h-4"/>{item.specs.parking}</span>) : null}
                      {item.specs?.area ? (<span className="inline-flex items-center gap-1"><Ruler className="w-4 h-4"/>{item.specs.area}m²</span>) : null}
                    </div>
                  </div>
                </div>
                );
              })) : (
                <div className="flex-shrink-0 w-[380px] flex items-center justify-center text-gray-500">
                  No featured listings available
                </div>
              )}
            </div>
          </div>

          <div className="text-center mt-10">
            <button onClick={() => router.push('/listings')} className="inline-flex items-center px-6 py-3 rounded-lg bg-primary-600 text-white font-semibold hover:bg-primary-700 transition-colors">View All Listings</button>
          </div>
        </div>
      </section>

      {/* Community Spotlight (replaces old CTA section) */}
      <section id="community" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-3 inline-flex items-center gap-3 justify-center"><UsersRound className="w-8 h-8 text-primary-600" /> Ashgate <span className="text-primary-600">Community</span></h2>
            <p className="text-gray-600 max-w-3xl mx-auto">A trusted network of verified professionals who make buying, building and moving effortless.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-1">Legal & Conveyancing</h3>
              <p className="text-gray-600 text-sm">Real estate and conveyancing lawyers to safeguard your purchase.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-1">Cabro & Landscaping</h3>
              <p className="text-gray-600 text-sm">Cabro specialists and professional landscapers for perfect outdoors.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-1">Solar & Utilities</h3>
              <p className="text-gray-600 text-sm">Solar installers and utility experts for efficient, green living.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow">
              <h3 className="font-semibold text-gray-900 mb-1">Moving & Staging</h3>
              <p className="text-gray-600 text-sm">Professional movers, photographers and 3D staging partners.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow hover:shadow-lg transition-shadow sm:col-span-2 lg:col-span-4">
              <h3 className="font-semibold text-gray-900 mb-1 inline-flex items-center gap-2"><Newspaper className="w-5 h-5 text-primary-600"/> News & Insights</h3>
              <p className="text-gray-600 text-sm">Expert-written articles and videos demystifying land and property. Example: why planting specific tree species on idle land can pay, and which trees thrive in each Kenyan region.</p>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white rounded-xl p-6 shadow">
              <h4 className="font-semibold text-gray-900 mb-2">How Our Community Works</h4>
              <p className="text-gray-700 leading-relaxed">Join a growing ecosystem of vetted experts who deliver reliable services around your property journey — from due diligence and legal transfers to moving in, solar fitting and ongoing maintenance. We connect you to the right pro at the right time.</p>
            </div>
            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="font-semibold text-gray-900 mb-2">Become a Partner</h4>
              <p className="text-gray-700 mb-4">Are you an expert? Apply to join our network and grow with Ashgate clients.</p>
              <button onClick={() => router.push('/community')} className="w-full bg-primary-600 text-white rounded-lg py-3 font-semibold hover:bg-primary-700">Explore Community</button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose <span className="text-primary-600">Ashgate</span>?
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
            Join thousands of satisfied customers who found their perfect home through Ashgate.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={() => router.push('/listings')} className="bg-white text-primary-600 px-8 py-4 rounded-lg font-semibold hover:bg-primary-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
              Browse Properties
            </button>
            {/* List Your Property Dropdown */}
            <div className="relative inline-block">
              <button 
                onMouseEnter={() => {
                  if (listPropertyDropdownTimeoutRef.current) {
                    clearTimeout(listPropertyDropdownTimeoutRef.current);
                    listPropertyDropdownTimeoutRef.current = null;
                  }
                  setIsListPropertyDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  listPropertyDropdownTimeoutRef.current = setTimeout(() => {
                    setIsListPropertyDropdownOpen(false);
                  }, 200);
                }}
                onClick={() => setIsListPropertyDropdownOpen(!isListPropertyDropdownOpen)}
                className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-2"
              >
                List Your Property
                <ChevronDown className="w-4 h-4" />
              </button>
              {isListPropertyDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-56 bg-white rounded-md shadow-xl border border-gray-200 py-1 z-50"
                  onMouseEnter={() => {
                    if (listPropertyDropdownTimeoutRef.current) {
                      clearTimeout(listPropertyDropdownTimeoutRef.current);
                      listPropertyDropdownTimeoutRef.current = null;
                    }
                    setIsListPropertyDropdownOpen(true);
                  }}
                  onMouseLeave={() => {
                    listPropertyDropdownTimeoutRef.current = setTimeout(() => {
                      setIsListPropertyDropdownOpen(false);
                    }, 200);
                  }}
                >
                  <button 
                    onClick={() => {
                      setIsPropertyOwnerOpen(true);
                      setIsListPropertyDropdownOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                  >
                    <Home className="w-4 h-4 mr-2" />
                    Property Owner
                  </button>
                  <button 
                    onClick={() => {
                      setIsAgentOpen(true);
                      setIsListPropertyDropdownOpen(false);
                    }}
                    className="w-full flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors text-left"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Agents
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (carousel with background) */}
      <section className="py-20 bg-gray-900 relative">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{backgroundImage: 'url(/images/testimonials-background.jpg)'}}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              <span className="text-white">What Our </span><span className="text-primary-200">Clients</span><span className="text-white"> Say</span>
            </h2>
            <p className="text-lg text-gray-100 max-w-3xl mx-auto leading-relaxed">
              Don&apos;t just take our word for it — hear from satisfied customers who found their perfect property through Ashgate.
            </p>
          </div>
          <div className="relative overflow-hidden">
            <div 
              ref={testimonialsScrollRef}
              className={`testimonials-container flex gap-6 pb-2 ${isTestimonialsHovered ? 'paused' : ''}`}
              onMouseEnter={() => setIsTestimonialsHovered(true)}
              onMouseLeave={() => setIsTestimonialsHovered(false)}
            >
              {/* Render testimonials twice for seamless loop */}
              {[...testimonials, ...testimonials].map((testimonial, idx) => (
                <div 
                  key={`${testimonial.id}-${idx}`}
                  className="flex-shrink-0 min-w-[320px] max-w-[360px] bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-all duration-300 cursor-pointer"
                  onClick={() => {
                    if (testimonial.socialMedia) {
                      window.open(testimonial.socialMedia, '_blank', 'noopener,noreferrer');
                    }
                  }}
                >
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                      <span className="text-primary-600 font-bold text-lg">{testimonial.initials}</span>
                </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-gray-600 text-sm">{testimonial.title}</p>
                </div>
                    {testimonial.socialMedia && (
                      <div className="text-xs text-primary-600 font-medium opacity-70 hover:opacity-100 transition-opacity">
                        {testimonial.platform} →
              </div>
                    )}
              </div>
              <p className="text-gray-700 leading-relaxed">
                    &quot;{testimonial.text}&quot;
              </p>
              <div className="flex text-yellow-400 mt-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
            </div>
              ))}
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
          
          <PartnersGrid />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">Ashgate Limited</h3>
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
                <li><a href="/community" className="hover:text-white transition-colors duration-200">Expert Network</a></li>
                <li><a href="#" className="hover:text-white transition-colors duration-200">Carbon Credits</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Email: info@ashgate.co.ke</li>
                <li>Phone: +254 700 580 379</li>
                <li>Nairobi, Kenya</li>
              </ul>
              {/* Social Media Icons */}
              <div className="mt-4 flex items-center gap-4">
                <a 
                  href="https://www.facebook.com/ashgateproperty" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200" 
                  aria-label="Facebook"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a 
                  href="https://x.com/ashgateproperty?s=21" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200" 
                  aria-label="X (Twitter)"
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                    <path d="M3 3h4l5 7 5-7h4l-7.5 10L21 21h-4l-5-7-5 7H3l7.5-10L3 3z" />
                  </svg>
                </a>
                <a 
                  href="https://www.instagram.com/ashgatepropertieskenya/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors duration-200" 
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a 
                  href="#" 
                  className="text-gray-300 hover:text-white transition-colors duration-200 opacity-50 cursor-not-allowed" 
                  aria-label="YouTube (Coming Soon)"
                  title="YouTube channel coming soon"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2024 Ashgate Limited. All rights reserved. | Building dreams, one property at a time.</p>
            <div className="mt-4 text-sm text-gray-400">
              <span className="mr-2">Crafted with precision by</span>
              <a 
                href="https://tyrese-portfolio-black.vercel.app/#home" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-primary-300 hover:text-primary-100 font-semibold transition-colors duration-200 underline decoration-primary-500/50 hover:decoration-primary-400"
              >
                Kratos Systems LTD
              </a>
              <span className="ml-2">— You Dream it, We Build it!</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Cookie Banner */}
      {showCookieBanner && !showCookieSettings && (
        <div className="fixed inset-x-0 bottom-4 z-50 px-4">
          <div className="max-w-4xl mx-auto bg-white/80 backdrop-blur-xl border border-white/60 shadow-2xl rounded-2xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="flex-1 text-sm text-gray-800 space-y-2">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-6 h-6 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                  </svg>
                  <p className="font-bold text-lg text-gray-900">We Use Cookies</p>
                </div>
                <p className="text-gray-700 leading-relaxed">
                  At Ashgate Limited, we respect your privacy and are committed to protecting your personal data. 
                  We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, 
                  personalize content, and provide social media features. Cookies are small text files that are placed on your 
                  device when you visit our website.
                </p>
                <p className="text-gray-600 text-xs leading-relaxed">
                  By clicking &quot;Accept All&quot;, you consent to our use of cookies in accordance with our Cookie Policy. 
                  You can manage your cookie preferences at any time by clicking &quot;Manage Cookies&quot;. 
                  For more information, please review our Privacy Policy and Cookie Policy.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3 flex-shrink-0">
                <button
                  onClick={acceptCookies}
                  className="px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-sm transition-colors"
                >
                  Accept All
                </button>
                <button
                  onClick={manageCookies}
                  className="px-5 py-2.5 rounded-lg border-2 border-primary-600 text-primary-600 text-sm font-semibold hover:bg-primary-50 transition-colors"
                >
                  Manage Cookies
                </button>
                <button
                  onClick={() => {
                    setShowCookieBanner(false);
                    if (typeof window !== 'undefined') {
                      localStorage.setItem('ashgate_cookie_consent', 'dismissed');
                    }
                  }}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cookie Settings Modal */}
      {showCookieBanner && showCookieSettings && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900">Cookie Preferences</h3>
              <p className="text-sm text-gray-600 mt-1">Manage your cookie settings. You can enable or disable different types of cookies below.</p>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Necessary Cookies</h4>
                  <p className="text-sm text-gray-600">These cookies are essential for the website to function properly. They cannot be disabled.</p>
                </div>
                <div className="ml-4">
                  <input type="checkbox" checked disabled className="w-5 h-5 rounded border-gray-300 text-primary-600" />
                </div>
              </div>
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Analytics Cookies</h4>
                  <p className="text-sm text-gray-600">Help us understand how visitors interact with our website by collecting and reporting information anonymously.</p>
                </div>
                <div className="ml-4">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                </div>
              </div>
              <div className="flex items-start justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 mb-1">Marketing Cookies</h4>
                  <p className="text-sm text-gray-600">Used to track visitors across websites to display relevant advertisements and measure campaign effectiveness.</p>
                </div>
                <div className="ml-4">
                  <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
              <button
                onClick={() => {
                  setShowCookieSettings(false);
                  setShowCookieBanner(false);
                  if (typeof window !== 'undefined') {
                    localStorage.setItem('ashgate_cookie_consent', 'dismissed');
                  }
                }}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveCookiePreferences}
                className="px-5 py-2.5 rounded-lg bg-primary-600 text-white text-sm font-semibold hover:bg-primary-700 shadow-sm transition-colors"
              >
                Save Preferences
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollToTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed right-6 bottom-6 z-50 bg-primary-600 text-white p-3 rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 hover:scale-110"
          aria-label="Scroll to top"
        >
          <ArrowUp className="w-6 h-6" />
        </button>
      )}

      {/* Listing Details Modal */}
      {isDetailsOpen && selectedListing && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-start justify-center overflow-y-auto p-4" onClick={() => { setIsDetailsOpen(false); setSelectedListing(null); }}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl mt-8" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-gray-200">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{selectedListing.title}</h3>
                <p className="text-gray-600">{selectedListing.location}</p>
              </div>
              <div className="text-right">
                <div className="text-primary-600 font-bold text-xl">{selectedListing.price}</div>
                <div className={`text-xs font-semibold ${selectedListing.source === 'owner' || selectedListing.broker === 'Direct Owner' ? 'text-blue-600' : 'text-gray-500'}`}>
                  {selectedListing.source === 'owner' || selectedListing.broker === 'Direct Owner' ? 'Direct Owner' : selectedListing.broker}
                </div>
              </div>
            </div>

            {/* Top area: gallery + sidebar CTA (Zillow-inspired) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-0">
              <div className="lg:col-span-2">
                {selectedListing.images && selectedListing.images.length > 0 ? (
                  <div className="relative h-72 bg-gray-900 overflow-hidden group">
                    <img 
                      src={selectedListing.images[selectedImageIndex]} 
                      alt={`${selectedListing.title} - Image ${selectedImageIndex + 1}`}
                      className="w-full h-full object-cover cursor-zoom-in"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsImageZoomed(true);
                      }}
                    />
                    <div className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      <ZoomIn className="w-5 h-5" />
                    </div>
                    {selectedListing.images.length > 1 && (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex((prev) => (prev === 0 ? selectedListing.images.length - 1 : prev - 1));
                          }}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Previous image"
                        >
                          <ChevronLeft className="w-6 h-6" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedImageIndex((prev) => (prev === selectedListing.images.length - 1 ? 0 : prev + 1));
                          }}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all opacity-0 group-hover:opacity-100"
                          aria-label="Next image"
                        >
                          <ChevronRight className="w-6 h-6" />
                        </button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                          {selectedImageIndex + 1} / {selectedListing.images.length}
                        </div>
                        {/* Thumbnail strip */}
                        <div className="absolute bottom-0 left-0 right-0 bg-black/50 p-2 flex gap-2 overflow-x-auto">
                          {selectedListing.images.map((img, idx) => (
                            <button
                              key={idx}
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImageIndex(idx);
                              }}
                              className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-all ${
                                idx === selectedImageIndex ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'
                              }`}
                            >
                              <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                <div className="h-72 bg-gray-200 flex items-center justify-center">Image Gallery (placeholder)</div>
                )}
                {/* Spec bar under gallery */}
                <div className="px-6 py-3 border-t border-gray-200">
                  <div className="flex flex-wrap gap-4 text-sm text-gray-800">
                    {selectedListing?.specs?.beds ? (<span className="inline-flex items-center gap-1"><Bed className="w-4 h-4"/> {selectedListing.specs.beds} Beds</span>) : null}
                    {selectedListing?.specs?.baths ? (<span className="inline-flex items-center gap-1"><Bath className="w-4 h-4"/> {selectedListing.specs.baths} Baths</span>) : null}
                    {selectedListing?.specs?.parking ? (<span className="inline-flex items-center gap-1"><CarFront className="w-4 h-4"/> {selectedListing.specs.parking} Parking</span>) : null}
                    {selectedListing?.specs?.area ? (<span className="inline-flex items-center gap-1"><Ruler className="w-4 h-4"/> {selectedListing.specs.area} m²</span>) : null}
                  </div>
                </div>
                <div className="px-6 py-2 text-gray-700 whitespace-pre-line">
                  {selectedListing.fullDescription || selectedListing.details}
                </div>
                <div className="px-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {selectedListing.has3DTour && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800 border">3D Tour</span>
                    )}
                    {selectedListing.hasFloorPlan && (
                      <span className="text-xs font-semibold px-2 py-1 rounded-full bg-gray-100 text-gray-800 border">Floor Plan</span>
                    )}
                  </div>
                  {selectedListing.amenities && selectedListing.amenities.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Amenities</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedListing.amenities.map((amenity: any, idx: number) => (
                          <span key={idx} className="text-xs font-medium px-3 py-1 rounded-full bg-primary-50 text-primary-700 border border-primary-200">
                            {amenity.name || amenity}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <aside className="border-l border-gray-200 p-6">
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <div className="font-semibold text-gray-900 mb-1">{selectedListing.source === 'owner' || selectedListing.broker === 'Direct Owner' ? 'Contact Owner' : selectedListing.broker === 'Ashgate Portfolio' ? 'Contact Ashgate' : 'Contact Agent'}</div>
                  <p className="text-sm text-gray-600 mb-3">Have questions or want to schedule a tour?</p>
                  <div className="flex flex-col gap-2">
                    {selectedListing.contact_email && (
                      <a 
                        href={`mailto:${selectedListing.contact_email}`}
                        className="w-full flex items-center justify-center gap-2 bg-primary-600 text-white rounded-lg py-3 font-semibold hover:bg-primary-700 transition-colors"
                      >
                      <Mail className="w-4 h-4" />
                        {selectedListing.source === 'owner' || selectedListing.broker === 'Direct Owner' ? 'Email Owner' : selectedListing.broker === 'Ashgate Portfolio' ? 'Email Ashgate' : 'Email Agent'}
                      </a>
                    )}
                    {selectedListing.contact_phone && (
                      <a 
                        href={`tel:${selectedListing.contact_phone.replace(/\s/g, '')}`}
                        className="w-full flex items-center justify-center gap-2 bg-gray-700 text-white rounded-lg py-3 font-semibold hover:bg-gray-800 transition-colors"
                      >
                      <Phone className="w-4 h-4" />
                        {selectedListing.source === 'owner' || selectedListing.broker === 'Direct Owner' ? 'Call Owner' : selectedListing.broker === 'Ashgate Portfolio' ? 'Call Ashgate' : 'Call Agent'}
                      </a>
                    )}
                  </div>
                </div>
                <div className="text-sm text-gray-600">Listed by: <span className={`font-semibold ${selectedListing.source === 'owner' || selectedListing.broker === 'Direct Owner' ? 'text-blue-600' : 'text-gray-900'}`}>
                  {selectedListing.source === 'owner' || selectedListing.broker === 'Direct Owner' ? 'Direct Owner' : selectedListing.broker}
                </span></div>
              </aside>
            </div>

            {/* Tabs with content */}
            <div className="px-6 py-4 border-t border-gray-200">
              <Tabs selectedListing={selectedListing} />
            </div>

            <div className="p-5 border-t border-gray-200 flex justify-end">
              <button className="px-5 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200" onClick={() => { setIsDetailsOpen(false); setSelectedListing(null); setSelectedImageIndex(0); setIsImageZoomed(false); }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Image Zoom Modal */}
      {isImageZoomed && selectedListing && selectedListing.images && selectedListing.images.length > 0 && (
        <div 
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="relative w-full h-full flex items-center justify-center max-w-7xl mx-auto">
            {/* Close button */}
            <button
              onClick={() => setIsImageZoomed(false)}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
              aria-label="Close zoom"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Main zoomed image */}
            <img
              src={selectedListing.images[selectedImageIndex]}
              alt={`${selectedListing.title} - Image ${selectedImageIndex + 1}`}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />

            {/* Navigation arrows */}
            {selectedListing.images.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev === 0 ? selectedListing.images.length - 1 : prev - 1));
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-colors"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImageIndex((prev) => (prev === selectedListing.images.length - 1 ? 0 : prev + 1));
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-4 rounded-full transition-colors"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 text-white px-4 py-2 rounded-full text-sm backdrop-blur-sm">
                  {selectedImageIndex + 1} / {selectedListing.images.length}
                </div>

                {/* Thumbnail strip */}
                <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-2 max-w-4xl overflow-x-auto px-4">
                  {selectedListing.images.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedImageIndex(idx);
                      }}
                      className={`flex-shrink-0 w-20 h-16 rounded overflow-hidden border-2 transition-all ${
                        idx === selectedImageIndex ? 'border-white scale-110' : 'border-white/30 opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </>
            )}

            {/* Keyboard navigation hints */}
            <div className="absolute bottom-4 right-4 text-white/50 text-xs">
              Use arrow keys or click to navigate
            </div>
          </div>
        </div>
      )}

      {/* Agent Registration Modal */}
      {isAgentOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsAgentOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Agent Registration</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsAgentOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleAgentSubmit} className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">First Name</label>
                <input 
                    className="w-full border rounded-lg px-3 py-2 !text-gray-900" 
                    style={{ color: '#111827' }} 
                    placeholder="Jane" 
                    value={agentData.firstName}
                    onChange={(e) => setAgentData({...agentData, firstName: e.target.value})}
                    required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Last Name</label>
                <input 
                    className="w-full border rounded-lg px-3 py-2 !text-gray-900" 
                    style={{ color: '#111827' }} 
                    placeholder="Doe"
                    value={agentData.lastName}
                    onChange={(e) => setAgentData({...agentData, lastName: e.target.value})}
                    required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email</label>
                <input 
                    type="email" 
                    className="w-full border rounded-lg px-3 py-2 !text-gray-900" 
                    style={{ color: '#111827' }} 
                    placeholder="agent@example.com"
                    value={agentData.email}
                    onChange={(e) => setAgentData({...agentData, email: e.target.value})}
                    required
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Phone</label>
                <input 
                    className="w-full border rounded-lg px-3 py-2 !text-gray-900" 
                    style={{ color: '#111827' }} 
                    placeholder="+254 7xx xxx xxx"
                    value={agentData.phone}
                    onChange={(e) => setAgentData({...agentData, phone: e.target.value})}
                    required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Agency / Brokerage</label>
                <input 
                    className="w-full border rounded-lg px-3 py-2 !text-gray-900" 
                    style={{ color: '#111827' }} 
                    placeholder="Company name"
                    value={agentData.agency}
                    onChange={(e) => setAgentData({...agentData, agency: e.target.value})}
                    required
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">About</label>
                <textarea 
                    className="w-full border rounded-lg px-3 py-2 !text-gray-900" 
                    style={{ color: '#111827' }} 
                    rows={3} 
                    placeholder="Short bio and service areas"
                    value={agentData.about}
                    onChange={(e) => setAgentData({...agentData, about: e.target.value})}
                    required
                ></textarea>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm text-gray-700 mb-1">Supporting Documents</label>
                <p className="text-xs text-gray-500 mb-2">Upload relevant documents for verification (e.g., business license, registration certificate, etc.)</p>
                <input 
                  type="file" 
                  multiple 
                  accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                  className="w-full border rounded-lg px-3 py-2 text-sm !text-gray-900"
                  style={{ color: '#111827' }}
                  onChange={(e) => e.target.files && setAgentDocs(Array.from(e.target.files))}
                />
                <p className="text-xs text-gray-500 mt-1">Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB per file)</p>
              </div>
              <div className="md:col-span-2 space-y-4">
                <div className="text-sm text-gray-700">
                  Paying homage to{' '}
                  <a href="/terms-and-conditions.html" className="underline text-primary-600">
                    Ashgate Limited&apos;s Terms & Conditions
                  </a>
                  , we thoroughly screen every Agent Application to keep Ashgate a secure, fraud‑free
                  environment for our users.
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                    onChange={(token) => setAgentCaptchaToken(token)}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary-600 text-white px-5 py-2 rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Property Owner Registration Modal */}
      {isPropertyOwnerOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setIsPropertyOwnerOpen(false)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Property Owner Registration</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={() => setIsPropertyOwnerOpen(false)}>✕</button>
            </div>
            <form onSubmit={handleOwnerSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900" 
                    style={{ color: '#111827' }} 
                    placeholder="John" 
                    value={ownerData.firstName}
                    onChange={(e) => setOwnerData({...ownerData, firstName: e.target.value})}
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900" 
                    style={{ color: '#111827' }} 
                    placeholder="Doe" 
                    value={ownerData.lastName}
                    onChange={(e) => setOwnerData({...ownerData, lastName: e.target.value})}
                    required 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input 
                    type="email" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900" 
                    style={{ color: '#111827' }} 
                    placeholder="owner@example.com" 
                    value={ownerData.email}
                    onChange={(e) => setOwnerData({...ownerData, email: e.target.value})}
                    required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                <input 
                    type="tel" 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900" 
                    style={{ color: '#111827' }} 
                    placeholder="+254 7xx xxx xxx" 
                    value={ownerData.phone}
                    onChange={(e) => setOwnerData({...ownerData, phone: e.target.value})}
                    required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Property Address</label>
                <input 
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900" 
                    style={{ color: '#111827' }} 
                    placeholder="Enter property address" 
                    value={ownerData.address}
                    onChange={(e) => setOwnerData({...ownerData, address: e.target.value})}
                    required 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Selling</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900"
                  style={{ color: '#111827' }} 
                  rows={4} 
                  placeholder="Please tell us why you want to sell your property (e.g., mortgage repayment issues, relocation, etc.)"
                  value={ownerData.reason}
                  onChange={(e) => setOwnerData({...ownerData, reason: e.target.value})}
                  required
                />
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="agreeViewing"
                    className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    checked={ownerData.agreeViewing}
                    onChange={(e) => setOwnerData({...ownerData, agreeViewing: e.target.checked})}
                    required
                  />
                  <label htmlFor="agreeViewing" className="ml-2 text-sm text-gray-700">
                    I agree to allow Ashgate Limited to visit my property for viewing and to take professional photos and videos if needed. I understand that this is necessary for listing my property on the platform.
                  </label>
                </div>
              </div>
              
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm text-gray-700">
                  <strong>Note:</strong> If you have poor quality photos or videos of your property, we will schedule a professional photography session. Our team will contact you to arrange a convenient time for the property visit. <strong>The professional photography session will be at the owner&apos;s cost.</strong>
                </p>
              </div>
              
              <div className="pt-4 border-t border-gray-200 space-y-4">
                <div className="text-sm text-gray-600">
                  By submitting, you agree to{' '}
                  <a
                    href="/terms-and-conditions.html"
                    target="_blank"
                    className="text-primary-600 hover:text-primary-500 underline"
                  >
                    Ashgate Limited&apos;s Terms & Conditions
                  </a>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <ReCAPTCHA
                    sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ''}
                    onChange={(token) => setOwnerCaptchaToken(token)}
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors font-medium disabled:opacity-50"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

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
            
            <form 
              onSubmit={handleSignIn}
              className="p-6 space-y-4"
            >
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={signInData.email}
                  onChange={(e) => setSignInData({...signInData, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent !text-gray-900"
                  style={{ color: '#111827' }}
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent !text-gray-900"
                  style={{ color: '#111827' }}
                  placeholder="Enter your password"
                  required
                />
              </div>
              
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" className="rounded border-gray-300 text-primary-600 focus:ring-primary-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <button 
                  type="button"
                  onClick={() => { setIsSignInOpen(false); setIsForgotPasswordOpen(true); }}
                  className="text-sm text-primary-600 hover:text-primary-500"
                >
                  Forgot password?
                </button>
              </div>
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50"
              >
                {isSubmitting ? 'Signing In...' : 'Sign In'}
              </button>
              
            </form>
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {isForgotPasswordOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
              <button
                onClick={() => setIsForgotPasswordOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleForgotPassword} className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Enter your email address and we&apos;ll send you a link to reset your password.
              </p>
              
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="forgot-email"
                  value={forgotPasswordEmail}
                  onChange={(e) => setForgotPasswordEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent !text-gray-900"
                  style={{ color: '#111827' }}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-2">
                <button
                    type="button"
                    onClick={() => { setIsForgotPasswordOpen(false); setIsSignInOpen(true); }}
                    className="flex-1 py-2 px-4 border border-gray-300 rounded-md hover:bg-gray-50 text-gray-700 font-medium"
                >
                    Back to Sign In
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-primary-600 text-white py-2 px-4 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-colors font-medium disabled:opacity-50"
                >
                    {isSubmitting ? 'Sending...' : 'Send Link'}
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
                    Ashgate Limited&apos;s Terms & Conditions
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

// Partners Grid Component
function PartnersGrid() {
  const [partners, setPartners] = useState<any[]>([]);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/partners`);
        if (response.ok) {
          const data = await response.json();
          setPartners(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
        setPartners([]);
      }
    };
    fetchPartners();
  }, []);

  if (partners.length === 0) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
        <p className="col-span-full text-center text-gray-500 italic">
          Our trusted partners will be displayed here. Partners are managed through the admin panel.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
      {partners.map((partner) => (
        <a
          key={partner.id}
          href={partner.website || '#'}
          target={partner.website ? '_blank' : undefined}
          rel={partner.website ? 'noopener noreferrer' : undefined}
          className="flex items-center justify-center p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          {partner.logo ? (
            <img 
              src={partner.logo} 
              alt={partner.name}
              className="max-h-12 max-w-full object-contain"
            />
          ) : (
            <span className="text-gray-500 text-sm">{partner.name}</span>
          )}
        </a>
      ))}
    </div>
  );
}

// Tabs component scoped in this file for simplicity
function Tabs({ selectedListing }: { selectedListing: any }) {
  const [active, setActive] = useState<'map' | 'floor' | 'tour'>('map');
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const MAPTILER_KEY = process.env.NEXT_PUBLIC_MAPTILER_KEY;
  const GEOAPIFY_KEY = process.env.NEXT_PUBLIC_GEOAPIFY_KEY;
  const [mapToast, setMapToast] = useState<string>('');

  // Load MapLibre JS/CSS on demand
  useEffect(() => {
    if (active !== 'map') return;
    if (!mapRef.current) return;
    // Inject CSS once
    const existingCss = document.getElementById('maplibre-css');
    if (!existingCss) {
      const link = document.createElement('link');
      link.id = 'maplibre-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.css';
      document.head.appendChild(link);
    }
    // Inject JS once
    const ensureJs = async () => {
      if ((window as any).maplibregl) return;
      await new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/maplibre-gl@3.6.1/dist/maplibre-gl.js';
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };
    ensureJs().then(() => {
      const maplibregl = (window as any).maplibregl;
      if (!maplibregl || !MAPTILER_KEY) return;
      if (mapInstanceRef.current) return;
      const center = [selectedListing?.coords?.lng ?? 36.8219, selectedListing?.coords?.lat ?? -1.2921];
      const map = new maplibregl.Map({
        container: mapRef.current!,
        style: `https://api.maptiler.com/maps/streets/style.json?key=${MAPTILER_KEY}`,
        center,
        zoom: 13,
      });
      new maplibregl.Marker().setLngLat(center).addTo(map);
      mapInstanceRef.current = map;
      map.on('error', (e) => {
        // Only show error if it's a critical map loading error, not layer-related
        if (e.error && e.error.message && !e.error.message.includes('source')) {
          setMapToast('Map failed to load. Check your internet or API key.');
        }
      });
      
      // Fetch and display amenities using Geoapify Places API
      map.on('load', async () => {
        try {
          if (!GEOAPIFY_KEY) {
            console.warn('GEOAPIFY_KEY not set. Amenities will not be displayed.');
            return;
          }

          const lat = center[1];
          const lng = center[0];
          const radius = 1000; // 1km radius
          
          // Geoapify Places API categories
          // Using Geoapify category hierarchy: https://www.geoapify.com/places-categories
          const amenityCategories: Record<string, string[]> = {
            'Schools': ['education.school', 'education.university', 'education.college'],
            'Hospitals': ['healthcare.hospital', 'healthcare.clinic', 'healthcare.pharmacy'],
            'Supermarkets': ['commercial.supermarket', 'commercial.marketplace'],
            'Transit': ['public_transport.bus_station', 'public_transport.train_station', 'public_transport.subway_station', 'public_transport.bus_stop'],
          };

          const amenityColors: Record<string, string> = {
            'Schools': '#2563eb',
            'Hospitals': '#dc2626',
            'Supermarkets': '#16a34a',
            'Transit': '#7c3aed',
          };

          // Fetch amenities for each category
          const allAmenities: any[] = [];
          
          for (const [category, categories] of Object.entries(amenityCategories)) {
            try {
              const categoriesParam = categories.join(',');
              const url = `https://api.geoapify.com/v2/places?categories=${categoriesParam}&filter=circle:${lng},${lat},${radius}&limit=50&apiKey=${GEOAPIFY_KEY}`;
              
              const response = await fetch(url);
              if (!response.ok) {
                console.error(`Failed to fetch ${category} amenities:`, response.statusText);
                continue;
              }
              
              const data = await response.json();
              const features = data.features || [];
              
              features.forEach((feature: any) => {
                const coords = feature.geometry?.coordinates;
                if (coords && coords.length === 2) {
                  allAmenities.push({
                    lat: coords[1],
                    lon: coords[0],
                    category,
                    name: feature.properties?.name || feature.properties?.formatted || 'Unnamed',
                  });
                }
              });
            } catch (error) {
              console.error(`Error fetching ${category} amenities:`, error);
            }
          }

          // Create GeoJSON
          const geoJsonData = {
            type: 'FeatureCollection',
            features: allAmenities.map((amenity) => ({
              type: 'Feature',
              geometry: {
                type: 'Point',
                coordinates: [amenity.lon, amenity.lat],
              },
              properties: {
                category: amenity.category,
                name: amenity.name,
              },
            })),
          };

          // Add GeoJSON source
          if (map.getSource('amenities')) {
            (map.getSource('amenities') as any).setData(geoJsonData);
          } else {
            map.addSource('amenities', {
              type: 'geojson',
              data: geoJsonData as any,
            });
          }

          // Add layers for each category
          Object.keys(amenityCategories).forEach((category) => {
            const layerId = `amenities-${category.toLowerCase()}`;
            
            if (map.getLayer(layerId)) {
              map.setLayoutProperty(layerId, 'visibility', 'none');
              return;
            }
            
          map.addLayer({
              id: layerId,
            type: 'circle',
              source: 'amenities',
              filter: ['==', ['get', 'category'], category],
            paint: {
                'circle-radius': 6,
                'circle-color': amenityColors[category] || '#666666',
                'circle-opacity': 0.8,
                'circle-stroke-width': 2,
                'circle-stroke-color': '#ffffff',
              },
            });
            map.setLayoutProperty(layerId, 'visibility', 'none');
          });
        } catch (error) {
          console.error('Error fetching amenities:', error);
        }
      });
    });
    return () => {
      // No teardown to keep simple; modal close unmounts container
    };
  }, [active, MAPTILER_KEY, GEOAPIFY_KEY, selectedListing]);

  const amenityChips = ['Schools', 'Hospitals', 'Supermarkets', 'Transit'];
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const toggleAmenity = (a: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]
    );
  };

  // Toggle amenity layer visibility when chips change
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    
    const amenityChips = ['Schools', 'Hospitals', 'Supermarkets', 'Transit'];
    amenityChips.forEach((category) => {
      const layerId = `amenities-${category.toLowerCase()}`;
      if (map.getLayer(layerId)) {
        const isVisible = selectedAmenities.includes(category);
        map.setLayoutProperty(layerId, 'visibility', isVisible ? 'visible' : 'none');
      }
    });
  }, [selectedAmenities]);

  return (
    <div>
      <div className="flex gap-4 text-sm flex-wrap">
        <button 
          onClick={() => setActive('map')} 
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
            active==='map'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50 ring-2 ring-orange-400 ring-offset-2' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Map & Amenities
        </button>
        <button 
          onClick={() => setActive('floor')} 
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
            active==='floor'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50 ring-2 ring-orange-400 ring-offset-2' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          Floor Plan
        </button>
        <button 
          onClick={() => setActive('tour')} 
          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
            active==='tour'
              ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/50 ring-2 ring-orange-400 ring-offset-2' 
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          3D Tour
        </button>
      </div>
      {mapToast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-black text-white text-sm px-4 py-2 rounded shadow">
          {mapToast}
        </div>
      )}


      {active === 'map' && (
        <div className="mt-4">
          {(!MAPTILER_KEY || !GEOAPIFY_KEY) ? (
            <div className="mb-3 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded p-3">
              {!MAPTILER_KEY && 'Set NEXT_PUBLIC_MAPTILER_KEY in your env to enable the map. '}
              {!GEOAPIFY_KEY && 'Set NEXT_PUBLIC_GEOAPIFY_KEY in your env to display amenities.'}
            </div>
          ) : null}
          <div className="flex gap-2 flex-wrap mb-3">
            {amenityChips.map((a) => (
              <button key={a} onClick={() => toggleAmenity(a)} className={`px-3 py-1 rounded-full text-sm border ${selectedAmenities.includes(a)?'bg-primary-600 text-white border-primary-600':'bg-white text-gray-700 border-gray-300'}`}>{a}</button>
            ))}
          </div>
          <div ref={mapRef} className="w-full h-80 rounded-lg overflow-hidden shadow bg-gray-200" />
        </div>
      )}

      {active === 'floor' && (
        <div className="mt-4 text-gray-700">Floor plan viewer placeholder.</div>
      )}
      {active === 'tour' && (
        <div className="mt-4 text-gray-700">3D tour viewer placeholder.</div>
      )}
    </div>
  );
}