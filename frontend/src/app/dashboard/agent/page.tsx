'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  Upload,
  Image as ImageIcon,
  Video,
  X,
  Building2,
  User,
  FileText,
  Settings,
  Bed,
  Bath,
  CarFront,
  Ruler,
  Plus,
  Wifi,
  WashingMachine,
  Zap,
  ShieldCheck,
  Trash2,
  Dumbbell,
  Waves,
  Sparkles,
  SunMoon
} from 'lucide-react';

interface Property {
  id: string;
  title: string;
  status: 'Available' | 'Taken';
  listingType: 'sale' | 'rent';
  location: string;
  lat: string;
  lng: string;
  propertyType: string;
  price: string;
  description: string;
  beds: { value: string; na: boolean };
  baths: { value: string; na: boolean };
  parking: { value: string; na: boolean };
  area: { value: string; na: boolean };
  photos: string[];
  videos: string[];
  amenities: {
    wifi: boolean;
    washingMachine: boolean;
    backupPower: boolean;
    security: boolean;
    gym: boolean;
    pool: boolean;
    dishwasher: boolean;
  };
}

const createBlankProperty = (id: string): Property => ({
  id,
  title: '',
  status: 'Available',
  listingType: 'sale',
  location: '',
  lat: '',
  lng: '',
  propertyType: 'Apartment',
  price: '',
  description: '',
  beds: { value: '', na: false },
  baths: { value: '', na: false },
  parking: { value: '', na: false },
  area: { value: '', na: false },
  photos: [],
  videos: [],
  amenities: {
    wifi: false,
    washingMachine: false,
    backupPower: false,
    security: false,
    gym: false,
    pool: false,
    dishwasher: false,
  },
});

