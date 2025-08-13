'use client';

import Link from 'next/link';

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="border-t bg-background/95">
      {/* <div className="container py-8 px-4 md:px-6"> */}
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* <div className="space-y-3">
            <h3 className="text-lg font-medium">Luis Faria</h3>
            <p className="text-sm text-muted-foreground">
              Full-stack Software Engineer specialized in development with Python, TypeScript, React, Node.js, and modern web technologies.
            </p>
          </div> */}
          
          {/* <div className="space-y-3">
            <h3 className="text-sm font-medium">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/articles" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Articles
                </Link>
              </li>
              <li>
                <Link href="/chatbot" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Chatbot
                </Link>
              </li>
            </ul>
          </div> */}
              
          <div className="space-y-3">
            {/* <h3 className="text-sm font-medium">Local</h3> */}
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://share.google/ZwFctJ79ZDOMaaT1u" 
                  className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors"
                >
                  📍 Sweethearts Rooftop, Potts Point
                </a>
              </li>
              <li className="text-sm text-muted-foreground">
                 Level 3/33-35 Darlinghurst Rd, Potts Point NSW 2011
              </li>
            </ul>
          </div>
        </div>
        
        {/* <div className="mt-8 border-t pt-6">
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-xs text-muted-foreground">
              {currentYear} Luis Faria. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 sm:mt-0">
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div> */}
      </div>
    </footer>
  );
}