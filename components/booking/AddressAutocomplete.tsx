"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    google: typeof google;
  }
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  onClearError?: () => void;
  className?: string;
}

export default function AddressAutocomplete({ value, onChange, onClearError, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !inputRef.current) return;

    function initAutocomplete() {
      if (!inputRef.current || !window.google?.maps?.places) return;

      // Bias suggestions toward the Greater Houston area
      const houstonBounds = new window.google.maps.LatLngBounds(
        { lat: 29.0, lng: -96.5 },
        { lat: 30.5, lng: -94.5 }
      );

      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        bounds: houstonBounds,
        strictBounds: false,
        componentRestrictions: { country: "us" },
        fields: ["formatted_address"],
        types: ["address"],
      });

      autocomplete.addListener("place_changed", () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address);
          onClearError?.();
        }
      });
    }

    // Already loaded
    if (window.google?.maps?.places) {
      initAutocomplete();
      return;
    }

    // Script tag already in DOM (e.g. from a previous component mount)
    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[src*="maps.googleapis.com/maps/api/js"]'
    );
    if (existingScript) {
      existingScript.addEventListener("load", initAutocomplete);
      return () => existingScript.removeEventListener("load", initAutocomplete);
    }

    // Inject the script for the first time
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", initAutocomplete);
    document.head.appendChild(script);

    return () => script.removeEventListener("load", initAutocomplete);
  }, []);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => {
        onChange(e.target.value);
        onClearError?.();
      }}
      placeholder="Enter your full address"
      className={className}
      autoComplete="off"
    />
  );
}
