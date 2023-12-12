import { UserProvider } from '@auth0/nextjs-auth0/client';
import '../src/styles/global.css';
import { PublicEnvProvider } from 'next-runtime-env';

import { Metadata } from 'next';
import GoogleAnalytics from './GoogleAnalytics';

export const metadata: Metadata = {
  title: 'Conjugame!',
  description: 'Test your knowledge of conjugation',
};

export default function RootLayout({
  // Layouts must accept a children prop.
  // This will be populated with nested layouts or pages
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5" />
      <meta name="msapplication-TileColor" content="#da532c" />
      <meta name="theme-color" content="#ffffff" />
      <UserProvider>
        <body className="dark:bg-gray-700">
          <GoogleAnalytics />
          <PublicEnvProvider>{children}</PublicEnvProvider>
        </body>
      </UserProvider>
    </html>
  );
}
