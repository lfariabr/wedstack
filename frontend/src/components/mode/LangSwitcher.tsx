'use client';

import { Suspense } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/I18nProvider';

function LangSwitcherContent() {
  const pathname = usePathname() || '/en';
  const search = useSearchParams();

  const seg = pathname.split('/'); // ["", "en", "details", ...]

  // Updating to use I18n - oldest version was replaced by line 24---30
  // const currentLocale = seg[1] === 'pt' ? 'pt' : 'en';
  // const otherLocale = currentLocale === 'en' ? 'pt' : 'en';
  // // mantém a rota atual e troca só o locale
  // const newPath = ['/', otherLocale, ...seg.slice(2)].join('');
  // const qs = search.toString();
  // const href = qs ? `${newPath}?${qs}` : newPath;

  // const flag = otherLocale === 'en' ? '/us.svg' : '/br.svg';
  const { locale, setLocale } = useI18n();
  const otherLocale = locale === 'en' ? 'pt' : 'en';
  const flag = otherLocale === 'en' ? '/us.svg' : '/br.svg';

  // return (
  //   <div className="fixed top-4 right-4 z-50">
  //     <Link href={href} aria-label={`Switch to ${otherLocale}`}>
  //       <Image
  //         src={flag}
  //         alt={`${otherLocale} flag`}
  //         width={32}
  //         height={32}
  //         className="cursor-pointer hover:scale-110 transition"
  //       />
  //     </Link>
  //   </div>

  return (
    <button
      type="button"
      onClick={() => setLocale(otherLocale)}
      aria-label={`Switch to ${otherLocale}`}
      className="inline-flex items-center justify-center rounded-full p-1 hover:scale-110 transition"
    >
      <img 
        src={flag} 
        alt={`${otherLocale} flag`} 
        width={28} 
        height={28} 
        className="cursor-pointer hover:scale-110 transition"
      />
    </button>
  );
}

export default function LangSwitcher() {
  return (
    <Suspense fallback={<div className="fixed top-4 right-4 z-50 w-8 h-8" />}>
      <LangSwitcherContent />
    </Suspense>
  );
}