"use client";

import { useGSAP } from "@gsap/react";
import {
  Desktop,
  DeviceMobile,
  DeviceTablet,
  Gear,
  LockKey,
  MagnifyingGlass,
  Package,
  Plus,
  Receipt,
} from "@phosphor-icons/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

type DeviceType = "desktop" | "tablet" | "mobile";

const SAMPLE_PRODUCTS = [
  {
    id: "1",
    name: "Kopi Susu Gula Aren",
    price: 18000,
    stock: 45,
    category: "Minuman",
    image:
      "https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "2",
    name: "Americano Double",
    price: 15000,
    stock: 80,
    category: "Minuman",
    image:
      "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "3",
    name: "Croissant Butter",
    price: 22000,
    stock: 14,
    category: "Makanan",
    image:
      "https://images.unsplash.com/photo-1555507036-ab1f4038808a?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "4",
    name: "Matcha Latte",
    price: 24000,
    stock: 25,
    category: "Minuman",
    image:
      "https://images.unsplash.com/photo-1536256263959-770b48d82b0a?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "5",
    name: "Roti Bakar Cokelat",
    price: 16000,
    stock: 19,
    category: "Makanan",
    image:
      "https://images.unsplash.com/photo-1584776296944-ab6fb57b0bdd?q=80&w=400&auto=format&fit=crop",
  },
  {
    id: "6",
    name: "Air Mineral 600ml",
    price: 4000,
    stock: 120,
    category: "Minuman",
    image:
      "https://images.unsplash.com/photo-1523362628745-0c100150b504?q=80&w=400&auto=format&fit=crop",
  },
];

