import React, { useState, useEffect, useRef } from "react";

function LazyImage({ src, alt, className }) {
  // isVisible => ob das Element im Viewport ist
  const [isVisible, setIsVisible] = useState(false);
  // loaded => ob das <img> fertig geladen wurde (für Fade-in-Effekt)
  const [loaded, setLoaded] = useState(false);

  // Referenz aufs Container-DIV
  const imgRef = useRef(null);

  // useEffect => IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        // isIntersecting => User sieht >=10% des Elements
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
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
      // "bg-gray-200" => grauer Hintergrund als Platzhalter
      className={`relative overflow-hidden bg-gray-200 ${className}`}
      style={{ minHeight: "8rem" }} // minimal 8rem Platz
    >
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          // Fade-in => "opacity-0" bis loaded=true
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
    </div>
  );
}

export default LazyImage;
