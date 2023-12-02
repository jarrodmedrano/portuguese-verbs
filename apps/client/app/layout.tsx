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
      <UserProvider>
        <body className="dark:bg-gray-700">
          <GoogleAnalytics />
          <PublicEnvProvider>{children}</PublicEnvProvider>
        </body>
      </UserProvider>
    </html>
  );
}
