'use client';

import { useState, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const INACTIVITY_TIME = 20000; // 20 seconds
const IMAGE_ROTATION_TIME = 5000; // 5 seconds per image
const IMAGES = [
  '/screensaver/screensaver1.jpeg',
  '/screensaver/screensaver2.jpeg',
  '/screensaver/screensaver3.jpeg',
  '/screensaver/screensaver4.jpeg',
  '/screensaver/screensaver5.jpeg',
];

export default function Screensaver() {
  const [isActive, setIsActive] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);
  const rotationTimerRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();
  const isActiveRef = useRef(false);

  // Check if we're on a dashboard page (exclude screensaver)
  const isDashboard = pathname?.startsWith('/dashboard');

  // Update ref when isActive changes
  useEffect(() => {
    isActiveRef.current = isActive;
  }, [isActive]);

  useEffect(() => {
    // Don't show screensaver on dashboard pages
    if (isDashboard) {
      // Clear any timers if on dashboard
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
        rotationTimerRef.current = null;
      }
      setIsActive(false);
      return;
    }

    const startImageRotation = () => {
      // Clear any existing rotation timer
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
      }

      // Set initial image
      setCurrentImageIndex(0);

      // Rotate images every 5 seconds
      rotationTimerRef.current = setInterval(() => {
        setCurrentImageIndex((prev) => (prev + 1) % IMAGES.length);
      }, IMAGE_ROTATION_TIME);
    };

    const resetInactivityTimer = () => {
      // Clear existing timer
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }

      // Hide screensaver if it's active
      if (isActiveRef.current) {
        setIsActive(false);
        // Clear rotation timer when dismissing
        if (rotationTimerRef.current) {
          clearInterval(rotationTimerRef.current);
          rotationTimerRef.current = null;
        }
      }

      // Set new inactivity timer
      inactivityTimerRef.current = setTimeout(() => {
        if (!isDashboard) {
          setIsActive(true);
          // Start image rotation when screensaver activates
          startImageRotation();
        }
      }, INACTIVITY_TIME);
    };

    // Track user activity events
    const events = ['mousedown', 'mousemove', 'keypress', 'keydown', 'scroll', 'touchstart', 'click', 'wheel'];
    
    events.forEach((event) => {
      window.addEventListener(event, resetInactivityTimer, { passive: true });
    });

    // Initialize timer on mount
    resetInactivityTimer();

    // Cleanup
    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, resetInactivityTimer);
      });
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
        inactivityTimerRef.current = null;
      }
      if (rotationTimerRef.current) {
        clearInterval(rotationTimerRef.current);
        rotationTimerRef.current = null;
      }
    };
  }, [isDashboard]); // Only depend on isDashboard, not isActive

  // Don't render on dashboard pages
  if (isDashboard || !isActive) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 z-[99999] bg-black/70 flex items-center justify-center transition-opacity duration-500"
      aria-label="Screensaver - Move mouse or press any key to dismiss"
      role="dialog"
      aria-modal="false"
    >
      {/* Image Carousel */}
      <div className="relative w-full h-full flex items-center justify-center">
        {IMAGES.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-1000 ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={image}
              alt={`Screensaver image ${index + 1}`}
              fill
              className="object-contain"
              priority={index === 0}
              quality={90}
              sizes="100vw"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
