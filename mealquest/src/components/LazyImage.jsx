import React, { useState, useEffect, useRef } from 'react';

function LazyImage({ src, alt, className }) {
  const [isVisible, setIsVisible] = useState(false); // Sichtbarkeit im Viewport
  const [loaded, setLoaded] = useState(false);       // Ladezustand des Bildes
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true); // Bild ist im sichtbaren Bereich
        }
      },
      { threshold: 0.1 } // Auslösen, wenn 10% des Bildes sichtbar sind
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      style={{ minHeight: '8rem' }} // Platzhalterhöhe
    >
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)} // Bild geladen
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
}

export default LazyImage;
