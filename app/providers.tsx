"use client";

import { NextUIProvider } from "@nextui-org/react";
import { SWRConfig } from 'swr';
import ErrorBoundary from "@components/ErrorBoundary";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <NextUIProvider>
      <SWRConfig value={{
        fetcher: (url: string) => fetch(url, {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json'
          }
        }).then(res => {
          if (!res.ok) throw new Error('API Error');
          return res.json();
        }),
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
      }}>
        <ErrorBoundary>{children}</ErrorBoundary>
      </SWRConfig>
    </NextUIProvider>
  );
}
