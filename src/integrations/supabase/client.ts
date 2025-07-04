import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const supabaseUrl = 'https://gtjcihxiomhagtperlzx.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0amNpaHhpb21oYWd0cGVybHp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY1NDE1OTIsImV4cCI6MjA2MjExNzU5Mn0.XgP52r7d795RzMkf4kLXFIkZOmo0fj5jx3nWMNGiMTo';

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);