'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils'; // opcional se vc usa esse helper

const NAV_ORDER = [
  { path: '/', label: 'Home' },
  { path: '/details', label: 'Detalhes' },
  { path: '/menu', label: 'Menu' },
  { path: '/message', label: 'Recados' },
  { path: '/confirmation', label: 'Confirmação' },
  { path: '/gifts', label: 'Presentes' },
] as const;

export default function NextPrevNav({
  className,
  showLabels = false,
}: { className?: string; showLabels?: boolean }) {
  const pathname = usePathname() || '/';
  const router = useRouter();

  // resolve índice atual (fallback para home se rota não constar)
  const { currentIndex, prev, next, isHome } = useMemo(() => {
    const idx = NAV_ORDER.findIndex(r => r.path === pathname);
    const i = idx === -1 ? 0 : idx;
    const len = NAV_ORDER.length;
    const prevIndex = (i - 1 + len) % len;
    const nextIndex = (i + 1) % len;

    return {
      currentIndex: i,
      prev: NAV_ORDER[prevIndex],
      next: NAV_ORDER[nextIndex],
      isHome: NAV_ORDER[i].path === '/',
    };
  }, [pathname]);

  // atalhos de teclado ← →
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') {
        router.push(next.path);
      }
      if (e.key === 'ArrowLeft') {
        if (!isHome) router.push(prev.path); // na home não volta
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [router, next.path, prev.path, isHome]);

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-x-0 top-20 z-40 flex items-center justify-between px-6',
        className
      )}
      aria-label="Navegação entre páginas"
    >
      {/* Seta esquerda (oculta na home) */}
      <div className="pointer-events-auto">
        {!isHome && (
          <Link
            href={prev.path}
            aria-label={`Ir para ${prev.label}`}
            className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)]/80 backdrop-blur px-3 py-2 text-sm text-foreground shadow-sm hover:bg-accent transition"
          >
            <ChevronLeft className="h-5 w-5" />
            {showLabels && <span>{prev.label}</span>}
          </Link>
        )}
      </div>

      {/* Indicador (opcional) */}
      {/* <div className="hidden sm:block text-xs text-muted-foreground select-none">
        {NAV_ORDER[currentIndex].label}
      </div> */}

      {/* Seta direita (sempre visível) */}
      <div className="pointer-events-auto">
        <Link
          href={next.path}
          aria-label={`Ir para ${next.label}`}
          className="inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--background)]/80 backdrop-blur px-3 py-2 text-sm text-foreground shadow-sm hover:bg-accent transition"
        >
          {showLabels && <span>{next.label}</span>}
          <ChevronRight className="h-5 w-5" />
        </Link>
      </div>
    </div>
  );
}