import '~/styles/globals.css';

import { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { Inter, Poppins } from 'next/font/google';
import Head from 'next/head';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { QueryClientProvider } from '@tanstack/react-query';
import { ApiClientProvider } from '@v6/api';
import { supabaseClient as supabase } from '@v6/supabase/nextjs';
import { Toaster } from 'sonner';

import { Footer } from '~/components/elements/Footer';
import { Header } from '~/components/elements/Header';
import { ThemeProvider } from '~/components/providers/theme-provider';
import { AxiosManager } from '~/lib/axios';
import { queryClient } from '~/lib/react-query';
import { useStore } from '~/store';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

const axiosManager = new AxiosManager();

export default function App({ Component, pageProps }: AppProps) {
  const { onAuthSuccess, onLogout } = useStore();

  const [supabaseClient] = useState(() => supabase);

  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        onAuthSuccess({
          accessToken: session?.access_token,
          user: session?.user,
        });
      }
    });

    const {
      data: { subscription },
    } = supabaseClient.auth.onAuthStateChange((_event, session) => {
      if (session) {
        onAuthSuccess({
          accessToken: session?.access_token,
          user: session?.user,
        });

        return;
      }

      onLogout();
    });

    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <style
        jsx
        global
      >{`:root { --font-inter: ${inter.style.fontFamily};}}`}</style>
      <SessionContextProvider
        supabaseClient={supabaseClient}
        initialSession={pageProps.initialSession}
      >
        <ApiClientProvider axiosInstance={axiosManager.axios}>
          <QueryClientProvider client={queryClient}>
            <Head>
              <title>V6 Academy - Learn to Code the Practical Way</title>
            </Head>
            <ThemeProvider attribute="class" forcedTheme="dark">
              <main
                className={`${inter.variable} ${poppins.variable} font-sans`}
              >
                <Header />
                <Component {...pageProps} />
                <Footer />
                <Toaster richColors />
              </main>
            </ThemeProvider>
          </QueryClientProvider>
        </ApiClientProvider>
      </SessionContextProvider>
    </>
  );
}
