import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { Button } from '../components/Button';

interface BusinessesProps {
  onNavigate: (path: string) => void;
}

interface BusinessType {
  id: string;
  name: string;
  description: string;
  tagline?: string;
  logo?: string;
  industry?: string;
}

export const Businesses: React.FC<BusinessesProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [businesses, setBusinesses] = useState<BusinessType[]>([]);

  // Form inputs
  const [newBusinessName, setNewBusinessName] = useState("");
  const [newBusinessDescription, setNewBusinessDescription] = useState("");
  const [newBusinessLogo, setNewBusinessLogo] = useState<File | null>(null);
  const [newBusinessTagline, setNewBusinessTagline] = useState("");

  // Contact info optional
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [contactAddress, setContactAddress] = useState("");
  const [contactCity, setContactCity] = useState("");
  const [contactState, setContactState] = useState("");
  const [contactPostalCode, setContactPostalCode] = useState("");
  const [contactCountry, setContactCountry] = useState("");

  // Fetch businesses from backend
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/businesses/");
        if (!res.ok) {
          throw new Error("Failed to fetch businesses");
        }
        const data = await res.json();
        setBusinesses(data);
      } catch (err) {
        console.error("Failed to fetch businesses:", err);
      }
    };
    fetchBusinesses();
  }, []);

  // Carousel navigation
  const handlePrevious = () => {
    if (!businesses.length) return;
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : businesses.length - 1));
  };

  const handleNext = () => {
    if (!businesses.length) return;
    setCurrentIndex(prev => (prev < businesses.length - 1 ? prev + 1 : 0));
  };

  const getPreviousIndex = () =>
    businesses.length ? (currentIndex > 0 ? currentIndex - 1 : businesses.length - 1) : 0;

  const getNextIndex = () =>
    businesses.length ? (currentIndex < businesses.length - 1 ? currentIndex + 1 : 0) : 0;

