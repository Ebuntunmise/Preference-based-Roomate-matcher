import { createClient } from '@supabase/supabase-js'

// This plugin runs once in the browser and makes the Supabase client
// available everywhere in the app via useNuxtApp().$supabase
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()

  const supabase = createClient(
    config.public.supabaseUrl as string,
    config.public.supabaseKey as string,
  )

  return {
    provide: {
      supabase,
    },
  }
})
