'use client';

import { useState, useEffect } from 'react';
import { Calendar, Heart } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n/I18nProvider';

export function FloatingConfirmButton() {
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const pathname = usePathname();
  const { t, locale } = useI18n();

  useEffect(() => {
    // Show button after a short delay for better UX
    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Hide the button if we're already on the confirmation page
  if (pathname === '/confirmation') {
    return null;
  }

  return (
    <div className={`w-floating-cta ${isVisible ? 'visible' : 'hidden'}`}>
      <Link href="/confirmation">
        <button
          className="group inline-flex items-center gap-3 px-6 py-4 rounded-full
          text-white font-semibold shadow-lg transition-all
          bg-[#FF7D59] hover:bg-[#ff6a40] focus:ring-2 focus:ring-offset-2 focus:ring-[#FF7D59]"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Icon with animation */}
          <div className="relative">
            <Heart className={`w-cta-icon transition-all duration-300 ${
              isHovered ? 'scale-110 text-pink-200' : 'text-white'
            }`} />
            {/* Pulse animation */}
            <div className="w-pulse-ring" />
          </div>

          {/* Text with slide animation */}
          <span className={`
            font-semibold text-lg whitespace-nowrap transition-all duration-300
            ${isHovered ? 'translate-x-1' : 'translate-x-0'}
          `}>
            {t('floating.confirm')}
          </span>

          {/* Arrow icon that appears on hover */}
          <div className={`
            transition-all duration-300 transform
            ${isHovered ? 'translate-x-0 opacity-100' : 'translate-x-2 opacity-0'}
          `}>
            <Calendar className="w-5 h-5" />
          </div>

          {/* Gradient overlay for extra shine */}
          <div className="w-shine" />
        </button>
      </Link>

      {/* Tooltip for extra context */}
      <div className={`w-tooltip ${isHovered ? 'visible' : 'hidden'}`}>
        {t('floating.tooltip')}
      </div>
    </div>
  );
}
