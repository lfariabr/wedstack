import { Metadata } from 'next'

const siteUrl = 'https://weddingln.com'

export const defaultMetadata: Metadata = {
  title: 'Casamento Naná & Guizo',
  description: 'Junte-se a nós para celebrar um dia inesquecível!',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Casamento Naná & Guizo',
    description: 'Junte-se a nós para celebrar um dia inesquecível!',
    url: siteUrl,
    siteName: 'Casamento Naná & Guizo',
    locale: 'pt_BR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Casamento Naná & Guizo',
    description: 'Junte-se a nós para celebrar um dia inesquecível!',
    creator: '@lfariabr',
  },
}