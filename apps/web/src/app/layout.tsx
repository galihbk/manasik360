import React from 'react';
import './globals.css';

export const metadata = {
  title: 'Bahrain International - Enterprise Training Platform',
  description: 'Enterprise training platform for international packages',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div id="root-app">{children}</div>
      </body>
    </html>
  );
}
