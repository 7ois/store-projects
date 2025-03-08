"use client";
import axios from "axios";
// import { useAuthStore } from '@/stores/authStore'
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import logo_rmuti from "../../../../public/images/logo_rmuti.png";
import building2 from "../../../../public/images/business2.jpg";

const Page = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((e) => ({
      ...e,
      [name]: value,
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );

      let redirectTo =
        sessionStorage.getItem("redirectTo") || "/project_center";

      // ป้องกัน redirectTo เป็น undefined หรือค่าที่ไม่ถูกต้อง
      if (typeof redirectTo !== "string" || !redirectTo.startsWith("/")) {
        redirectTo = "/project_center";
      }

      localStorage.setItem("token", response.data.token);
      sessionStorage.removeItem("redirectTo");
      router.push(redirectTo);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert("บัญชีถูกระงับ");
        }
      }
    }
  };

  return (
    <div className="w-full h-[900px] flex rounded-[10px] overflow-hidden shadow-lg text-lg">
      <div className="relative w-full bg-[#fff] flex flex-col justify-center items-center gap-2 p-20">
        <div
          className="absolute top-5 left-5 cursor-pointer"
          onClick={() => router.push("/project_center")}
        >
          <ArrowLeft size={25} color="#1C3B6C" />
        </div>
        <Image
          src="/images/logo_main.jpg"
          alt="Logo"
          width={150}
          height={150}
        />
        <h1 className="text-3xl my-5 font-[400]">เข้าสู่ระบบ</h1>
        <form onSubmit={handleLogin} className="grid gap-5 w-full">
          <div className="grid gap-2">
            <label>อีเมล</label>
            <input
              type="email"
              name="email"
              className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg"
              placeholder="กรอกอีเมล"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <label>รหัสผ่าน</label>
            <input
              type="password"
              name="password"
              className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg"
              placeholder="กรอกรหัสผ่าน"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="w-full flex items-center justify-center my-5">
            <button
              type="submit"
              className="bg-blue text-white w-[200px] h-[60px] border rounded-[10px] transition duration-75 hover:bg-orange"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </form>
        <div
          className="cursor-pointer h-fit border-b-[1px] border-orange text-orange"
          onClick={() => router.push("/register")}
        >
          <p>คุณยังไม่ได้เป็นสมาชิก?</p>
        </div>
      </div>

      <div className="w-full bg-blue text-white relative">
        <Image
          src={building2}
          alt="ตึกบริหาร"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white w-full flex items-center justify-center">
          <Image src={logo_rmuti} alt="Logo" />
        </div>
      </div>
    </div>
  );
};

export default Page;
