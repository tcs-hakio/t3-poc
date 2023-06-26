import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";
import SecretStuff from "./secretstuff";
import { useUser } from '@auth0/nextjs-auth0/client';


export default function Home() {
  const { user, error, isLoading } = useUser();
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <>
      <div className="flex border-b border-slate-400 p-4">
        
          <>
            <Head>
              <title>Log in to unlock secret stuffz</title>
              <meta name="description" content="Generated by create-t3-app" />
              <link rel="icon" href="/favicon.ico" />
            </Head>

          </> 
      </div>


      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        { !user && (<a href="/api/auth/login" className="text-cyan-600">Login</a>) }
        { user && (<a href="/api/auth/logout" className="text-cyan-600">Logout</a>) }
      </main>
    </>
  );
}
