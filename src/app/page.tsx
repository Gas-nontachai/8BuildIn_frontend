"use client";
import { getAccessToken } from '@/context/AuthContext';
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

const Page = () => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  useEffect(() => {
    const token = getAccessToken();
    setAccessToken(token);
  }, []);

  useEffect(() => {
    if (!accessToken) {
      Swal.fire({
        icon: "warning",
        title: "Unauthorized",
        text: "กรุณาเข้าสู่ระบบก่อน!",
        showConfirmButton: false,
        timer: 1500,
      }).then(() => {
        router.push("/login");
      });
    }
  }, [accessToken, router]);

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl font-bold mb-4">Hello World !!</h1>
      </div>
    </>
  );
};

export default Page;
