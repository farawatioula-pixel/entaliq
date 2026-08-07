"use client";

import { useEffect, useRef } from "react";

export default function LogoBanner() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = true;
    video.defaultMuted = true;
    const playPromise = video.play();
    if (playPromise) {
      playPromise.catch(() => {
        // Autoplay was blocked; the poster frame stays visible instead.
      });
    }
  }, []);

  return (
    <div className="mx-auto max-w-7xl border-t border-line px-5 pt-10 sm:px-8">
      <video
        ref={videoRef}
        className="mx-auto h-auto w-full max-w-[1280px]"
        src="/media/logo-banner.mp4"
        poster="/media/logo-banner-poster.png"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
    </div>
  );
}
