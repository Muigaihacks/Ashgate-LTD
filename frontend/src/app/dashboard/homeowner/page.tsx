'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowLeft, 
  Upload, 
  Image as ImageIcon, 
  Video, 
  X, 
  Home,
  User,
  FileText,
  Settings,
  Bed,
  Bath,
  CarFront,
  Ruler,
  Plus,
  Trash2,
  Wifi,
  WashingMachine,
  Zap,
  ShieldCheck,
  Dumbbell,
  Waves,
  Sparkles,
  SunMoon
} from 'lucide-react';

interface Property {
  id: string;
  address: string;
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
  address: '',
  status: 'Available',
  listingType: 'sale',
  location: '',
  lat: '',
  lng: '',
  propertyType: 'House',
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
  }
});

export default function HomeownerDashboard() {
  const router = useRouter();
  const [properties, setProperties] = useState<Property[]>([createBlankProperty('property-1')]);
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>('property-1');
  const [isUploading, setIsUploading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language] = useState('English');

  const formatNumberWithCommas = (value: string) => {
    if (!value) return '';
    const numeric = value.replace(/\D/g, '');
    if (!numeric) return '';
    return new Intl.NumberFormat('en-US').format(Number(numeric));
  };

  const selectedProperty = selectedPropertyId
    ? properties.find((p) => p.id === selectedPropertyId) ?? null
    : null;

  const handlePhotoUpload = (propertyId: string, files: FileList | null) => {
    if (!files) return;

    setIsUploading(true);
    setTimeout(() => {
      const newPhotos = Array.from(files).map(file => URL.createObjectURL(file));
      setProperties(prev => prev.map(p => 
        p.id === propertyId 
          ? { ...p, photos: [...p.photos, ...newPhotos] }
          : p
      ));
      setIsUploading(false);
    }, 1000);
  };

  const handleVideoUpload = (propertyId: string, files: FileList | null) => {
    if (!files) return;

    setIsUploading(true);
    setTimeout(() => {
      const newVideos = Array.from(files).map(file => URL.createObjectURL(file));
      setProperties(prev => prev.map(p => 
        p.id === propertyId 
          ? { ...p, videos: [...p.videos, ...newVideos] }
          : p
      ));
      setIsUploading(false);
    }, 1000);
  };

  const removePhoto = (propertyId: string, index: number) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId 
        ? { ...p, photos: p.photos.filter((_, i) => i !== index) }
        : p
    ));
  };

  const removeVideo = (propertyId: string, index: number) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId 
        ? { ...p, videos: p.videos.filter((_, i) => i !== index) }
        : p
    ));
  };

  const addNewProperty = () => {
    const newId = `property-${Date.now()}`;
    const newProperty = createBlankProperty(newId);
    setProperties(prev => [...prev, newProperty]);
    setSelectedPropertyId(newId);
  };

  const deleteProperty = (propertyId: string) => {
    setProperties(prev => {
      const updated = prev.filter(p => p.id !== propertyId);
      if (updated.length === 0) {
        setSelectedPropertyId(null);
        return [];
      }
      const nextSelected = propertyId === selectedPropertyId ? updated[0].id : selectedPropertyId;
      setSelectedPropertyId(nextSelected ?? updated[0].id);
      return updated;
    });
  };

  const updateProperty = (propertyId: string, field: keyof Property, value: any) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId 
        ? { ...p, [field]: value }
        : p
    ));
  };

  const updatePropertySpec = (propertyId: string, spec: 'beds' | 'baths' | 'parking' | 'area', field: 'value' | 'na', val: string | boolean) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId 
        ? { ...p, [spec]: { ...p[spec], [field]: val } }
        : p
    ));
  };

  const toggleAmenity = (propertyId: string, amenity: keyof Property['amenities']) => {
    setProperties(prev => prev.map(p => 
      p.id === propertyId
        ? { ...p, amenities: { ...p.amenities, [amenity]: !p.amenities[amenity] } }
        : p
    ));
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} shadow-sm border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/')}
                className={`inline-flex items-center gap-2 ${darkMode ? 'text-gray-300 hover:text-white' : 'text-gray-700 hover:text-gray-900'}`}
              >
                <ArrowLeft className="w-5 h-5" /> Home
              </button>
              <h1 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Property Owner Dashboard</h1>
            </div>
            <div className="flex items-center gap-4 relative">
              <div
                onMouseEnter={() => setShowSettingsMenu(true)}
                onMouseLeave={() => {
                  // Delay closing to allow cursor movement
                  setTimeout(() => setShowSettingsMenu(false), 600);
                }}
                className="relative"
              >
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:scale-105 transition-all rounded-lg hover:shadow-lg hover:shadow-primary-500/20">
                  <Settings className="w-5 h-5" />
                </button>
                {showSettingsMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                    onMouseEnter={() => setShowSettingsMenu(true)}
                    onMouseLeave={() => setTimeout(() => setShowSettingsMenu(false), 600)}
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
                    <button className="w-full flex items-center justify-between px-4 py-2 text-sm hover:bg-gray-50 text-gray-900">
                      <span className="text-gray-900">Notifications</span>
                      <span className="text-gray-500">Manage</span>
                    </button>
                  </div>
                )}
              </div>
              <div
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => {
                  // Delay closing to allow cursor movement
                  setTimeout(() => setShowUserMenu(false), 600);
                }}
                className="relative"
              >
                <button className="p-2 text-gray-600 hover:text-gray-900 hover:scale-105 transition-all rounded-lg hover:shadow-lg hover:shadow-primary-500/20">
                  <User className="w-5 h-5" />
                </button>
                {showUserMenu && (
                  <div 
                    className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-20"
                    onMouseEnter={() => setShowUserMenu(true)}
                    onMouseLeave={() => setTimeout(() => setShowUserMenu(false), 600)}
                  >
                    <div className="px-4 py-2 text-sm text-gray-800 border-b font-semibold">Homeowner Profile</div>
                    <button className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">View Profile</button>
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
        {/* Welcome Section */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6 mb-6`}>
          <div className="flex items-center gap-3 mb-2">
            <Home className={`w-6 h-6 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Welcome to Your Dashboard</h2>
          </div>
          <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
            Manage your property listings, upload photos and videos, and track your property status.
          </p>
        </div>

        {/* Property Portfolio */}
        <div className={`${darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg shadow-sm border p-6 mb-6`}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Property Portfolio</h3>
              <p className={`text-sm ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>Select a property to manage photos, videos, specifications, and availability.</p>
            </div>
            <button
              onClick={addNewProperty}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
            >
              <Plus className="w-4 h-4" />
              Add Property
            </button>
          </div>

          {properties.length === 0 ? (
            <div className={`border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg p-8 text-center ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              <p className={`text-base font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-2`}>Empty Listing Portfolio</p>
              <p className={`text-sm mb-4 ${darkMode ? 'text-gray-400' : ''}`}>You haven&apos;t added any properties yet. Click &ldquo;Add Property&rdquo; to create your first listing.</p>
              <button
                onClick={addNewProperty}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Property
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
                          {property.address || 'Property Name not set'}
                        </h4>
                        <span className={`text-xs ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>ID: {property.id.replace('property-', '#')}</span>
                      </div>
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
                        <span className={`px-3 py-1 rounded-full font-medium ${
                          property.status === 'Available'
                            ? darkMode
                              ? 'bg-green-900/50 text-green-300'
                              : 'bg-green-100 text-green-800'
                            : darkMode
                              ? 'bg-gray-700 text-gray-300'
                              : 'bg-gray-100 text-gray-700'
                        }`}>
                          {property.status}
                        </span>
                        <span className={`capitalize font-semibold ${darkMode ? 'text-primary-400' : 'text-primary-700'}`}>{property.listingType}</span>
                        {property.location && (
                          <span className={darkMode ? 'text-gray-400' : 'text-gray-600'}>{property.location}</span>
                        )}
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
                        title="Delete property"
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
                            <h5 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Property Photos</h5>
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
                            {property.photos.map((photo, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={photo}
                                  alt={`Property photo ${index + 1}`}
                                  className="w-full h-48 object-cover rounded-lg"
                                />
                                <button
                                  onClick={() => removePhoto(property.id, index)}
                                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-4 h-4" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className={`border-2 border-dashed ${darkMode ? 'border-gray-600' : 'border-gray-300'} rounded-lg p-12 text-center`}>
                            <ImageIcon className={`w-12 h-12 ${darkMode ? 'text-gray-500' : 'text-gray-400'} mx-auto mb-4`} />
                            <p className={`${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-2`}>No photos selected yet</p>
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Select crisp, well-lit photos to boost engagement.</p>
                          </div>
                        )}
                      </div>

                      {/* Videos */}
                      <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-5`}>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <Video className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                            <h5 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Property Videos</h5>
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
                            <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Optional: upload walkthroughs or aerial footage.</p>
                          </div>
                        )}
                      </div>

                      {/* Property Information */}
                      <div className={`border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'} pt-5`}>
                        <div className="flex items-center gap-2 mb-4">
                          <FileText className={`w-5 h-5 ${darkMode ? 'text-primary-400' : 'text-primary-600'}`} />
                          <h5 className={`text-base font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>Property Information</h5>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <label className={`block text-sm font-medium ${darkMode ? 'text-gray-200' : 'text-gray-700'} mb-1`}>Property Name</label>
                            <input
                              type="text"
                              value={property.address}
                              onChange={(e) => updateProperty(property.id, 'address', e.target.value)}
                              className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                                darkMode 
                                  ? 'border-gray-600 bg-gray-700 text-white placeholder-gray-400' 
                                  : 'border-gray-300 bg-white text-gray-900'
                              }`}
                              placeholder="e.g., Skyline Residence, Kiambu"
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
                              placeholder="Kileleshwa, Nairobi, Kenya"
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
                                onChange={(e) => updateProperty(property.id, 'listingType', e.target.value)}
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
                                  placeholder="2,000,000"
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
                              <option>House</option>
                              <option>Apartment</option>
                              <option>Land</option>
                              <option>Commercial</option>
                            </select>
                          </div>

                          {/* Property Specs with Icons */}
                          <div className="border-t border-gray-200 pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Property Specifications</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-3">
                                <Bed className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                <div className="flex-1">
                                  <input
                                    type="number"
                                    value={property.beds.value}
                                    onChange={(e) => updatePropertySpec(property.id, 'beds', 'value', e.target.value)}
                                    disabled={property.beds.na}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                                    style={{ color: property.beds.na ? '#9CA3AF' : '#111827' }}
                                    placeholder="Number of beds"
                                  />
                                </div>
                                <label className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap">
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
                                <Bath className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                <div className="flex-1">
                                  <input
                                    type="number"
                                    value={property.baths.value}
                                    onChange={(e) => updatePropertySpec(property.id, 'baths', 'value', e.target.value)}
                                    disabled={property.baths.na}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                                    style={{ color: property.baths.na ? '#9CA3AF' : '#111827' }}
                                    placeholder="Number of baths"
                                  />
                                </div>
                                <label className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap">
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
                                <CarFront className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                <div className="flex-1">
                                  <input
                                    type="number"
                                    value={property.parking.value}
                                    onChange={(e) => updatePropertySpec(property.id, 'parking', 'value', e.target.value)}
                                    disabled={property.parking.na}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                                    style={{ color: property.parking.na ? '#9CA3AF' : '#111827' }}
                                    placeholder="Parking spaces"
                                  />
                                </div>
                                <label className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap">
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
                                <Ruler className="w-5 h-5 text-primary-600 flex-shrink-0" />
                                <div className="flex-1">
                                  <input
                                    type="number"
                                    value={property.area.value}
                                    onChange={(e) => updatePropertySpec(property.id, 'area', 'value', e.target.value)}
                                    disabled={property.area.na}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900 disabled:bg-gray-100 disabled:text-gray-400"
                                    style={{ color: property.area.na ? '#9CA3AF' : '#111827' }}
                                    placeholder="Area in m²"
                                  />
                                </div>
                                <label className="flex items-center gap-2 text-sm text-gray-700 whitespace-nowrap">
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
                            <p className="text-xs text-gray-500 mt-2">Any spec marked N/A stays hidden on listing cards and detailed pages.</p>
                          </div>

                          {/* Amenities */}
                          <div className="border-t border-gray-200 pt-4">
                            <label className="block text-sm font-medium text-gray-700 mb-3">Amenities (appear on listing details)</label>
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
                              <label className={`flex items-center gap-3 px-3 py-2 border rounded-lg cursor-pointer transition-colors ${property.amenities.security ? 'border-primary-500 bg-primary-50 text-primary-700' : 'border-gray-300 text-gray-600 hover:border-gray-400'}`}>
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
                            <p className="text-xs text-gray-500 mt-2">These amenities appear on the detailed listing page for increased buyer confidence.</p>
                          </div>

                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                            <textarea
                              rows={4}
                              value={property.description}
                              onChange={(e) => updateProperty(property.id, 'description', e.target.value)}
                              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900"
                              style={{ color: '#111827' }}
                              placeholder="Highlight unique selling points, finishes, neighbourhood perks..."
                            />
                          </div>
                          <button className="w-full md:w-auto px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium">
                            Save Property Information
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
    </div>
  );
}