export default function AgentDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const settingsMenuTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language] = useState('English');
  const [selectedAvatar, setSelectedAvatar] = useState<string | null>(null);
  const [propertyFiles, setPropertyFiles] = useState<Record<string, { photos: File[], videos: File[], floorPlan?: File, tour3D?: File }>>({});
  const [primaryImageIndex, setPrimaryImageIndex] = useState<Record<string, number>>({});
  const [userData, setUserData] = useState<any>(null);
  const [userApplication, setUserApplication] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });

  const formatNumberWithCommas = (value: string) => {
    if (!value) return '';
    const numeric = value.replace(/\D/g, '');
    if (!numeric) return '';
    return new Intl.NumberFormat('en-US').format(Number(numeric));
  };

  const selectedProperty = selectedPropertyId
    ? properties.find((p) => p.id === selectedPropertyId) ?? null
    : null;

  // Fetch user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      const userStr = localStorage.getItem('ashgate_user');
      const token = localStorage.getItem('ashgate_auth_token');
      
      if (!userStr || !token) {
        router.push('/?login=true');
        return;
      }
      
      // Verify token is still valid
      try {
        const verifyResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        
        if (!verifyResponse.ok) {
          // Token invalid, clear and redirect
          localStorage.removeItem('ashgate_auth_token');
          localStorage.removeItem('ashgate_user');
          router.push('/?login=true');
          return;
        }
      } catch (error) {
        console.error('Token verification error:', error);
        router.push('/?login=true');
        return;
      }
      
      const user = JSON.parse(userStr);
      setUserData(user);
      
      // Fetch application details for company name
      try {
        const token = localStorage.getItem('ashgate_auth_token');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/my-application`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (response.ok) {
          const userApp = await response.json();
          setUserApplication(userApp);
        }
      } catch (error) {
        console.error('Error fetching application:', error);
      }
      
      // Fetch user's existing properties
      try {
        const token = localStorage.getItem('ashgate_auth_token');
        const propertiesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/properties`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
        });
        if (propertiesResponse.ok) {
          const propertiesData = await propertiesResponse.json();
          // Transform API properties to match local state format
          const transformedProperties = (propertiesData.data || []).map((p: any) => ({
            id: `listing-${p.id}`,
            title: p.title,
            status: p.status === 'available' ? 'Available' : p.status === 'taken' ? 'Taken' : 'Available',
            listingType: p.listing_type,
            location: p.location_text,
            lat: p.latitude?.toString() || '',
            lng: p.longitude?.toString() || '',
            propertyType: p.property_type,
            price: new Intl.NumberFormat('en-US').format(p.price),
            description: p.description || '',
            beds: { value: (p.beds || 0).toString(), na: !p.beds },
            baths: { value: (p.baths || 0).toString(), na: !p.baths },
            parking: { value: (p.parking_spaces || 0).toString(), na: !p.parking_spaces },
            area: { value: (p.area_sqm || 0).toString(), na: !p.area_sqm },
            photos: p.images && p.images.length > 0 
              ? p.images.map((img: any) => img.url.startsWith('http') ? img.url : `${process.env.NEXT_PUBLIC_API_URL}/storage/${img.url}`)
              : [],
            videos: [],
            amenities: {
              wifi: p.amenities?.some((a: any) => a.name?.toLowerCase().includes('wifi') || a.name?.toLowerCase().includes('wi-fi')) || false,
              washingMachine: p.amenities?.some((a: any) => a.name?.toLowerCase().includes('washing')) || false,
              backupPower: p.amenities?.some((a: any) => a.name?.toLowerCase().includes('backup') || a.name?.toLowerCase().includes('power')) || false,
              security: p.amenities?.some((a: any) => a.name?.toLowerCase().includes('security')) || false,
              gym: p.amenities?.some((a: any) => a.name?.toLowerCase().includes('gym')) || false,
              pool: p.amenities?.some((a: any) => a.name?.toLowerCase().includes('pool')) || false,
              dishwasher: p.amenities?.some((a: any) => a.name?.toLowerCase().includes('dishwasher')) || false,
            }
          }));
          if (transformedProperties.length > 0) {
            setProperties(transformedProperties);
            setSelectedPropertyId(transformedProperties[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching properties:', error);
      }
    };
    
    fetchUserData();
  }, [router]);

  const handlePhotoUpload = (propertyId: string, files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    
    // Store actual File objects
    setPropertyFiles(prev => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        photos: [...(prev[propertyId]?.photos || []), ...fileArray]
      }
    }));
    
    // Also update preview URLs for UI
    setIsUploading(true);
    setTimeout(() => {
      const newPhotos = fileArray.map((file) => URL.createObjectURL(file));
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, photos: [...p.photos, ...newPhotos] } : p))
      );
      setIsUploading(false);
    }, 1000);
  };

  const handleVideoUpload = (propertyId: string, files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    
    // Store actual File objects
    setPropertyFiles(prev => ({
      ...prev,
      [propertyId]: {
        ...prev[propertyId],
        videos: [...(prev[propertyId]?.videos || []), ...fileArray]
      }
    }));
    
    // Also update preview URLs for UI
    setIsUploading(true);
    setTimeout(() => {
      const newVideos = fileArray.map((file) => URL.createObjectURL(file));
      setProperties((prev) =>
        prev.map((p) => (p.id === propertyId ? { ...p, videos: [...p.videos, ...newVideos] } : p))
      );
      setIsUploading(false);
    }, 1000);
  };

  const removePhoto = (propertyId: string, index: number) => {
    const currentPrimary = primaryImageIndex[propertyId] ?? 0;
    
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, photos: p.photos.filter((_, i) => i !== index) } : p
      )
    );
    
    // Update primary image index if needed
    if (currentPrimary === index) {
      // If we removed the primary image, set first image as primary
      setPrimaryImageIndex(prev => ({ ...prev, [propertyId]: 0 }));
    } else if (currentPrimary > index) {
      // If we removed an image before the primary, adjust the index
      setPrimaryImageIndex(prev => ({ ...prev, [propertyId]: currentPrimary - 1 }));
    }
    
    // Also remove from propertyFiles
    setPropertyFiles(prev => {
      const files = prev[propertyId];
      if (files?.photos) {
        return {
          ...prev,
          [propertyId]: {
            ...files,
            photos: files.photos.filter((_, i) => i !== index)
          }
        };
      }
      return prev;
    });
  };

  const removeVideo = (propertyId: string, index: number) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, videos: p.videos.filter((_, i) => i !== index) } : p
      )
    );
  };

  const addNewProperty = () => {
    const newId = `listing-${Date.now()}`;
    const newProperty = createBlankProperty(newId);
    setProperties((prev) => [...prev, newProperty]);
    setSelectedPropertyId(newId);
    setPrimaryImageIndex(prev => ({ ...prev, [newId]: 0 }));
  };

  const deleteProperty = (propertyId: string) => {
    setProperties((prev) => {
      const updated = prev.filter((p) => p.id !== propertyId);
      if (updated.length === 0) {
        setSelectedPropertyId(null);
        return [];
      }
      if (selectedPropertyId === propertyId) {
        setSelectedPropertyId(updated[0].id);
      }
      return updated;
    });
  };

  const updateProperty = (propertyId: string, field: keyof Property, value: any) => {
    setProperties((prev) =>
      prev.map((p) => (p.id === propertyId ? { ...p, [field]: value } : p))
    );
  };

  const updatePropertySpec = (
    propertyId: string,
    spec: 'beds' | 'baths' | 'parking' | 'area',
    field: 'value' | 'na',
    val: string | boolean
  ) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId ? { ...p, [spec]: { ...p[spec], [field]: val } } : p
      )
    );
  };

  const toggleAmenity = (propertyId: string, amenity: keyof Property['amenities']) => {
    setProperties((prev) =>
      prev.map((p) =>
        p.id === propertyId
          ? { ...p, amenities: { ...p.amenities, [amenity]: !p.amenities[amenity] } }
          : p
      )
    );
  };

  const handleSaveProperty = async (propertyId: string) => {
    const property = properties.find(p => p.id === propertyId);
    if (!property) return;

    // Validation
    if (!property.title || !property.location || !property.price) {
      alert('Please fill in all required fields: Title, Location, and Price');
      return;
    }

    const userStr = localStorage.getItem('ashgate_user');
    if (!userStr) {
      alert('Please log in to save listings');
      router.push('/?login=true');
      return;
    }

    setIsSaving(true);
    try {
      // Map amenities to IDs (this mapping should match your database)
      const amenityNameToId: Record<string, number> = {
        wifi: 1, // Wi-Fi
        washingMachine: 2, // Washing Machine
        backupPower: 3, // Backup Power
        security: 4, // 24/7 Security
        gym: 5, // Gym
        pool: 6, // Pool
        dishwasher: 7, // Dishwasher
      };

      const selectedAmenities = Object.entries(property.amenities)
        .filter(([_, selected]) => selected)
        .map(([key]) => amenityNameToId[key])
        .filter(Boolean);

      const formData = new FormData();
      formData.append('title', property.title);
      formData.append('description', property.description || '');
      formData.append('listing_type', property.listingType);
      formData.append('property_type', property.propertyType);
      formData.append('price', property.price.replace(/,/g, ''));
      formData.append('location_text', property.location);
      if (property.lat) formData.append('latitude', property.lat);
      if (property.lng) formData.append('longitude', property.lng);
      formData.append('beds', property.beds.na ? '0' : (property.beds.value || '0'));
      formData.append('baths', property.baths.na ? '0' : (property.baths.value || '0'));
      formData.append('parking_spaces', property.parking.na ? '0' : (property.parking.value || '0'));
      formData.append('area_sqm', property.area.na ? '0' : (property.area.value || '0'));
      formData.append('status', property.status.toLowerCase());
      formData.append('is_active', '1');

      // Add amenities
      selectedAmenities.forEach(id => formData.append('amenities[]', id.toString()));

      // Add photos
      const files = propertyFiles[propertyId];
      if (files?.photos) {
        files.photos.forEach(photo => formData.append('photos[]', photo));
        // Add primary image index
        const primaryIdx = primaryImageIndex[propertyId] ?? 0;
        formData.append('primary_image_index', primaryIdx.toString());
      }

      // Add floor plan and 3D tour if property type supports it
      if (['House', 'Apartment', 'Commercial'].includes(property.propertyType)) {
        if (files?.floorPlan) {
          formData.append('floor_plan', files.floorPlan);
          formData.append('has_floor_plan', '1');
        }
        if (files?.tour3D) {
          formData.append('3d_tour', files.tour3D);
          formData.append('has_3d_tour', '1');
        }
      }

      const token = localStorage.getItem('ashgate_auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/properties`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        alert('Listing saved successfully! It will appear on the listings page shortly.');
        
        // Refresh properties list from API
        try {
          const token = localStorage.getItem('ashgate_auth_token');
          const propertiesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/properties`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Accept': 'application/json',
            },
          });
          if (propertiesResponse.ok) {
            const propertiesData = await propertiesResponse.json();
            const transformedProperties = (propertiesData.data || []).map((p: any) => ({
              id: `listing-${p.id}`,
              title: p.title,
              status: p.status === 'available' ? 'Available' : p.status === 'taken' ? 'Taken' : 'Available',
              listingType: p.listing_type,
              location: p.location_text,
              lat: p.latitude?.toString() || '',
              lng: p.longitude?.toString() || '',
              propertyType: p.property_type,
              price: new Intl.NumberFormat('en-US').format(p.price),
              description: p.description || '',
              beds: { value: (p.beds || 0).toString(), na: !p.beds },
              baths: { value: (p.baths || 0).toString(), na: !p.baths },
              parking: { value: (p.parking_spaces || 0).toString(), na: !p.parking_spaces },
              area: { value: (p.area_sqm || 0).toString(), na: !p.area_sqm },
              photos: p.images && p.images.length > 0 
                ? p.images.map((img: any) => img.url.startsWith('http') ? img.url : `${process.env.NEXT_PUBLIC_API_URL}/storage/${img.url}`)
                : [],
              videos: [],
              amenities: {
                wifi: p.amenities?.some((a: any) => a.name?.toLowerCase().includes('wifi') || a.name?.toLowerCase().includes('wi-fi')) || false,
                washingMachine: p.amenities?.some((a: any) => a.name?.toLowerCase().includes('washing')) || false,
                backupPower: p.amenities?.some((a: any) => a.name?.toLowerCase().includes('backup') || a.name?.toLowerCase().includes('power')) || false,
                security: p.amenities?.some((a: any) => a.name?.toLowerCase().includes('security')) || false,
                gym: p.amenities?.some((a: any) => a.name?.toLowerCase().includes('gym')) || false,
                pool: p.amenities?.some((a: any) => a.name?.toLowerCase().includes('pool')) || false,
                dishwasher: p.amenities?.some((a: any) => a.name?.toLowerCase().includes('dishwasher')) || false,
              }
            }));
            setProperties(transformedProperties);
            // Select the newly saved property
            const savedProperty = transformedProperties.find((p: any) => p.id === `listing-${data.data?.id}`);
            if (savedProperty) {
              setSelectedPropertyId(savedProperty.id);
            } else {
              setSelectedPropertyId(null);
            }
          }
        } catch (error) {
          console.error('Error refreshing properties:', error);
        }
      } else {
        alert('Failed to save listing: ' + (data.message || 'Unknown error'));
      }
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving listing. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters long');
      return;
    }

    try {
      const token = localStorage.getItem('ashgate_auth_token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          current_password: passwordData.currentPassword,
          new_password: passwordData.newPassword,
          new_password_confirmation: passwordData.confirmPassword,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert('Password updated successfully!');
        setShowPasswordModal(false);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        if (data.account_locked) {
          alert(data.message);
          // Optionally log out user
          localStorage.removeItem('ashgate_auth_token');
          localStorage.removeItem('ashgate_user');
          router.push('/?login=true');
        } else {
          alert(data.message || 'Failed to update password');
        }
      }
    } catch (error) {
      console.error('Password change error:', error);
      alert('Error changing password. Please try again.');
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <ArrowLeft className="w-5 h-5" /> Home
              </button>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Agent Dashboard</h1>
            </div>
            <div className="flex items-center gap-4 relative">
              <div
                className="relative"
                onMouseEnter={() => {
                  if (settingsMenuTimeoutRef.current) {
                    clearTimeout(settingsMenuTimeoutRef.current);
                    settingsMenuTimeoutRef.current = null;
                  }
                  setShowSettingsMenu(true);
                }}
                onMouseLeave={() => {
                  settingsMenuTimeoutRef.current = setTimeout(() => {
                    setShowSettingsMenu(false);
                  }, 300);
                }}
              >
                <button 
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className="p-2 text-gray-600 hover:text-gray-900 hover:scale-105 transition-all rounded-lg hover:shadow-lg hover:shadow-primary-500/20"
                >
                  <Settings className="w-5 h-5" />
                </button>
                {showSettingsMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                    onMouseEnter={() => {
                      if (settingsMenuTimeoutRef.current) {
                        clearTimeout(settingsMenuTimeoutRef.current);
                        settingsMenuTimeoutRef.current = null;
                      }
                      setShowSettingsMenu(true);
                    }}
                    onMouseLeave={() => {
                      settingsMenuTimeoutRef.current = setTimeout(() => {
                        setShowSettingsMenu(false);
                      }, 300);
                    }}
                  >
                    <div className="px-4 py-2 text-xs text-gray-500 border-b">Quick settings</div>
                    <button className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 text-gray-900">
                      <span className="text-gray-900">Language</span>
                      <span className="text-gray-500">{language}</span>
                    </button>
                    <button
                      className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 text-gray-900"
                      onClick={() => setDarkMode((d) => !d)}
                    >
                      <span className="text-gray-900">Night / Dark mode</span>
                      <SunMoon className="w-4 h-4 text-gray-500" />
                    </button>
                    <button 
                      onClick={() => {
                        setShowSettingsMenu(false);
                        setShowPasswordModal(true);
                      }}
                      className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 text-gray-900"
                    >
                      <span className="text-gray-900">Change Password</span>
                    </button>
                  </div>
                )}
              </div>
              <div
                className="relative"
                onMouseEnter={() => {
                  if (userMenuTimeoutRef.current) {
                    clearTimeout(userMenuTimeoutRef.current);
                    userMenuTimeoutRef.current = null;
                  }
                  setShowUserMenu(true);
                }}
                onMouseLeave={() => {
                  userMenuTimeoutRef.current = setTimeout(() => {
                    setShowUserMenu(false);
                  }, 300);
                }}
              >
                <button 
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="p-1.5 text-gray-600 hover:text-gray-900 hover:scale-105 transition-all rounded-lg hover:shadow-lg hover:shadow-primary-500/20"
                >
                  {selectedAvatar ? (
                    <div className="w-6 h-6 rounded-full overflow-hidden border border-gray-200">
                      <img src={selectedAvatar} alt="User" className="w-full h-full object-cover" />
                    </div>
                  ) : (
                    <User className="w-5 h-5" />
                  )}
                </button>
                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                    onMouseEnter={() => {
                      if (userMenuTimeoutRef.current) {
                        clearTimeout(userMenuTimeoutRef.current);
                        userMenuTimeoutRef.current = null;
                      }
                      setShowUserMenu(true);
                    }}
                    onMouseLeave={() => {
                      userMenuTimeoutRef.current = setTimeout(() => {
                        setShowUserMenu(false);
                      }, 300);
                    }}
                  >
                    <div className="px-4 py-2 text-sm text-gray-800 border-b font-semibold">Agent Profile</div>
                    <button 
                      onClick={() => {
                        setShowUserMenu(false);
                        setShowProfileModal(true);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      View Profile
                    </button>
                    <button 
                      onClick={() => {
                        // Clear any local auth state
                        if (typeof window !== 'undefined') {
                          localStorage.removeItem('ashgate_auth_token');
                          localStorage.removeItem('ashgate_user');
                          sessionStorage.clear();
                        }
                        router.push('/');
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6 mb-6`}>
          <div className="flex items-center gap-3 mb-2">
            <Building2 className={`w-6 h-6 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Manage Your Listings</h2>
          </div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Upload marketing assets, update listing details, and track availability for every property you represent.
          </p>
        </div>

        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6 mb-6`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Listing Portfolio</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Keep every property up to date to ensure buyers get accurate information instantly.</p>
            </div>
            <button
              onClick={addNewProperty}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Listing
            </button>
          </div>

          {properties.length === 0 ? (
            <div className={`border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg p-8 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p className={`text-base font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Empty Listing Portfolio</p>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : ''}`}>Start by adding a property. You can manage all assets and details once the listing is created.</p>
              <button
                onClick={addNewProperty}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Listing
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {properties.map((property) => {
                const isSelected = selectedPropertyId === property.id;
                return (
                  <div
                    key={property.id}
                    className={`border-2 rounded-lg transition-all ${
                      isSelected 
                        ? darkMode 
                          ? 'border-primary-500 bg-primary-900/30 shadow-sm' 
                          : 'border-primary-600 bg-primary-50/60 shadow-sm'
                        : darkMode
                          ? 'border-gray-700 bg-gray-800 hover:border-gray-600'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-4 cursor-pointer"
                      onClick={() => setSelectedPropertyId(property.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                            {property.title || 'Listing title not set'}
                          </h4>
                          <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ID: {property.id.replace('listing-', '#')}</span>
                        </div>
                        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                          <span
                            className={`px-3 py-1 rounded-full font-medium ${
                              property.status === 'Available'
                                ? darkMode
                                  ? 'bg-green-900/50 text-green-300'
                                  : 'bg-green-100 text-green-800'
                                : darkMode
                                  ? 'bg-gray-700 text-gray-300'
                                  : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {property.status}
                          </span>
                          <span className={`capitalize font-semibold ${darkMode ? 'text-primary-400' : 'text-primary-700'}`}>{property.listingType}</span>
                          {property.location && <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{property.location}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={property.status}
                          onChange={(e) => updateProperty(property.id, 'status', e.target.value)}
                          className={`px-3 py-1 border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                            darkMode 
                              ? 'border-gray-600 bg-gray-700 text-white' 
                              : 'border-gray-300 bg-white text-gray-900'
                          }`}
                        >
                          <option value="Available">Available</option>
                          <option value="Taken">Taken</option>
                        </select>
                        <button
                          onClick={() => deleteProperty(property.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            darkMode
                              ? 'text-red-400 hover:text-red-300 hover:bg-red-900/30'
                              : 'text-red-500 hover:text-red-600 hover:bg-red-50'
                          }`}
                          title="Delete listing"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {isSelected && (
                      <div className="p-5 pt-0 space-y-6">
                        {/* Photos */}
                        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-5`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <ImageIcon className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                              <h5 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Listing Photos</h5>
                            </div>
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer">
                              <Upload className="w-4 h-4" />
                              Select Photos
                              <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={(e) => handlePhotoUpload(property.id, e.target.files)}
                                className="hidden"
                                disabled={isUploading}
                              />
                            </label>
                          </div>

                          {isUploading && (
                            <div className="text-center py-8">
                              <div className={`inline-block animate-spin rounded-full h-8 w-8 border-b-2 ${darkMode ? 'border-primary-400' : 'border-primary-600'}`}></div>
                              <p className={`mt-2 text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Uploading...</p>
                            </div>
                          )}

                          {property.photos.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                              {property.photos.map((photo, index) => {
                                const isPrimary = (primaryImageIndex[property.id] ?? 0) === index;
                                return (
                                  <div key={index} className="relative group">
                                    <img
                                      src={photo}
                                      alt={`Listing photo ${index + 1}`}
                                      className={`w-full h-48 object-cover rounded-lg ${isPrimary ? 'ring-4 ring-primary-500' : ''}`}
                                    />
                                    {isPrimary && (
                                      <div className="absolute top-2 left-2 px-2 py-1 bg-primary-600 text-white text-xs font-semibold rounded">
                                        Primary
                                      </div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                      <button
                                        onClick={() => setPrimaryImageIndex(prev => ({ ...prev, [property.id]: index }))}
                                        className={`p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity ${
                                          isPrimary 
                                            ? 'bg-primary-600 text-white opacity-100' 
                                            : 'bg-white text-gray-700 hover:bg-primary-50'
                                        }`}
                                        title="Set as primary image"
                                      >
                                        <ImageIcon className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => removePhoto(property.id, index)}
                                        className="p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <X className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          ) : (
                            <div className={`border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg p-12 text-center`}>
                              <ImageIcon className={`w-12 h-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'} mx-auto mb-4`} />
                              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>No photos selected yet</p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Select professional imagery to elevate your listing presentation.</p>
                            </div>
                          )}
                        </div>

                        {/* Videos */}
                        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-5`}>
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <Video className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                              <h5 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Listing Videos</h5>
                            </div>
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer">
                              <Upload className="w-4 h-4" />
                              Select Videos
                              <input
                                type="file"
                                accept="video/*"
                                multiple
                                onChange={(e) => handleVideoUpload(property.id, e.target.files)}
                                className="hidden"
                                disabled={isUploading}
                              />
                            </label>
                          </div>

                          {property.videos.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {property.videos.map((video, index) => (
                                <div key={index} className="relative group">
                                  <video
                                    src={video}
                                    controls
                                    className="w-full h-64 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={() => removeVideo(property.id, index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  >
                                    <X className="w-4 h-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className={`border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg p-12 text-center`}>
                              <Video className={`w-12 h-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'} mx-auto mb-4`} />
                              <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>No videos selected yet</p>
                              <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Optional but powerful—upload walkthroughs or drone footage.</p>
                            </div>
                          )}
                        </div>

                        {/* Listing Information */}
                        <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-5`}>
                          <div className="flex items-center gap-2 mb-4">
                            <FileText className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                            <h5 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Listing Information</h5>
                          </div>

                          <div className="space-y-4">
                            <div>
                              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Listing Title</label>
                              <input
                                type="text"
                                value={property.title}
                                onChange={(e) => updateProperty(property.id, 'title', e.target.value)}
                                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                  darkMode 
                                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                    : 'border-gray-300 bg-white text-gray-900'
                                }`}
                                placeholder="e.g., Prime Office Tower, Upper Hill"
                              />
                            </div>

                            <div>
                              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Location</label>
                              <input
                                type="text"
                                value={property.location}
                                onChange={(e) => updateProperty(property.id, 'location', e.target.value)}
                                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                  darkMode 
                                    ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                    : 'border-gray-300 bg-white text-gray-900'
                                }`}
                                placeholder="Westlands, Nairobi, Kenya"
                              />
                              <p className={`text-xs mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Format: Area, City, Country</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>GPS Latitude</label>
                                <input
                                  type="text"
                                  value={property.lat}
                                  onChange={(e) => updateProperty(property.id, 'lat', e.target.value)}
                                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                    darkMode 
                                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                      : 'border-gray-300 bg-white text-gray-900'
                                  }`}
                                  placeholder="-1.2921"
                                />
                              </div>
                              <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>GPS Longitude</label>
                                <input
                                  type="text"
                                  value={property.lng}
                                  onChange={(e) => updateProperty(property.id, 'lng', e.target.value)}
                                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                    darkMode 
                                      ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                      : 'border-gray-300 bg-white text-gray-900'
                                  }`}
                                  placeholder="36.8219"
                                />
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Listing Type</label>
                                <select
                                  value={property.listingType}
                                  onChange={(e) => updateProperty(property.id, 'listingType', e.target.value as 'sale' | 'rent')}
                                  className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                    darkMode 
                                      ? 'border-gray-600 bg-gray-700 text-white' 
                                      : 'border-gray-300 bg-white text-gray-900'
                                  }`}
                                >
                                  <option value="sale">Sale</option>
                                  <option value="rent">Rent</option>
                                </select>
                              </div>
                              <div>
                                <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>
                                  Price (KSh) {property.listingType === 'rent' && <span className={darkMode ? 'text-gray-400' : 'text-gray-500'}>/mo</span>}
                                </label>
                                <div className="relative">
                                  <input
                                    type="text"
                                    value={formatNumberWithCommas(property.price)}
                                    onChange={(e) => {
                                      const raw = e.target.value.replace(/\D/g, '');
                                      updateProperty(property.id, 'price', raw);
                                    }}
                                    inputMode="numeric"
                                    className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                      darkMode 
                                        ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                        : 'border-gray-300 bg-white text-gray-900'
                                    }`}
                                    placeholder="18,500,000"
                                  />
                                  {property.listingType === 'rent' && (
                                    <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>/mo</span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Property Type</label>
                              <select
                                value={property.propertyType}
                                onChange={(e) => updateProperty(property.id, 'propertyType', e.target.value)}
                                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                  darkMode 
                                    ? 'border-gray-600 bg-gray-700 text-white' 
                                    : 'border-gray-300 bg-white text-gray-900'
                                }`}
                              >
                                <option>Apartment</option>
                                <option>House</option>
                                <option>Land</option>
                                <option>Commercial</option>
                                <option>Industrial</option>
                              </select>
                            </div>

                            {/* Specifications */}
                            <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-4`}>
                              <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-3`}>Listing Specifications</label>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="flex items-center gap-3">
                                  <Bed className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'} flex-shrink-0`} />
                                  <div className="flex-1">
                                    <input
                                      type="number"
                                      value={property.beds.value}
                                      onChange={(e) => updatePropertySpec(property.id, 'beds', 'value', e.target.value)}
                                      disabled={property.beds.na}
                                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                        darkMode 
                                          ? property.beds.na
                                            ? 'border-gray-600 bg-gray-800 text-gray-500'
                                            : 'border-gray-600 bg-gray-700 text-white'
                                          : property.beds.na
                                            ? 'border-gray-300 bg-gray-100 text-gray-400'
                                            : 'border-gray-300 bg-white text-gray-900'
                                      }`}
                                      placeholder="Beds"
                                    />
                                  </div>
                                  <label className={`flex items-center gap-2 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <input
                                      type="checkbox"
                                      checked={property.beds.na}
                                      onChange={(e) => updatePropertySpec(property.id, 'beds', 'na', e.target.checked)}
                                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    N/A
                                  </label>
                                </div>

                                <div className="flex items-center gap-3">
                                  <Bath className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'} flex-shrink-0`} />
                                  <div className="flex-1">
                                    <input
                                      type="number"
                                      value={property.baths.value}
                                      onChange={(e) => updatePropertySpec(property.id, 'baths', 'value', e.target.value)}
                                      disabled={property.baths.na}
                                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                        darkMode 
                                          ? property.baths.na
                                            ? 'border-gray-600 bg-gray-800 text-gray-500'
                                            : 'border-gray-600 bg-gray-700 text-white'
                                          : property.baths.na
                                            ? 'border-gray-300 bg-gray-100 text-gray-400'
                                            : 'border-gray-300 bg-white text-gray-900'
                                      }`}
                                      placeholder="Baths"
                                    />
                                  </div>
                                  <label className={`flex items-center gap-2 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <input
                                      type="checkbox"
                                      checked={property.baths.na}
                                      onChange={(e) => updatePropertySpec(property.id, 'baths', 'na', e.target.checked)}
                                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    N/A
                                  </label>
                                </div>

                                <div className="flex items-center gap-3">
                                  <CarFront className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'} flex-shrink-0`} />
                                  <div className="flex-1">
                                    <input
                                      type="number"
                                      value={property.parking.value}
                                      onChange={(e) => updatePropertySpec(property.id, 'parking', 'value', e.target.value)}
                                      disabled={property.parking.na}
                                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                        darkMode 
                                          ? property.parking.na
                                            ? 'border-gray-600 bg-gray-800 text-gray-500'
                                            : 'border-gray-600 bg-gray-700 text-white'
                                          : property.parking.na
                                            ? 'border-gray-300 bg-gray-100 text-gray-400'
                                            : 'border-gray-300 bg-white text-gray-900'
                                      }`}
                                      placeholder="Parking"
                                    />
                                  </div>
                                  <label className={`flex items-center gap-2 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <input
                                      type="checkbox"
                                      checked={property.parking.na}
                                      onChange={(e) => updatePropertySpec(property.id, 'parking', 'na', e.target.checked)}
                                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    N/A
                                  </label>
                                </div>

                                <div className="flex items-center gap-3">
                                  <Ruler className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'} flex-shrink-0`} />
                                  <div className="flex-1">
                                    <input
                                      type="number"
                                      value={property.area.value}
                                      onChange={(e) => updatePropertySpec(property.id, 'area', 'value', e.target.value)}
                                      disabled={property.area.na}
                                      className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                        darkMode 
                                          ? property.area.na
                                            ? 'border-gray-600 bg-gray-800 text-gray-500'
                                            : 'border-gray-600 bg-gray-700 text-white'
                                          : property.area.na
                                            ? 'border-gray-300 bg-gray-100 text-gray-400'
                                            : 'border-gray-300 bg-white text-gray-900'
                                      }`}
                                      placeholder="Area in m²"
                                    />
                                  </div>
                                  <label className={`flex items-center gap-2 text-sm whitespace-nowrap ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                    <input
                                      type="checkbox"
                                      checked={property.area.na}
                                      onChange={(e) => updatePropertySpec(property.id, 'area', 'na', e.target.checked)}
                                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                    />
                                    N/A
                                  </label>
                                </div>
                              </div>
                              <p className="text-xs text-gray-500 mt-2">Specs marked N/A stay hidden on listing cards and detailed pages.</p>
                            </div>

                            {/* Amenities */}
                            <div className="border-t border-gray-200 pt-4">
                              <label className="block text-sm font-medium text-gray-700 mb-3">Amenities (displayed on listing details)</label>
                              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                                <label className={`flex items-center gap-3 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${property.amenities.wifi ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                                  <input
                                    type="checkbox"
                                    checked={property.amenities.wifi}
                                    onChange={() => toggleAmenity(property.id, 'wifi')}
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                  />
                                  <span className="flex items-center gap-2">
                                    <Wifi className="w-4 h-4" />
                                    Wi‑Fi
                                  </span>
                                </label>
                                <label className={`flex items-center gap-3 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${property.amenities.washingMachine ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                                  <input
                                    type="checkbox"
                                    checked={property.amenities.washingMachine}
                                    onChange={() => toggleAmenity(property.id, 'washingMachine')}
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                  />
                                  <span className="flex items-center gap-2">
                                    <WashingMachine className="w-4 h-4" />
                                    Washing Machine
                                  </span>
                                </label>
                                <label className={`flex items-center gap-3 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${property.amenities.backupPower ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                                  <input
                                    type="checkbox"
                                    checked={property.amenities.backupPower}
                                    onChange={() => toggleAmenity(property.id, 'backupPower')}
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                  />
                                  <span className="flex items-center gap-2">
                                    <Zap className="w-4 h-4" />
                                    Backup Power
                                  </span>
                                </label>
                                <label className={`flex items-center gap-3 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${property.amenities.security ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600 hover-border-gray-400'}`}>
                                  <input
                                    type="checkbox"
                                    checked={property.amenities.security}
                                    onChange={() => toggleAmenity(property.id, 'security')}
                                    className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                  />
                                  <span className="flex items-center gap-2">
                                    <ShieldCheck className="w-4 h-4" />
                                    24/7 Security
                                  </span>
                                </label>
                            <label className={`flex items-center gap-3 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${property.amenities.gym ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                              <input
                                type="checkbox"
                                checked={property.amenities.gym}
                                onChange={() => toggleAmenity(property.id, 'gym')}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="flex items-center gap-2">
                                <Dumbbell className="w-4 h-4" />
                                Gym
                              </span>
                            </label>
                            <label className={`flex items-center gap-3 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${property.amenities.pool ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                              <input
                                type="checkbox"
                                checked={property.amenities.pool}
                                onChange={() => toggleAmenity(property.id, 'pool')}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="flex items-center gap-2">
                                <Waves className="w-4 h-4" />
                                Pool
                              </span>
                            </label>
                            <label className={`flex items-center gap-3 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${property.amenities.dishwasher ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
                              <input
                                type="checkbox"
                                checked={property.amenities.dishwasher}
                                onChange={() => toggleAmenity(property.id, 'dishwasher')}
                                className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                              />
                              <span className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4" />
                                Dishwasher
                              </span>
                            </label>
                              </div>
                            </div>

                            {/* Floor Plan & 3D Tour (only for House/Apartment/Commercial) */}
                            {['House', 'Apartment', 'Commercial'].includes(property.propertyType) && (
                              <div className="space-y-4 border-t border-gray-200 pt-4">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Floor Plan (Optional)
                                  </label>
                                  <input
                                    type="file"
                                    accept=".pdf,.jpg,.jpeg,.png"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setPropertyFiles(prev => ({
                                          ...prev,
                                          [property.id]: { ...prev[property.id], floorPlan: file }
                                        }));
                                      }
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">Accepted: PDF, JPG, PNG (Max 10MB)</p>
                                </div>
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">
                                    3D Tour (Optional)
                                  </label>
                                  <input
                                    type="file"
                                    accept=".mp4,.mov,.avi,.glb,.gltf"
                                    onChange={(e) => {
                                      const file = e.target.files?.[0];
                                      if (file) {
                                        setPropertyFiles(prev => ({
                                          ...prev,
                                          [property.id]: { ...prev[property.id], tour3D: file }
                                        }));
                                      }
                                    }}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
                                  />
                                  <p className="text-xs text-gray-500 mt-1">
                                    Accepted: MP4, MOV, AVI, GLB, GLTF (Max 100MB)
                                  </p>
                                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                    <p className="text-xs text-blue-800">
                                      <strong>Don't have a 3D tour?</strong> We can help create one for your listing at your cost. 
                                      Contact us at <a href="mailto:info@ashgate.co.ke" className="underline font-semibold">info@ashgate.co.ke</a>
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                              <textarea
                                rows={4}
                                value={property.description}
                                onChange={(e) => updateProperty(property.id, 'description', e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900"
                                style={{ color: '#111827' }}
                                placeholder="Summarise key selling points, finishes, and neighbourhood highlights."
                              />
                            </div>

                            <button 
                              onClick={() => handleSaveProperty(property.id)}
                              disabled={isSaving}
                              className="w-full md:w-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isSaving ? 'Saving...' : 'Save Listing Information'}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`w-full max-w-md p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Change Password</h3>
              <button onClick={() => setShowPasswordModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form className="space-y-4" onSubmit={handlePasswordChange}>
              <div>
                <label className="block text-sm font-medium mb-1">Current Password</label>
                <input 
                  type="password" 
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  placeholder="Enter current password"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">New Password</label>
                <input 
                  type="password" 
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  placeholder="Enter new password (min 8 characters)"
                  minLength={8}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 outline-none ${darkMode ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'}`}
                  placeholder="Confirm new password"
                  minLength={8}
                  required
                />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700"
                >
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className={`w-full max-w-lg p-6 rounded-lg shadow-xl ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-900'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Agent Profile</h3>
              <button onClick={() => setShowProfileModal(false)} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              {userData && (
                <>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden border-2 border-primary-500">
                      <User className="w-10 h-10 text-gray-500" />
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-white">{userData.name}</h4>
                      <p className="text-sm text-gray-500">{userData.email}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Full Name</label>
                      <div className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}>
                        {userData.name}
                      </div>
                    </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone</label>
                  <div className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}>
                    {userData.phone || 'N/A'}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email Address</label>
                  <div className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}>
                    {userData.email}
                  </div>
                </div>
                {userApplication && userApplication.type === 'agent' && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Company / Agency</label>
                    <div className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}>
                      {userApplication.details?.agency || userApplication.details?.professionalBoard || 'N/A'}
                    </div>
                  </div>
                )}
                {userApplication && userApplication.details?.bio && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Bio</label>
                    <div className={`w-full px-3 py-2 border rounded-lg ${darkMode ? 'bg-gray-700 border-gray-600 text-white' : 'bg-gray-50 border-gray-300 text-gray-900'}`}>
                      {userApplication.details.bio}
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button 
                  type="button"
                  onClick={() => setShowProfileModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
