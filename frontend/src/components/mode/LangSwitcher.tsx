'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function LangSwitcher() {
  const pathname = usePathname() || '/en';
  const search = useSearchParams();

  const seg = pathname.split('/'); // ["", "en", "details", ...]
  const currentLocale = seg[1] === 'pt' ? 'pt' : 'en';
  const otherLocale = currentLocale === 'en' ? 'pt' : 'en';

  // mantém a rota atual e troca só o locale
  const newPath = ['/', otherLocale, ...seg.slice(2)].join('');
  const qs = search.toString();
  const href = qs ? `${newPath}?${qs}` : newPath;

  const flag = otherLocale === 'en' ? '/us.svg' : '/br.svg';

  return (
    <div className="fixed top-4 right-4 z-50">
      <Link href={href} aria-label={`Switch to ${otherLocale}`}>
        <Image
          src={flag}
          alt={`${otherLocale} flag`}
          width={32}
          height={32}
          className="cursor-pointer hover:scale-110 transition"
        />
      </Link>
    </div>
  );
}