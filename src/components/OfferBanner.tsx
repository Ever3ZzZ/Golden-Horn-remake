"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function OfferBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setIsVisible(true), 5000);
    return () => window.clearTimeout(timer);
  }, []);

  const closeBanner = () => setIsVisible(false);

  if (!isVisible) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-[#1a120f]/35 p-3 sm:p-5"
      onClick={closeBanner}
      aria-label="Offer close"
    >
      <div
        className="anim-soft-rise relative w-full max-w-[980px] cursor-pointer"
        onClick={closeBanner}
      >
        <Image
          src="/assets/MessageFoodd.png"
          alt="Offer banner"
          width={1500}
          height={980}
          priority
          className="h-auto w-full rounded-[22px] object-cover shadow-[0_30px_90px_rgba(0,0,0,0.32)]"
        />
      </div>
    </div>
  );
}
