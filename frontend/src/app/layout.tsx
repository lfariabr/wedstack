import type { Metadata } from "next";
import { Playfair_Display } from "next/font/google";
import { Alex_Brush } from "next/font/google";
import "./globals.css";
import { ApolloProvider } from "@/lib/apollo/ApolloProvider";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { Toaster } from "@/components/ui/toaster";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import { defaultMetadata } from "./metadata";
import DynamicBackground from "@/components/DynamicBackground";
import { I18nProvider } from "@/lib/i18n/I18nProvider";

const playfairDisplay = Playfair_Display({ 
  subsets: ["latin"], 
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
  display: "swap"
});

// Global Alex Brush for titles (CSS variable for reuse)
const alexBrush = Alex_Brush({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-alex-brush",
  display: "swap",
});

export const metadata: Metadata = {
  ...defaultMetadata,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${playfairDisplay.variable} ${alexBrush.variable} font-serif antialiased theme-wedding`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ApolloProvider>
            <AuthProvider>
              <GoogleAnalytics />
              <I18nProvider>
                <DynamicBackground>
                  {children}
                </DynamicBackground>
              </I18nProvider>
              <Toaster />
            </AuthProvider>
          </ApolloProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}