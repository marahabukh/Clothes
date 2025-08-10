import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Automatically navigate to /Home when the component mounts
    router.push('/Authpage/login');
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
   
    </main>
  );
}