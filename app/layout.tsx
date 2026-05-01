import type { Metadata } from 'next';
import '@/app/globals.css';

export const metadata: Metadata = {
  title: 'Auth - Login & Sign Up',
  description: 'Secure authentication with login and sign up functionality',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}): React.ReactElement {
  return (
    <html lang="en">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
}