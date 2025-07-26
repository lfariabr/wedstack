import { Metadata } from 'next'

const siteUrl = 'https://luisfaria.dev'

export const defaultMetadata: Metadata = {
  title: 'Wedding N+L',
  description: 'Wedstack for Nana + Luis wedding. Lets go!',
  metadataBase: new URL(siteUrl),
  alternates: {
    canonical: siteUrl,
  },
  openGraph: {
    title: 'Wedstack',
    description: 'Wedstack for Nana + Luis wedding. Lets go!',
    url: siteUrl,
    siteName: 'Luis Faria',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wedstack',
    description: 'Wedstack for Nana + Luis wedding. Lets go!',
    creator: '@luisfariabr',
  },
}