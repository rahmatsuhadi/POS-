"use client";

import {
  CheckCircleIcon,
  CloudArrowUpIcon,
  DatabaseIcon,
  LockKeyIcon,
  PrinterIcon,
  ShieldCheckIcon,
  StorefrontIcon,
  TagIcon,
  XCircleIcon,
} from "@phosphor-icons/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PosHeader } from "../../components/pos/PosHeader";
import { PosSidebar } from "../../components/pos/PosSidebar";
import { AdminPinCard } from "../../components/settings/AdminPinCard";
import { BackupRestoreCard } from "../../components/settings/BackupRestoreCard";
import { CategoryManagementCard } from "../../components/settings/CategoryManagementCard";
import { OperationalModeCard } from "../../components/settings/OperationalModeCard";
import { PinLockModal } from "../../components/settings/PinLockModal";
import { PrinterSettingsCard } from "../../components/settings/PrinterSettingsCard";
import { StoreProfileForm } from "../../components/settings/StoreProfileForm";
import { SupabaseSyncCard } from "../../components/settings/SupabaseSyncCard";
import { getStoreProfile } from "../../lib/store";

export type SettingsTab =
  | "profil"
  | "mode"
  | "categories"
  | "pin"
  | "cloud"
  | "printer"
  | "backup";

interface ToastState {
  id: number;
  message: string;
  type: "success" | "error";
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<SettingsTab>("profil");
  const [isOnline, setIsOnline] = useState(true);
  const [pinModalOpen, setPinModalOpen] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(true);
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success",
  ) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  useEffect(() => {
    setIsOnline(navigator.onLine);
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  useEffect(() => {
    async function checkSecurityGuard() {
      try {
        const profile = await getStoreProfile();
        if (profile?.mode === "team" && profile.adminPin) {
          const unlocked =
            sessionStorage.getItem("pos_admin_unlocked") === "true";
          if (!unlocked) {
            setIsUnlocked(false);
            setPinModalOpen(true);
          }
        }
      } catch (err) {
        console.error("Gagal memeriksa proteksi PIN:", err);
      }
    }
    checkSecurityGuard();
  }, []);

  const handleNavigateWithGuard = (href: string) => {
    router.push(href);
  };

  const navItems = [
    { id: "profil" as SettingsTab, label: "Profil Toko", icon: StorefrontIcon },
    {
      id: "mode" as SettingsTab,
      label: "Mode Operasional",
      icon: ShieldCheckIcon,
    },
    {
      id: "categories" as SettingsTab,
      label: "Kategori Produk",
      icon: TagIcon,
    },
    { id: "pin" as SettingsTab, label: "Keamanan & PIN", icon: LockKeyIcon },
    {
      id: "cloud" as SettingsTab,
      label: "Supabase Cloud Sync",
      icon: CloudArrowUpIcon,
    },
    {
      id: "printer" as SettingsTab,
      label: "Hardware & Printer",
      icon: PrinterIcon,
    },
    { id: "backup" as SettingsTab, label: "Cadangan JSON", icon: DatabaseIcon },
  ];

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-bg text-fg">
      {/* App Sidebar */}
      <PosSidebar
        onNavigateWithGuard={handleNavigateWithGuard}
        activeView="settings"
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">


        {/* Settings View Container */}
        <div className="flex flex-1 overflow-hidden">
          {/* Vertical Sub-navigation */}
          <aside className="w-64 border-r border-border bg-surface p-4 hidden md:block overflow-y-auto shrink-0">
            <h1 className="text-fg font-bold text-lg mb-4 px-2">Pengaturan</h1>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const IconComp = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-md text-sm font-semibold transition-all cursor-pointer ${isActive
                      ? "bg-accent text-white shadow-sm"
                      : "text-muted hover:bg-fg-soft hover:text-fg"
                      }`}
                  >
                    <IconComp size={18} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </aside>

          {/* Tab Content Panel */}
          <main className="flex-1 overflow-y-auto p-4 md:p-8">
            {/* Mobile Tab Selector */}
            <div className="md:hidden mb-4 overflow-x-auto pb-2 flex gap-2">
              {navItems.map((item) => {
                const IconComp = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold whitespace-nowrap border shrink-0 ${isActive
                      ? "bg-accent border-accent text-white"
                      : "bg-surface border-border text-muted"
                      }`}
                  >
                    <IconComp size={16} />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            {!isUnlocked ? (
              <div className="bg-surface border-border rounded-xl border p-12 text-center max-w-md mx-auto my-12">
                <LockKeyIcon size={48} className="text-accent mx-auto mb-3" />
                <h2 className="text-fg font-bold text-lg mb-1">
                  Akses Terkunci (Mode Bisnis)
                </h2>
                <p className="text-muted text-xs mb-4">
                  Halaman Pengaturan dilindungi dengan PIN Admin untuk keamanan
                  manajerial toko Anda.
                </p>
                <button
                  type="button"
                  onClick={() => setPinModalOpen(true)}
                  className="bg-accent hover:opacity-90 text-white font-semibold px-5 py-2.5 rounded-lg text-xs"
                >
                  Masukkan PIN Admin
                </button>
              </div>
            ) : (
              <div className="max-w-4xl mx-auto space-y-6">
                {activeTab === "profil" && (
                  <StoreProfileForm onShowToast={showToast} />
                )}
                {activeTab === "mode" && (
                  <OperationalModeCard
                    onShowToast={showToast}
                    onRequirePinSetup={() => setActiveTab("pin")}
                  />
                )}
                {activeTab === "categories" && (
                  <CategoryManagementCard onShowToast={showToast} />
                )}
                {activeTab === "pin" && (
                  <AdminPinCard onShowToast={showToast} />
                )}
                {activeTab === "cloud" && (
                  <SupabaseSyncCard onShowToast={showToast} />
                )}
                {activeTab === "printer" && (
                  <PrinterSettingsCard onShowToast={showToast} />
                )}
                {activeTab === "backup" && (
                  <BackupRestoreCard onShowToast={showToast} />
                )}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Admin PIN Lock Modal */}
      <PinLockModal
        isOpen={pinModalOpen}
        onUnlocked={() => {
          setIsUnlocked(true);
          setPinModalOpen(false);
          showToast("Sesi Admin Terbuka!", "success");
        }}
        onClose={() => {
          setPinModalOpen(false);
          if (!isUnlocked) {
            router.push("/pos");
          }
        }}
      />

      {/* Toast Popup Container */}
      <div className="fixed bottom-5 right-5 z-[150] space-y-2 pointer-events-none">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`flex items-center gap-3
  px-4 py-2.5 rounded-md shadow-lg       
  shadow-black/5 border text-sm font-    
  medium backdrop-blur-md animate-in     
  slide-in-from-bottom-3 duration-200    
  pointer-events-auto min-w-[280px] max- 
  w-sm ${toast.type === "success"
                ? "bg-surface/95 border-emerald-500/20 text-fg"
                : "bg-surface/95 border-red-500/20 text-red-600"
              }`}
          >
            {toast.type === "success" ? (
              <div className="flex items-center
  justify-center w-6 h-6 rounded-full bg-
  emerald-500/10 text-emerald-600 shrink-
  0">
                <CheckCircleIcon size={16} />
              </div>
            ) : (
              <div className="flex items-center
  justify-center w-6 h-6 rounded-full bg-
  red-500/10 text-red-600 shrink-0">
                <XCircleIcon size={16} />
              </div>
            )}
            <span className="truncate leading- 
  tight">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
