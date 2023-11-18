import { UserProvider } from '@auth0/nextjs-auth0/client';
import '../src/styles/global.css';

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
  {
    // eslint-disable-next-line no-console
    console.log('client id', process.env.AUTH0_CLIENT_ID);
  }

  return (
    <html lang="en">
      <UserProvider>
        <body className="dark:bg-gray-700">{children}</body>
      </UserProvider>
    </html>
  );
}
