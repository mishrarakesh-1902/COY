import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Coy • Discover',
  description: 'Confidential crush & mutual discovery experience for Coy',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  themeColor: '#090a0f',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex justify-center items-center">
        {/* Mobile viewport container frame */}
        <div className="w-full max-w-md h-[100dvh] flex flex-col bg-[#0d101a] shadow-2xl relative overflow-hidden sm:border-x sm:border-slate-800">
          {children}
        </div>
      </body>
    </html>
  );
}
