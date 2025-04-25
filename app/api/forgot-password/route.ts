import { sendEmail } from '@/lib/resend';
import { database } from '@/services/firebase';
import { getUser } from '@/services/userService';
import { ref, set } from 'firebase/database';
import { NextResponse, NextRequest } from 'next/server';
import { v4 as uuidv4 } from 'uuid';



export async function POST(req: NextRequest) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({
            error: "Email is required"
        }, {
            status: 400
        })
    }

    const user = await getUser(email)
    if (!user) {
        return NextResponse.json({
            error: "User not found"
        }, {
            status: 404
        })
    }

    const token = uuidv4()
    const expires = Date.now() + 1000 * 60 * 15 // 15 minutos

    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`

    await set(ref(database, `resetTokens/${token}`), {
        email: user.email,
        expires,

    })

    await sendEmail(user.email, resetLink)

    return NextResponse.json({
        message: "Reset link sent to your email"
    })
}