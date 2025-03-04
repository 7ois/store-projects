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

  const handleLogin = async (e: any) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/login`,
        {
          email: formData.email,
          password: formData.password,
        }
      );
      const redirectTo =
        sessionStorage.getItem("redirectTo") || "/project_center";
      sessionStorage.removeItem("redirectTo");
      localStorage.setItem("token", response.data.token);
      router.push(redirectTo);
      // router.push("/project_center");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="w-full h-[900px] flex rounded-[10px] overflow-hidden shadow-lg">
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
        <h1 className="text-5xl my-5 font-[400]">เข้าสู่ระบบ</h1>
        <form onSubmit={handleLogin} className="grid gap-5 w-full text-2xl">
          <div className="grid gap-2">
            <label className="text-xl">อีเมล</label>
            <input
              type="email"
              name="email"
              className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
              placeholder="กรอกอีเมล"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xl">รหัสผ่าน</label>
            <input
              type="password"
              name="password"
              className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
              placeholder="กรอกรหัสผ่าน"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="w-full flex items-center justify-center my-5">
            <button
              type="submit"
              className="bg-blue text-[#fff] w-[200px] h-[60px] border rounded-[10px] transition duration-75 hover:bg-orange"
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

      <div className="w-full bg-blue text-[#fff] relative">
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
