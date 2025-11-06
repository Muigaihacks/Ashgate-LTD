'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Upload, FileText, X, Users, Award } from 'lucide-react';

export default function ExpertRegistrationPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profession: '',
    serialNumber: '',
    professionalBoard: '',
    yearsOfExperience: '',
    bio: '',
    acceptTerms: false
  });
  const [uploadedDocuments, setUploadedDocuments] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);
    // Filter files that are under 5MB
    const validFiles = newFiles.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length !== newFiles.length) {
      alert('Some files exceed 5MB limit and were not added.');
    }

    setUploadedDocuments([...uploadedDocuments, ...validFiles]);
  };

  const removeDocument = (index: number) => {
    setUploadedDocuments(uploadedDocuments.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission - in production, this would send to backend
    setTimeout(() => {
      alert('Application submitted successfully! Our team will review your application and verify your credentials. You will be notified once your application is approved.');
      setIsSubmitting(false);
      router.push('/community');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-gray-700 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" /> Back
          </button>
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Become an Expert</h1>
          </div>
          <p className="text-gray-600">
            Join our network of verified professionals. Submit your application with your professional credentials for review.
          </p>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <Award className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">Verification Process</h3>
              <p className="text-sm text-blue-800">
                We verify all professional credentials through official Kenyan professional boards. Please ensure your serial number and supporting documents are accurate. Applications are typically reviewed within 3-5 business days.
              </p>
            </div>
          </div>
        </div>

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900"
                  style={{ color: '#111827' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900"
                  style={{ color: '#111827' }}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900"
                  style={{ color: '#111827' }}
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900"
                  style={{ color: '#111827' }}
                  placeholder="+254 7xx xxx xxx"
                  required
                />
              </div>
            </div>
          </div>

          {/* Professional Information */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Professional Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Profession <span className="text-red-500">*</span>
                </label>
                <select
                  name="profession"
                  value={formData.profession}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900"
                  style={{ color: '#111827' }}
                  required
                >
                  <option value="">Select profession</option>
                  <option value="legal">Legal & Conveyancing</option>
                  <option value="cabro">Cabro & Paving</option>
                  <option value="solar">Solar & Utilities</option>
                  <option value="landscaping">Landscaping</option>
                  <option value="movers">Professional Movers</option>
                  <option value="photography">Real Estate Photography</option>
                  <option value="interior">Interior Design & Staging</option>
                  <option value="real-estate-agent">Real Estate Agents</option>
                  <option value="property-manager">Property Managers</option>
                  <option value="engineer">Engineer</option>
                  <option value="architect">Architect</option>
                  <option value="surveyor">Quantity Surveyor</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Years of Experience <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="yearsOfExperience"
                  value={formData.yearsOfExperience}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900"
                  style={{ color: '#111827' }}
                  required
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Serial/Registration Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="serialNumber"
                  value={formData.serialNumber}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900"
                  style={{ color: '#111827' }}
                  placeholder="Enter your professional registration number"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">This will be verified with the relevant professional board</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Professional Board/Association <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="professionalBoard"
                  value={formData.professionalBoard}
                  onChange={handleInputChange}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900"
                  style={{ color: '#111827' }}
                  placeholder="e.g., Engineers Board of Kenya, Law Society of Kenya"
                  required
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Professional Bio <span className="text-red-500">*</span>
              </label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-500 !text-gray-900"
                style={{ color: '#111827' }}
                placeholder="Tell us about your professional background, expertise, and service areas..."
                required
              />
            </div>
          </div>

          {/* Document Upload */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Supporting Documents</h2>
            <p className="text-sm text-gray-600 mb-4">
              Upload documents that support your professional credentials (e.g., professional license, registration certificate, academic certificates, portfolio samples).
            </p>
            
            <label className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 cursor-pointer mb-4">
              <Upload className="w-4 h-4" />
              Upload Documents
              <input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                onChange={handleDocumentUpload}
                className="hidden"
              />
            </label>
            
            <p className="text-xs text-gray-500 mb-4">
              Accepted formats: PDF, DOC, DOCX, JPG, PNG (Max 5MB per file)
            </p>

            {uploadedDocuments.length > 0 && (
              <div className="space-y-2">
                {uploadedDocuments.map((file, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{file.name}</span>
                      <span className="text-xs text-gray-500">({(file.size / 1024 / 1024).toFixed(2)} MB)</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeDocument(index)}
                      className="p-1 text-red-500 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="border-t border-gray-200 pt-6">
            <div className="flex items-start">
              <input
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="mt-1 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                required
              />
              <label className="ml-2 text-sm text-gray-700">
                I agree to{' '}
                <a href="/terms-and-conditions.html" target="_blank" className="text-primary-600 hover:text-primary-500 underline">
                  Ashgate Limited&apos;s Terms & Conditions
                </a>
                {' '}and confirm that all information provided is accurate. I understand that false information may result in application rejection.
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

