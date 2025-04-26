import { database } from "@/services/firebase";
import { updateUserPasswordInDatabase } from "@/services/userService";
import { get, ref, remove } from "firebase/database";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const { token, password } = await req.json();

    if (!token || !password) {
        return NextResponse.json({
            error: "Token e senha são obrigatórios!"
        }, {
            status: 400
        })
    }

    const tokenRef = ref(database, `resetTokens/${token}`)
    const tokenSnap = await get(tokenRef)

    if (!tokenSnap.exists()) {
        return NextResponse.json({
            error: "Token inválido ou expirado!"
        }, {
            status: 400

        })
    }
    
    const { email, expires } = tokenSnap.val();

    if (Date.now() > expires) {
        await remove(tokenRef)
        return NextResponse.json({
            error: "Token expirado!"
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

    