const handleSubmitNewBusiness = async () => {
  if (!newBusinessName) {
    alert("Please enter a business name.");
    return;
  }

    const formData = new FormData();
    formData.append("name", newBusinessName);
    formData.append("description", newBusinessDescription);
    formData.append("tagline", newBusinessTagline);
    if (newBusinessLogo) formData.append("logo", newBusinessLogo);

    // Prepare contact_info as JSON string
    const contactInfo = {
      email: contactEmail,
      phone: contactPhone,
      address: contactAddress,
      city: contactCity,
      state: contactState,
      postal_code: contactPostalCode,
      country: contactCountry,
  };

    // Only include non-empty fields
    const filteredContactInfo = Object.fromEntries(
      Object.entries(contactInfo).filter(([_, v]) => v)
    );

    formData.append("contact_info", JSON.stringify(filteredContactInfo));

    try {
    const response = await fetch("http://127.0.0.1:8000/api/businesses/", {
      method: "POST",
        body: formData,
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error("Backend error:", errorData);
        throw new Error("Failed to create business");
    }

      const newBusiness = await response.json();

    setShowCreateModal(false);
    setNewBusinessName("");
    setNewBusinessDescription("");
    setNewBusinessTagline("");
      setNewBusinessLogo(null);
      setContactEmail("");
      setContactPhone("");
      setContactAddress("");
      setContactCity("");
      setContactState("");
      setContactPostalCode("");
      setContactCountry("");

    setBusinesses(prev => [...prev, newBusiness]);
    onNavigate(`/business/${newBusiness.id}`);
  } catch (err) {
    console.error("Network or code error:", err);
    alert("Network error creating business");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A6AFF]/10 via-[#3E8BFF]/5 to-transparent flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-4">
            Select Your Business
          </h1>
          <p className="text-xl text-gray-600">
            Choose a business to manage or create a new one
          </p>
        </div>

        {/* Carousel */}
        {businesses.length > 0 ? (
          <div className="relative h-[500px] flex items-center justify-center perspective-[2000px]">
            <button
              onClick={handlePrevious}
              className="absolute left-0 z-20 p-4 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
            >
              <ChevronLeft size={32} className="text-[#1A6AFF]" />
            </button>

            <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
              {/* Previous */}
              <div
                className="absolute left-[10%] w-[300px] h-[400px] transition-all duration-500 ease-out cursor-pointer hover:scale-105"
                style={{ transform: 'translateX(-20%) rotateY(-10deg) scale(0.85)', zIndex: 1, opacity: 0.6 }}
                onClick={handlePrevious}
              >
                <div className="w-full h-full bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-center">
                  <img
                    src={businesses[getPreviousIndex()]?.logo || '/default-logo.png'}
                    alt={businesses[getPreviousIndex()]?.name || 'Business'}
                    className="w-20 h-20 object-cover mb-4 rounded-full"
                  />
                  <h3 className="text-2xl font-bold text-[#0B1A33] mb-2">{businesses[getPreviousIndex()]?.name}</h3>
                  <p className="text-gray-600">{businesses[getPreviousIndex()]?.tagline}</p>
                </div>
              </div>

              {/* Current */}
              <div
                className="absolute w-[350px] h-[450px] transition-all duration-500 ease-out cursor-pointer hover:scale-105"
                style={{ transform: 'translateZ(50px) scale(1)', zIndex: 10 }}
                onClick={() => onNavigate(`/business/${businesses[currentIndex]?.id}`)}
              >
                <div className="w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center text-center border-4 border-[#1A6AFF]">
                  <img
                    src={businesses[currentIndex].logo || '/default-logo.png'}
                    alt={businesses[currentIndex].name}
                    className="w-32 h-32 object-cover mb-6 rounded-full"
                  />
                  <h3 className="text-3xl font-bold text-[#0B1A33] mb-3">{businesses[currentIndex]?.name}</h3>
                  <p className="text-gray-600 mb-4 text-lg">{businesses[currentIndex]?.tagline}</p>
                  {businesses[currentIndex]?.industry && (
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A6AFF] text-white rounded-lg text-sm font-medium">
                      {businesses[currentIndex].industry}
                    </div>
                  )}
                </div>
              </div>

              {/* Next */}
              <div
                className="absolute right-[10%] w-[300px] h-[400px] transition-all duration-500 ease-out cursor-pointer hover:scale-105"
                style={{ transform: 'translateX(20%) rotateY(10deg) scale(0.85)', zIndex: 1, opacity: 0.6 }}
                onClick={handleNext}
              >
                <div className="w-full h-full bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-center">
                  <img
                    src={businesses[getNextIndex()]?.logo || '/default-logo.png'}
                    alt={businesses[getNextIndex()]?.name || 'Business'}
                    className="w-20 h-20 object-cover mb-4 rounded-full"
                  />
                  <h3 className="text-2xl font-bold text-[#0B1A33] mb-2">{businesses[getNextIndex()]?.name}</h3>
                  <p className="text-gray-600">{businesses[getNextIndex()]?.tagline}</p>
                </div>
              </div>
            </div>

            <button
              onClick={handleNext}
              className="absolute right-0 z-20 p-4 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
            >
              <ChevronRight size={32} className="text-[#1A6AFF]" />
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-16">No businesses yet. Create one below!</p>
        )}

        {/* Dots */}
        <div className="flex justify-center gap-2 mt-12">
          {businesses.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentIndex ? 'bg-[#1A6AFF] w-8' : 'bg-gray-300'}`}
            />
          ))}
        </div>

        {/* Create Business Button */}
        <div className="text-center mt-12">
          <Button
            variant="success"
            size="lg"
            icon={<Plus size={20} />}
            onClick={() => setShowCreateModal(true)}
          >
            Create New Business
          </Button>
        </div>

        {/* Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto p-6 relative shadow-xl">
              <h2 className="text-2xl font-bold mb-4 text-[#0B1A33] text-center">Create New Business</h2>
              <div className="space-y-4">
                <input
                  type="text"
                  value={newBusinessName}
                  onChange={e => setNewBusinessName(e.target.value)}
                  placeholder="Business Name"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none"
                />
                <textarea
                  value={newBusinessDescription}
                  onChange={e => setNewBusinessDescription(e.target.value)}
                  placeholder="Description"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none"
                  rows={3}
                />
                <input
                  type="text"
                  value={newBusinessTagline}
                  onChange={e => setNewBusinessTagline(e.target.value)}
                  placeholder="Tagline (optional)"
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none"
                />
                <input
                  type="file"
                  accept="image/*"
                  onChange={e => e.target.files && setNewBusinessLogo(e.target.files[0])}
                  className="w-full border-2 border-gray-200 rounded-xl p-2"
                />

                {/* Contact info optional */}
                <input type="email" value={contactEmail} onChange={e => setContactEmail(e.target.value)} placeholder="Email (optional)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none" />
                <input type="text" value={contactPhone} onChange={e => setContactPhone(e.target.value)} placeholder="Phone (optional)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none" />
                <input type="text" value={contactAddress} onChange={e => setContactAddress(e.target.value)} placeholder="Address (optional)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none" />
                <input type="text" value={contactCity} onChange={e => setContactCity(e.target.value)} placeholder="City (optional)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none" />
                <input type="text" value={contactState} onChange={e => setContactState(e.target.value)} placeholder="State (optional)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none" />
                <input type="text" value={contactPostalCode} onChange={e => setContactPostalCode(e.target.value)} placeholder="Postal Code (optional)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none" />
                <input type="text" value={contactCountry} onChange={e => setContactCountry(e.target.value)} placeholder="Country (optional)" className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#1A6AFF] focus:outline-none" />

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={handleSubmitNewBusiness}
                    className="flex-1 bg-[#1A6AFF] text-white px-4 py-3 rounded-xl hover:bg-[#3E8BFF] transition"
                  >
                    Create Business
                  </button>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 border-2 border-gray-300 px-4 py-3 rounded-xl hover:bg-gray-100 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
