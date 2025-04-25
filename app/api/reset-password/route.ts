import { database } from "@/services/firebase";
import { updateUserPasswordInDatabase } from "@/services/userService";
import { get, ref, remove } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { token, password } = await req.json();

    if (!token || !password) {
        return NextResponse.json({
            error: "Token and password are required"
        }, {
            status: 400
        })
    }

    const tokenRef = ref(database, `resetTokens/${token}`)
    const tokenSnap = await get(tokenRef)

    if (!tokenSnap.exists()) {
        return NextResponse.json({
            error: "Invalid or expired token"
        }, {
            status: 400

        })
    }
    
    const { email, expires } = tokenSnap.val();

    if (Date.now() > expires) {
        await remove(tokenRef)
        return NextResponse.json({
            error: "Token expired"
        }, {
            status: 400
        })
    }

    await updateUserPasswordInDatabase(email, password)
    await remove(tokenRef)

    return NextResponse.json({
        message: "Senha redefinida com sucesso!"
    })
}

    