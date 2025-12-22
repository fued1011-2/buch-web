import type { ReactNode } from 'react';
import { Providers } from '../components/Providers';
import { AppShell } from '../components/AppShell';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}
