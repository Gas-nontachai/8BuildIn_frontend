"use client";
import { getAccessToken } from '@/context/AuthContext';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    setAccessToken(token);

    if (!token) {
      router.push("/login");
    }
  }, [router]);

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl font-bold mb-4">Hello World !!</h1>
      </div>
    </>
  );
};

export default Page;
