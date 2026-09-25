import { BrandLogo } from "./BrandLogo";

export default function Loading() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50/60 font-sans text-slate-900">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-40" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 -z-10 h-[400px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[130px]" />

      <div className="flex flex-col items-center gap-4 text-center">
        <BrandLogo />
        <div className="flex flex-col items-center gap-1.5">
          <div className="flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
            <p className="text-sm font-semibold text-slate-800">
              Menyiapkan Halaman...
            </p>
          </div>
          <p className="font-mono text-xs text-slate-500">
            Mohon tunggu sebentar
          </p>
        </div>
      </div>
    </div>
  );
}
