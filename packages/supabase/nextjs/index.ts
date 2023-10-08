import { createClient } from '@supabase/supabase-js';

import { env } from '../env';

export const supabaseClient = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_KEY,
  {
    auth: {
      storageKey: 'sb-auth',
    },
  },
);
