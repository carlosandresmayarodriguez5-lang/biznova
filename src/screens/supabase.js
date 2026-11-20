import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://oedaugezsvkwiifrspre.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_kcxdLvsV_7IMnC3Bk9gSbg_72Hsri7B'; // Copia tu Publishable key completa de Supabase

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);