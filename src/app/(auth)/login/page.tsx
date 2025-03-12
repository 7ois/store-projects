"use client";
import axios from "axios";
// import { useAuthStore } from '@/stores/authStore'
import { ArrowLeft, ChevronLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import logo_rmuti from "../../../../public/images/logo_rmuti.png";
import building2 from "../../../../public/images/business2.jpg";
import logo_main from "../../../../public/images/logo_main.jpg";

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
        const errorMessage = error.response?.data?.error;

        if (errorMessage === "This account has been deleted") {
          alert("บัญชีถูกระงับ");
        } else if (errorMessage === "Invalid data") {
          alert("กรุณาสมัครสมาชิก");
        } else if (errorMessage === "Invalid email or password") {
          alert("อีเมล หรือ รหัสผ่าน ผิดกรุณาตรวจสอบ");
        } else {
          alert("เกิดข้อผิดพลาดในการล็อกอิน กรุณาลองอีกครั้ง");
        }
      } else {
        alert("เกิดข้อผิดพลาดในการล็อกอิน กรุณาลองอีกครั้ง");
      }
    }
  };

  return (
    <div
      className="w-full h-[600px] flex rounded-[10px] overflow-hidden shadow-lg text-base
      lg:text-lg lg:h-[900px]"
    >
      <div
        className="relative w-full bg-[#fff] flex flex-col justify-center items-center p-5 gap-1
        lg:p-10 lg:gap-2
        2xl:p-20"
      >
        <div
          className="absolute top-5 left-5 cursor-pointer"
          onClick={() => router.push("/project_center")}
        >
          <ChevronLeft size={20} strokeWidth={1.5} />
        </div>
        <Image
          src={logo_main}
          alt="Logo"
          className="w-full h-auto max-w-[100px] lg:max-w-[150px]" // ปรับขนาดให้ responsive
        />

        <h1
          className="my-5 font-[400] text-xl
          lg:text-3xl"
        >
          เข้าสู่ระบบ
        </h1>
        <form
          onSubmit={handleLogin}
          className="grid w-full gap-3
          lg:gap-5"
        >
          <div
            className="grid gap-1
            lg:gap-2"
          >
            <label>อีเมล</label>
            <input
              type="email"
              name="email"
              className="h-[40px] pl-2 border border-[#c5c5c5] rounded-lg
              lg:h-[50px]"
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
              className="h-[40px] pl-2 border border-[#c5c5c5] rounded-lg
              lg:h-[50px]"
              placeholder="กรอกรหัสผ่าน"
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          <div className="w-full flex items-center justify-center my-5">
            <button
              type="submit"
              className="bg-blue text-white w-[200px] h-[50px] border rounded-[10px] transition duration-75 hover:bg-orange"
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

      <div className="w-full bg-blue text-white relative hidden 2xl:block">
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
