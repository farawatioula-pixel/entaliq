"use client";

import { useEffect, useRef } from "react";

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.4;
    }
  }, []);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      loop
      playsInline
      poster="/mountaliq-hero.jpg"
      className="absolute inset-0 h-full w-full object-cover opacity-50"
    >
      <source src="/mountaliq-hero.mp4" type="video/mp4" />
    </video>
  );
}
