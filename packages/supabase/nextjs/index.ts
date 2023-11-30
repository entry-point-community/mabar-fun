import {
  createPagesBrowserClient,
  createPagesServerClient,
} from '@supabase/auth-helpers-nextjs';

import { env } from '../env';

export * from '@supabase/supabase-js';

export const supabaseClient = createPagesBrowserClient({
  supabaseKey: env.NEXT_PUBLIC_SUPABASE_KEY,
  supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
});

export const supabaseServerClient = (context: any) => {
  return createPagesServerClient(context, {
    supabaseKey: env.NEXT_PUBLIC_SUPABASE_KEY,
    supabaseUrl: env.NEXT_PUBLIC_SUPABASE_URL,
  });
};
