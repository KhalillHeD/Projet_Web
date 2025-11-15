import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { mockBusinesses } from '../data/mockData';
import { Button } from '../components/Button';

interface BusinessesProps {
  onNavigate: (path: string) => void;
}

export const Businesses: React.FC<BusinessesProps> = ({ onNavigate }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : mockBusinesses.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < mockBusinesses.length - 1 ? prev + 1 : 0));
  };

  const getPreviousIndex = () => {
    return currentIndex > 0 ? currentIndex - 1 : mockBusinesses.length - 1;
  };

  const getNextIndex = () => {
    return currentIndex < mockBusinesses.length - 1 ? currentIndex + 1 : 0;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1A6AFF]/10 via-[#3E8BFF]/5 to-transparent flex items-center justify-center px-4 py-12">
      <div className="max-w-6xl w-full">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold text-[#0B1A33] mb-4">
            Select Your Business
          </h1>
          <p className="text-xl text-gray-600">
            Choose a business to manage or create a new one
          </p>
        </div>

        <div className="relative h-[500px] flex items-center justify-center perspective-[2000px]">
          <button
            onClick={handlePrevious}
            className="absolute left-0 z-20 p-4 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
            aria-label="Previous business"
          >
            <ChevronLeft size={32} className="text-[#1A6AFF]" />
          </button>

          <div className="relative w-full max-w-4xl h-full flex items-center justify-center">
            <div
              className="absolute left-[10%] w-[300px] h-[400px] transition-all duration-500 ease-out cursor-pointer hover:scale-105"
              style={{
                transform: 'translateX(-20%) rotateY(-10deg) scale(0.85)',
                zIndex: 1,
                opacity: 0.6,
              }}
              onClick={handlePrevious}
            >
              <div className="w-full h-full bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4">{mockBusinesses[getPreviousIndex()].logo}</div>
                <h3 className="text-2xl font-bold text-[#0B1A33] mb-2">
                  {mockBusinesses[getPreviousIndex()].name}
                </h3>
                <p className="text-gray-600">{mockBusinesses[getPreviousIndex()].tagline}</p>
              </div>
            </div>

            <div
              className="absolute w-[350px] h-[450px] transition-all duration-500 ease-out cursor-pointer hover:scale-105"
              style={{
                transform: 'translateZ(50px) scale(1)',
                zIndex: 10,
              }}
              onClick={() => onNavigate(`/business/${mockBusinesses[currentIndex].id}`)}
            >
              <div className="w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-2xl p-10 flex flex-col items-center justify-center text-center border-4 border-[#1A6AFF]">
                <div className="text-7xl mb-6 animate-scale-in">{mockBusinesses[currentIndex].logo}</div>
                <h3 className="text-3xl font-bold text-[#0B1A33] mb-3">
                  {mockBusinesses[currentIndex].name}
                </h3>
                <p className="text-gray-600 mb-4 text-lg">{mockBusinesses[currentIndex].tagline}</p>
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1A6AFF] text-white rounded-lg text-sm font-medium">
                  {mockBusinesses[currentIndex].industry}
                </div>
              </div>
            </div>

            <div
              className="absolute right-[10%] w-[300px] h-[400px] transition-all duration-500 ease-out cursor-pointer hover:scale-105"
              style={{
                transform: 'translateX(20%) rotateY(10deg) scale(0.85)',
                zIndex: 1,
                opacity: 0.6,
              }}
              onClick={handleNext}
            >
              <div className="w-full h-full bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center justify-center text-center">
                <div className="text-6xl mb-4">{mockBusinesses[getNextIndex()].logo}</div>
                <h3 className="text-2xl font-bold text-[#0B1A33] mb-2">
                  {mockBusinesses[getNextIndex()].name}
                </h3>
                <p className="text-gray-600">{mockBusinesses[getNextIndex()].tagline}</p>
              </div>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="absolute right-0 z-20 p-4 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-all hover:scale-110"
            aria-label="Next business"
          >
            <ChevronRight size={32} className="text-[#1A6AFF]" />
          </button>
        </div>

        <div className="flex justify-center gap-2 mt-12">
          {mockBusinesses.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex ? 'bg-[#1A6AFF] w-8' : 'bg-gray-300'
              }`}
              aria-label={`Go to business ${index + 1}`}
            />
          ))}
        </div>

        <div className="text-center mt-12">
          <Button variant="success" size="lg" icon={<Plus size={20} />}>
            Create New Business
          </Button>
        </div>
      </div>
    </div>
  );
};
