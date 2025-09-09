'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoonIcon, SunIcon, MenuIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';
import LangSwitcher from '@/components/mode/LangSwitcher';
import { useI18n } from '@/lib/i18n/I18nProvider';

const navigation = [
  { key: 'details', href: '/details' },
  { key: 'menu', href: '/menu' },
  { key: 'message', href: '/message' },
  { key: 'gifts', href: '/gifts' },
  { key: 'confirmation', href: '/confirmation' },
  { key: 'memoryLane', href: '/memory-lane' },
];

export function Header() {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* <div className="container px-4 sm:px-6 lg:px-8 flex h-16 items-center justify-between"> */}
      <div className="w-full px-4 sm:px-6 lg:px-12 flex h-16 items-center justify-between">
      <div className="flex items-center gap-4 md:gap-8">
          <Link href="/" className="flex items-center space-x-2">
            <span className="inline-block font-bold text-xl text-[#FF7D59]">N&G</span>
          </Link>
          <nav className="hidden md:flex gap-6">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-foreground/80',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>
        </div>
        <LangSwitcher />
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <MenuIcon className="h-6 w-6" />
          </Button>
        </div>
      </div>
      
      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden py-2 px-4 bg-background border-b">
          <nav className="flex flex-col space-y-3">
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-foreground/80 py-1',
                  pathname === item.href
                    ? 'text-foreground'
                    : 'text-foreground/60'
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t(`nav.${item.key}`)}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}