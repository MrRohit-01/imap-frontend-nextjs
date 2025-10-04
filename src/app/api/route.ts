import axios from "axios";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from "next/server";

export async function GET(){
    const session = await getServerSession(authOptions);
    console.log(session?.accessToken);
    console.log(session?.user?.email);
   const res = await axios.get(`${process.env.BASEURL_BACKEND}/messages`,
        {
        params:{
        User: session?.user?.email
    }, 
        headers: {
            'Authorization':"Bearer " + session?.accessToken
        }
    });
    return NextResponse.json(res.data);
}