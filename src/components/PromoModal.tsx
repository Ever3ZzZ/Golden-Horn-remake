"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export default function PromoModal() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isDesktop = window.innerWidth >= 1024;

    if (!isDesktop) return;

    const timer = window.setTimeout(() => setIsOpen(true), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closePromo();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [isOpen]);

  function closePromo() {
    setIsOpen(false);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] hidden items-center justify-center bg-[#0d0908]/55 p-3 lg:flex">
      <button
        type="button"
        aria-label="Aktion schließen"
        onClick={closePromo}
        className="absolute inset-0 cursor-pointer bg-black/20"
      />

      <div className="anim-soft-rise relative z-10 w-full max-w-[980px] overflow-hidden rounded-[18px] border border-[#d1a44a]/40 bg-[#1d120d]/90 shadow-[0_25px_70px_rgba(0,0,0,0.55)]">
        <div className="absolute inset-0">
          <Image
            src="/assets/Home.png"
            alt="Restaurant-Hintergrund"
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-80 blur-[2px]"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(180,128,49,0.20),transparent_32%),linear-gradient(180deg,rgba(11,8,6,0.35),rgba(13,9,8,0.82))]" />
        </div>

        <button
          type="button"
          aria-label="Fenster schließen"
          onClick={closePromo}
          className="absolute right-4 top-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-[#f4f0e3]/90 text-2xl leading-none text-[#222] shadow-md transition hover:scale-105 hover:bg-white"
        >
          ×
        </button>

        <div className="relative z-10 px-4 pb-4 pt-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-[830px] rounded-[14px] border-[7px] border-[#ab7a2d] bg-[#1a1b1d] px-5 py-4 shadow-[inset_0_0_0_1px_rgba(245,214,146,0.22)] sm:px-7 sm:py-6">
            <div className="flex items-center justify-center gap-3 pb-2">
              <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-[3px] border-[#c9932e] bg-[#1b120d] text-[#e8b85b] shadow-[0_0_0_2px_rgba(201,147,46,0.2)]">
                <div className="h-7 w-7 rounded-full border-[2px] border-[#dabb73]" />
                <div className="absolute bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-[#dabb73]" />
              </div>
              <div className="text-center">
                <div className="font-serif text-[2.4rem] leading-none tracking-[-0.06em] text-[#f1d9a1]">
                  GoldenHorn
                </div>
                <div className="mt-1 text-[0.6rem] font-bold uppercase tracking-[0.42em] text-[#d7b56d]">
                  Cafe &amp; Bistro
                </div>
              </div>
            </div>

            <div className="mt-4 text-center text-[#f9e8bf]">
              <div className="font-serif text-[2.8rem] leading-[0.9] tracking-[-0.05em] sm:text-[4rem]">
                <span className="block">Marktangebot</span>
              </div>
            </div>

            <div className="relative mt-3 text-center text-[#f4efe4]">
              <div className="font-serif text-[2.3rem] leading-[0.95] tracking-[-0.06em] sm:text-[3.3rem]">
                <span className="block italic text-[#f8f5f0]">Hähnchenschnitzel</span>
                <span className="block text-[1.45rem] sm:text-[2rem]">paniert (250g)</span>
                <span className="mt-2 block text-[1.75rem] sm:text-[2.55rem]">&amp; Pommes</span>
                <span className="mt-1 block text-[1.4rem] sm:text-[2rem]">+ Softdrink</span>
                <span className="block text-[1rem] italic text-[#d7c8a6] sm:text-[1.3rem]">
                  (Cola, Fanta, Sprite, Mezzo Mix)
                </span>
              </div>
            </div>

            <div className="mt-5 flex justify-center">
              <div className="rounded-[20px] border border-[#d7b56d]/60 bg-[linear-gradient(180deg,#f5e7bf,#d9b36a)] px-5 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.6)]">
                <div className="flex items-end justify-center gap-1 text-[#1b120d]">
                  <span className="font-serif text-[3rem] leading-none tracking-[-0.08em]">€18,</span>
                  <span className="pb-2 text-[1.8rem] font-semibold leading-none">90</span>
                </div>
              </div>
            </div>

            <div className="relative mt-7 overflow-hidden rounded-[18px] bg-[#d9d0c6]/5 px-2 pb-1 pt-2">
              <div className="relative mx-auto h-[210px] w-full max-w-[700px] rounded-[30px] bg-[radial-gradient(circle_at_center,#f1e6d2_0%,#d7c3a1_18%,#ba8c57_32%,#6a3a28_52%,#2d1d1d_85%)] shadow-[inset_0_0_28px_rgba(255,255,255,0.08)]">
                <div className="absolute left-[20%] top-[34%] h-[120px] w-[360px] rounded-[50%] border-[6px] border-[#f8e5b0]/60 bg-[radial-gradient(circle_at_40%_40%,#f7d58b_0%,#e7b46d_18%,#d98f49_30%,#8d4934_62%,#3a1c16_100%)] shadow-[inset_0_0_18px_rgba(255,255,255,0.14)]" />
                <div className="absolute left-[25%] top-[43%] h-[40px] w-[260px] rounded-full bg-[radial-gradient(circle_at_center,#bd5640_0%,#5d2925_100%)] opacity-80" />

                <div className="absolute left-[46%] top-[27%] h-[54px] w-[54px] rounded-full border-[3px] border-[#fbe7ae]/70 bg-[radial-gradient(circle_at_center,#f7d487_0%,#d99b2b_35%,#8b411f_100%)]" />

                <div className="absolute left-[18%] top-[72%] h-[18px] w-[90px] rounded-full bg-[linear-gradient(90deg,#f4d56b,#d9a247)] rotate-[-10deg]" />
                <div className="absolute left-[42%] top-[71%] h-[18px] w-[110px] rounded-full bg-[linear-gradient(90deg,#f4d56b,#d9a247)] rotate-[8deg]" />
                <div className="absolute left-[63%] top-[72%] h-[18px] w-[90px] rounded-full bg-[linear-gradient(90deg,#f4d56b,#d9a247)] rotate-[14deg]" />

                <div className="absolute left-[64%] top-[58%] h-[18px] w-[112px] rounded-full bg-[linear-gradient(90deg,#f0d367,#dba948)] rotate-[18deg]" />
                <div className="absolute left-[67%] top-[62%] h-[18px] w-[120px] rounded-full bg-[linear-gradient(90deg,#f0d367,#dba948)] rotate-[13deg]" />
                <div className="absolute left-[70%] top-[66%] h-[18px] w-[120px] rounded-full bg-[linear-gradient(90deg,#f0d367,#dba948)] rotate-[8deg]" />

                <div className="absolute right-[10%] top-[42%] h-[86px] w-[94px] rounded-[18px] bg-[linear-gradient(180deg,#efe5d1,#d1b691)] opacity-95" />
                <div className="absolute right-[14%] top-[47%] h-[28px] w-[70px] rounded-full bg-[#a8382d]" />
                <div className="absolute right-[16%] top-[59%] h-[16px] w-[50px] rounded-full bg-[#d79730] opacity-75" />

                <div className="absolute right-[15%] top-[72%] h-[26px] w-[78px] rounded-full bg-[radial-gradient(circle_at_center,#f8e9d2,#d88a28)]" />
                <div className="absolute right-[28%] top-[78%] h-[18px] w-[18px] rounded-full bg-[#d9a24f]" />
                <div className="absolute right-[59%] top-[58%] h-[30px] w-[30px] rounded-full bg-[#c3873f] opacity-80" />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-4 gap-2 text-center text-[#f3e8d0] sm:gap-3">
              <div className="rounded-[10px] border border-[#d9b36a]/40 bg-[#f5e7bf]/5 px-2 py-3">
                <div className="text-lg">🐔</div>
                <div className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.1em]">Frisch zubereitet</div>
              </div>
              <div className="rounded-[10px] border border-[#d9b36a]/40 bg-[#f5e7bf]/5 px-2 py-3">
                <div className="text-lg">♡</div>
                <div className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.1em]">Hausgemachter Genuss</div>
              </div>
              <div className="rounded-[10px] border border-[#d9b36a]/40 bg-[#f5e7bf]/5 px-2 py-3">
                <div className="text-lg">★</div>
                <div className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.1em]">Perfekt für Ihre</div>
              </div>
              <div className="rounded-[10px] border border-[#d9b36a]/40 bg-[#f5e7bf]/5 px-2 py-3">
                <div className="text-lg">◌</div>
                <div className="mt-1 text-[0.6rem] font-medium uppercase tracking-[0.1em]">Mittagspause</div>
              </div>
            </div>

            <div className="mt-5 rounded-[18px] bg-[linear-gradient(90deg,#d9b36a,#f0dfb2,#d9b36a)] px-4 py-3 text-center shadow-[0_8px_18px_rgba(199,150,48,0.25)]">
              <div className="flex items-center justify-center gap-3 text-[#1b120d]">
                <span className="text-2xl">◔</span>
                <div>
                  <div className="font-serif text-[1.45rem] leading-none">Jetzt genießen im GoldenHorn</div>
                  <div className="text-[0.76rem] font-semibold uppercase tracking-[0.18em]">Cafe &amp; Bistro in Münnerstadt</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
