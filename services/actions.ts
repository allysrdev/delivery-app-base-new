"use server"

import { signIn } from "@/auth";


export async function doSocialLoginWithGoogle(redirectUrl: string) {
    await signIn('google', { redirectTo: redirectUrl});

}

