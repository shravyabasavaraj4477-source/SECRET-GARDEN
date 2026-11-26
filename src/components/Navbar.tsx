import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';

export type NavTab = 'home' | 'gardens' | 'timeline' | 'how-it-works' | 'report';

interface NavbarProps {
  activeTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onReturnLanding: () => void;
  onSyncNow: () => void;
}

const NAV_ITEMS: { id: NavTab; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'gardens', label: 'My Gardens' },
  { id: 'timeline', label: 'Bloom Timeline' },
  { id: 'how-it-works', label: 'How It Works' },
  { id: 'report', label: 'Garden Report' },
];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  onReturnLanding,
  onSyncNow,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavClick = (tab: NavTab) => {
    onSelectTab(tab);
    setMobileOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F0]/92 backdrop-blur-md border-b border-[#344B38]/12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Single-line serif wordmark */}
        <button
          type="button"
          onClick={onReturnLanding}
          className="font-display text-xl font-semibold tracking-tight text-[#344B38] hover:text-[#556B4E] transition-colors whitespace-nowrap shrink-0 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#344B38] cursor-pointer"
        >
          Secret Garden
        </button>

        {/* Zone 2: Five clean single-line text links */}
        <nav
          aria-label="Main navigation"
          className="hidden md:flex items-center gap-7 text-sm font-medium text-[#344B38]/75"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1 whitespace-nowrap shrink-0 transition-colors cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#344B38] ${
                  isActive
                    ? 'text-[#344B38] font-semibold'
                    : 'text-[#344B38]/70 hover:text-[#344B38]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span
                    aria-hidden="true"
                    className="absolute left-0 right-0 -bottom-0.5 h-0.5 bg-[#8A9A75] rounded-full"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Single primary action button */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={onSyncNow}
            className="px-4 py-2 text-sm font-semibold text-[#FFF9F0] bg-[#344B38] hover:bg-[#27392A] active:scale-[0.99] rounded-lg transition-all whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#344B38]"
          >
            Synchronize
          </button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
            className="md:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg border border-[#344B38]/15 text-[#344B38] hover:bg-[#FAF2E4] transition-colors cursor-pointer"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile navigation drawer */}
      {mobileOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-[#344B38]/10 bg-[#FFF9F0] px-4 py-3 flex flex-col gap-1"
        >
          {NAV_ITEMS.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#344B38]/8 text-[#344B38] font-semibold'
                    : 'text-[#344B38]/75 hover:bg-[#FAF2E4]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
};
