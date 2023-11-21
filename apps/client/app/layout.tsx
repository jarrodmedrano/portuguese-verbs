import { UserProvider } from '@auth0/nextjs-auth0/client';
import '../src/styles/global.css';
import { PublicEnvProvider } from 'next-runtime-env';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'Welcome to Next.js',
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
          <PublicEnvProvider>{children}</PublicEnvProvider>
        </body>
      </UserProvider>
    </html>
  );
}
