import axios from "axios";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";

export async function GET(){
    const session = await getServerSession();
   return await axios.get(`${process.env.BASEURL_BACKEND}/messages`,
        {
        params:{
        User: session?.user
    }, 
        headers: {
            'Authorization': session?.accessToken
        }
    });
}