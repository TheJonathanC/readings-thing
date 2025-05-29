import type { Metadata } from 'next';
    import './globals.css';

    export const metadata: Metadata = {
      title: 'Catholic Daily',
      description: 'Daily Bible Readings and Rosary Mysteries',
    };

    export default function RootLayout({
      children,
    }: {
      children: React.ReactNode;
    }) {
      return (
        <html lang="en">
          <body>{children}</body>
        </html>
      );
    }
