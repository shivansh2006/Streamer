import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from '@/components/Navbar'
import { PreferencesProvider } from '@/components/providers/PreferencesProvider'

export const metadata: Metadata = {
  title: 'StreamParadise - Watch Movies & TV Shows Online',
  description: 'Premium streaming platform with instant playback and multiple servers'
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Block popup/redirect attempts
              (function() {
                const originalOpen = window.open;
                window.open = function(url, target, features) {
                  // Only allow opens from user interactions on same origin
                  const stack = new Error().stack;
                  if (stack && !stack.includes('user-interaction')) {
                    console.warn('[Popup Blocked]:', url);
                    return null;
                  }
                  return originalOpen.call(this, url, target, features);
                };
                
                // Block navigation attempts
                let userInteracted = false;
                ['click', 'touchstart', 'keydown'].forEach(event => {
                  window.addEventListener(event, () => { userInteracted = true; }, true);
                });
                
                window.addEventListener('beforeunload', (e) => {
                  if (!userInteracted) {
                    e.preventDefault();
                    e.returnValue = '';
                  }
                });
              })();
            `,
          }}
        />
      </head>
      <body className="min-h-screen">
        <PreferencesProvider>
          <Navbar />
          <main className="pt-16 pb-8">{children}</main>
        </PreferencesProvider>
      </body>
    </html>
  )
}
