"use client";

import { useRef, useState, useSyncExternalStore } from "react";

function subscribe(callback: () => void) {
  const mql = window.matchMedia("(min-width: 640px)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia("(min-width: 640px)").matches;
}

function getServerSnapshot() {
  return false;
}

export default function HeroVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  // Only render <video> at all on tablet/desktop widths, so phones never
  // fetch the video file in the first place (matches Fiverr: no video on
  // mobile, since autoplaying video over cellular data is expensive).
  const showVideo = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function toggle() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      video.play();
      setPlaying(true);
    } else {
      video.pause();
      setPlaying(false);
    }
  }

  if (!showVideo) {
    // Mobile fallback: flat gradient, matches the brand palette.
    return <div className="absolute inset-0 bg-gradient-to-br from-ink via-violet-deep/40 to-ink" />;
  }

  return (
    <>
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

      <button
        type="button"
        onClick={toggle}
        aria-label={playing ? "Pause video" : "Play video"}
        className="absolute bottom-5 right-5 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur transition-colors hover:bg-black/60"
      >
        {playing ? (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
            <rect x="2" y="1" width="3.5" height="12" rx="0.5" />
            <rect x="8.5" y="1" width="3.5" height="12" rx="0.5" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
            <path d="M2 1.2C2 0.5 2.8 0.1 3.4 0.5L12.6 6.3C13.1 6.6 13.1 7.4 12.6 7.7L3.4 13.5C2.8 13.9 2 13.5 2 12.8V1.2Z" />
          </svg>
        )}
      </button>
    </>
  );
}