export function DeviceShowcase() {
  const [device, setDevice] = useState<DeviceType>("desktop");
  const [cartCount, setCartCount] = useState<number>(2);
  const [currentHost, setCurrentHost] = useState<string>("kalapos.app");
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Auto-detect default device view and current host on initial load
  useEffect(() => {
    const width = window.innerWidth;
    if (width < 768) {
      setDevice("mobile");
    } else if (width < 1024) {
      setDevice("tablet");
    } else {
      setDevice("desktop");
    }

    if (window.location.host) {
      setCurrentHost(window.location.host);
    }
  }, []);

  const handleDeviceChange = (newDevice: DeviceType) => {
    setDevice(newDevice);
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
    }
  };

  useGSAP(
    () => {
      if (!containerRef.current) return;

      gsap.fromTo(
        containerRef.current,
        { scale: 0.94, opacity: 0.8 },
        {
          scale: 1,
          opacity: 1,
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%",
            end: "top 40%",
            scrub: 1,
          },
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <div
      ref={containerRef}
      className="mx-auto mt-16 w-full max-w-5xl pt-4 sm:mt-24 sm:pt-6"
    >
      {/* Device View Selector Pill */}
      <div className="no-scrollbar -mx-4 mb-4 flex w-[calc(100%+2rem)] [scrollbar-width:none] items-center justify-start overflow-x-auto px-4 pb-2 [-ms-overflow-style:none] sm:mx-0 sm:w-full sm:justify-center sm:px-0 [&::-webkit-scrollbar]:hidden">
        <div className="inline-flex shrink-0 items-center gap-1 rounded-full border border-slate-200/90 bg-white p-1.5 shadow-md shadow-slate-900/5 backdrop-blur-md">
          <button
            type="button"
            onClick={() => handleDeviceChange("desktop")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all sm:gap-2 sm:px-4 sm:py-2 ${device === "desktop" ? "border border-emerald-300/80 bg-emerald-50 font-bold text-emerald-700 shadow-xs" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <Desktop
              size={15}
              weight={device === "desktop" ? "bold" : "regular"}
            />
            <span className="sm:hidden">Desktop</span>
            <span className="hidden sm:inline">Desktop POS (3-Panel)</span>
          </button>

          <button
            type="button"
            onClick={() => handleDeviceChange("tablet")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all sm:gap-2 sm:px-4 sm:py-2 ${device === "tablet" ? "border border-emerald-300/80 bg-emerald-50 font-bold text-emerald-700 shadow-xs" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <DeviceTablet
              size={15}
              weight={device === "tablet" ? "bold" : "regular"}
            />
            <span className="sm:hidden">Tablet</span>
            <span className="hidden sm:inline">Tablet (Split 60:40)</span>
          </button>

          <button
            type="button"
            onClick={() => handleDeviceChange("mobile")}
            className={`flex cursor-pointer items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold whitespace-nowrap transition-all sm:gap-2 sm:px-4 sm:py-2 ${device === "mobile" ? "border border-emerald-300/80 bg-emerald-50 font-bold text-emerald-700 shadow-xs" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}
          >
            <DeviceMobile
              size={15}
              weight={device === "mobile" ? "bold" : "regular"}
            />
            <span className="sm:hidden">Smartphone</span>
            <span className="hidden sm:inline">Kasir Mini Smartphone</span>
          </button>
        </div>
      </div>

      {/* Swipe Indicator for Mobile when viewing Desktop or Tablet */}
      {device !== "mobile" && (
        <div className="mb-3 flex items-center justify-center gap-1.5 text-[11px] font-medium text-slate-400 md:hidden">
          <span>Geser horizontal untuk melihat tampilan kasir</span>
        </div>
      )}

      {/* Scrollable Container for Device Mockup */}
      <div
        ref={scrollContainerRef}
        className="no-scrollbar -mx-4 w-[calc(100%+2rem)] [scrollbar-width:none] overflow-x-auto overscroll-x-contain px-4 pt-1 pb-6 [-ms-overflow-style:none] sm:mx-0 sm:w-full sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        <div
          className={`flex min-w-fit ${device === "mobile" ? "w-full justify-center" : "justify-start md:justify-center"}`}
        >
          {/* Main Interactive Screen Frame */}
          <div
            className={`shrink-0 overflow-hidden border border-slate-200 bg-white text-left shadow-2xl shadow-slate-900/10 transition-all duration-500 ease-out ${device === "desktop" ? "w-[840px] rounded-2xl md:w-full md:max-w-5xl" : device === "tablet" ? "w-[680px] rounded-2xl md:w-full md:max-w-3xl" : "w-full max-w-[340px] rounded-2xl border-2 border-slate-300 sm:max-w-sm sm:rounded-[32px] sm:border-4"}`}
          >
            {/* Browser Header Bar */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-200 bg-slate-100/90 px-3 py-2.5 text-xs sm:px-4 sm:py-3">
              <div className="flex shrink-0 items-center gap-1.5">
                <div className="h-2.5 w-2.5 rounded-full bg-red-400 sm:h-3 sm:w-3" />
                <div className="h-2.5 w-2.5 rounded-full bg-amber-400 sm:h-3 sm:w-3" />
                <div className="h-2.5 w-2.5 rounded-full bg-emerald-400 sm:h-3 sm:w-3" />
              </div>

              <Link
                href="/pos"
                className="flex w-full max-w-[200px] items-center justify-center gap-1.5 truncate rounded-full border border-slate-200 bg-white px-3 py-1 font-mono text-[10px] text-slate-500 shadow-xs transition-all hover:border-emerald-500/40 hover:text-slate-900 sm:max-w-xs sm:gap-2 sm:px-4 sm:text-[11px]"
              >
                <LockKey size={12} className="shrink-0 text-emerald-600" />
                <span className="truncate">{currentHost}/pos</span>
              </Link>

              <div className="w-10 shrink-0 sm:w-12" aria-hidden="true" />
            </div>

            {/* Compact Mobile Header (Tablet/Mobile Mode) */}
            {device !== "desktop" && (
              <div className="flex items-center gap-3 border-b border-slate-200 bg-white px-4 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-xs font-extrabold text-white shadow-md">
                  K
                </div>
                <div className="relative flex-1">
                  <MagnifyingGlass
                    className="absolute top-2.5 left-3 text-slate-400"
                    size={14}
                  />
                  <input
                    type="text"
                    readOnly
                    placeholder="Cari produk atau scan..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-1.5 pr-3 pl-9 text-xs text-slate-900 focus:outline-none"
                  />
                </div>
              </div>
            )}

            {/* Preview Workspace Layout */}
            <div
              className={`min-h-[420px] md:min-h-[580px] bg-slate-50/50 ${device === "desktop" ? "grid grid-cols-12 divide-x divide-slate-200" : device === "tablet" ? "grid grid-cols-10 divide-x divide-slate-200" : "flex flex-col justify-between"}`}
            >
              {/* Authentic Sidebar (Desktop only) */}
              {device === "desktop" && (
                <aside className="col-span-1 flex flex-col items-center justify-between border-r border-slate-200 bg-white py-5 lg:py-6">
                  <div className="flex flex-col items-center gap-3.5">
                    <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-black text-sm font-extrabold text-white shadow-md">
                      K
                    </div>
                    <button
                      type="button"
                      className="flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-xl border border-emerald-200 bg-emerald-50 text-[10px] font-bold text-emerald-700"
                    >
                      <Desktop size={19} weight="bold" />
                      <span>Kasir</span>
                    </button>
                    <button
                      type="button"
                      className="flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Receipt size={19} />
                      <span>Pesanan</span>
                    </button>
                    <button
                      type="button"
                      className="flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Package size={19} />
                      <span>Stok</span>
                    </button>
                    <button
                      type="button"
                      className="flex h-12 w-12 flex-col items-center justify-center gap-1 rounded-xl text-[10px] font-medium text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                    >
                      <Gear size={19} />
                      <span>Setelan</span>
                    </button>
                  </div>
                  <div className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-xs font-bold text-emerald-700">
                    OWN
                  </div>
                </aside>
              )}

              {/* Catalog Workspace */}
              <div
                className={`flex min-w-0 flex-col justify-between gap-5 p-5 md:p-6 lg:p-7 ${device === "desktop" ? "col-span-7" : device === "tablet" ? "col-span-6" : "w-full"}`}
              >
                {device === "desktop" && (
                  <div className="flex items-center justify-between gap-3">
                    <div className="relative max-w-xs flex-1">
                      <MagnifyingGlass
                        className="absolute top-2.5 left-3 text-slate-400"
                        size={14}
                      />
                      <input
                        type="text"
                        readOnly
                        placeholder="Cari produk / barcode..."
                        className="w-full rounded-lg border border-slate-200 bg-white py-1.5 pr-3 pl-9 text-xs text-slate-900 shadow-xs"
                      />
                    </div>
                    <div className="flex items-center gap-1.5 text-xs">
                      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-[11px] font-semibold text-emerald-700">
                        Semua
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-500">
                        Minuman
                      </span>
                      <span className="rounded-full border border-slate-200 bg-white px-3 py-1 text-[11px] font-medium text-slate-500">
                        Makanan
                      </span>
                    </div>
                  </div>
                )}

                {/* Product Grid */}
                <div
                  className={`grid gap-3 sm:gap-3.5 md:gap-4 ${device === "desktop" ? "grid-cols-3" : "grid-cols-2"}`}
                >
                  {SAMPLE_PRODUCTS.map((prod) => (
                    <button
                      type="button"
                      key={prod.id}
                      onClick={() => setCartCount((c) => c + 1)}
                      className="group relative flex cursor-pointer flex-col overflow-hidden rounded-xl border border-slate-200 bg-white text-left transition-all duration-300 hover:border-emerald-500 hover:shadow-md"
                    >
                      {/* Image container with stock badge & plus button */}
                      <div
                        className="relative h-24 w-full bg-slate-100 bg-cover bg-center transition-transform duration-500 group-hover:scale-105 sm:h-28 md:h-32"
                        style={{ backgroundImage: `url(${prod.image})` }}
                      >
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 via-transparent to-transparent opacity-60 transition-opacity group-hover:opacity-40" />

                        <span className="absolute top-2 left-2 rounded-md bg-white/90 px-1.5 py-0.5 font-mono text-[9px] font-semibold text-slate-700 shadow-xs backdrop-blur-xs">
                          Stok: {prod.stock}
                        </span>

                        <div className="absolute top-2 right-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-emerald-600 shadow-xs backdrop-blur-xs transition-all group-hover:bg-emerald-600 group-hover:text-white">
                          <Plus size={13} weight="bold" />
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col justify-between p-3 sm:p-3.5">
                        <p className="line-clamp-1 text-[11px] leading-snug font-semibold text-slate-900 transition-colors group-hover:text-emerald-700 sm:text-xs md:text-sm">
                          {prod.name}
                        </p>
                        <p className="mt-1 font-mono text-[11px] font-bold text-emerald-600 sm:text-xs md:text-sm">
                          Rp {prod.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Cart Panel (Desktop & Tablet) */}
              {device !== "mobile" && (
                <div
                  className={`flex flex-col justify-between border-l border-slate-200 bg-white p-5 md:p-6 lg:p-7 ${device === "desktop" ? "col-span-4" : "col-span-4"}`}
                >
                  <div>
                    <div className="flex flex-wrap items-center justify-between gap-1 border-b border-slate-200 pb-2.5">
                      <div className="flex shrink-0 items-center gap-1.5">
                        <span className="text-xs font-bold whitespace-nowrap text-slate-900">
                          Pesanan Aktif
                        </span>
                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 font-mono text-[10px] font-bold whitespace-nowrap text-emerald-700">
                          {cartCount} Item
                        </span>
                      </div>
                      <span className="ml-auto shrink-0 font-mono text-[10px] text-slate-400">
                        #1042
                      </span>
                    </div>

                    <div className="mt-3.5 space-y-2 text-xs">
                      <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 p-2 sm:p-2.5">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-800 sm:text-xs">
                            Kopi Susu Aren
                          </p>
                          <p className="font-mono text-[10px] text-slate-500">
                            Rp 18.000 × 1
                          </p>
                        </div>
                        <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                          1x
                        </span>
                      </div>
                      <div className="flex items-center justify-between rounded-xl border border-slate-200/80 bg-slate-50 p-2 sm:p-2.5">
                        <div>
                          <p className="text-[11px] font-semibold text-slate-800 sm:text-xs">
                            Croissant Butter
                          </p>
                          <p className="font-mono text-[10px] text-slate-500">
                            Rp 22.000 × 1
                          </p>
                        </div>
                        <span className="rounded border border-slate-200 bg-white px-1.5 py-0.5 font-mono text-[10px] font-bold text-emerald-700">
                          1x
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Billing Summary & Payment */}
                  <div className="border-t border-dashed border-slate-200 pt-3.5">
                    <div className="mb-1 flex justify-between font-mono text-xs text-[11px] text-slate-500">
                      <span>Subtotal</span>
                      <span>Rp 40.000</span>
                    </div>
                    <div className="mb-3 flex justify-between border-t border-slate-200 pt-1.5 text-xs font-extrabold text-slate-900 sm:text-sm">
                      <span>Total Tagihan</span>
                      <span className="font-mono text-emerald-600">
                        Rp 40.000
                      </span>
                    </div>

                    <div className="mb-2.5 grid grid-cols-2 gap-1.5">
                      <button
                        type="button"
                        className="rounded-lg border border-emerald-300 bg-emerald-50 px-1.5 py-1.5 text-center text-[10px] font-bold whitespace-nowrap text-emerald-700 sm:text-[11px]"
                      >
                        Tunai (Cash)
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-slate-200 bg-white px-1.5 py-1.5 text-center text-[10px] font-medium whitespace-nowrap text-slate-600 hover:text-slate-900 sm:text-[11px]"
                      >
                        QRIS / Transfer
                      </button>
                    </div>

                    <Link
                      href="/pos"
                      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-emerald-600 py-2.5 text-xs font-extrabold whitespace-nowrap text-white shadow-md shadow-emerald-600/20 transition-all hover:bg-emerald-500 sm:py-3"
                    >
                      <span>Bayar Rp 40.000</span>
                    </Link>
                  </div>
                </div>
              )}

              {/* Sticky Mobile Cart Bar */}
              {device === "mobile" && (
                <div className="flex items-center justify-between gap-3 border-t border-slate-200 bg-white p-4">
                  <div>
                    <p className="text-[11px] text-slate-500">
                      Pesanan #1042 ({cartCount} Item)
                    </p>
                    <p className="font-mono text-sm font-extrabold text-emerald-600">
                      Rp 40.000
                    </p>
                  </div>
                  <Link
                    href="/pos"
                    className="rounded-xl bg-emerald-600 px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-600/20"
                  >
                    Bayar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
