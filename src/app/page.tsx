'use client'
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function Home() {
  const { data: session,status } = useSession();
  useEffect(()=>{



    console.log('Session data:', session?.user);

  },[session])
  if(status == "loading")return <div>loading</div>;
  return (
    <>
    <div>{session?.user?.name || 'Not logged in'}</div>
    <button>get messages</button>
    {/* add a button to generate all the messages */}
    </>
  );
}
