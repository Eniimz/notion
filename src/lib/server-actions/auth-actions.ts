'use server'

import { z } from 'zod';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { FormSchema } from '../types';
import { cookies } from 'next/headers';
import { error } from 'console';

export async function actionLoginUser({
    email,
    password    
}: z.infer<typeof FormSchema>) {
 
    const supabase = createRouteHandlerClient({ cookies });

    const response = await supabase.auth.signInWithPassword({
        email, 
        password
    })


    console.log("The response from serveractions is: ", response)

    return response;
    
}

export async function actionSignUpUser({
    email,
    password
}: z.infer<typeof FormSchema>) {

    const supabase = createRouteHandlerClient({ cookies })

    const { data } = await supabase.from('profiles').select('*').eq('email', email)

    if(data?.length) return { error: { message: 'User already exists' }, data }

    const response = await supabase.auth.signUp({
        email,
        password,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}api/auth/callback`
        }
    })


    console.log("The data that is received from supabase: ", data)
    console.log("The response from the server actions is: ", response)

    return response;

}