"use client";
import axios from "axios";
// import { useAuthStore } from '@/stores/authStore'
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import logo_rmuti from "../../../../public/images/logo_rmuti.png";
import building1 from "../../../../public/images/business1.jpg";
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

      localStorage.setItem("token", response.data.token);
      router.push("/project_center");
    } catch {
      alert("Login failed");
    }
  };

  return (
    <div className="w-full h-[800px] flex rounded-[10px] overflow-hidden shadow-lg">
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
        <h1 className="text-5xl my-5">Log In</h1>
        <form onSubmit={handleLogin} className="grid gap-5 w-full text-2xl">
          <div className="grid gap-2">
            <label className="text-xl">Email</label>
            <input
              type="email"
              name="email"
              className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
              placeholder="Enter email."
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <label className="text-xl">Password</label>
            <input
              type="password"
              name="password"
              className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
              placeholder="Enter password."
              value={formData.password}
              onChange={handleChange}
            />
          </div>
          {/* <div className="text-base cursor-pointer">
            <p>For get Password ?</p>
          </div> */}
          <div className="w-full flex items-center justify-center my-5">
            <button
              type="submit"
              className="bg-blue text-[#fff] w-[200px] h-[60px] border rounded-[10px] transition delay-75 hover:bg-orange"
            >
              Log in
            </button>
          </div>
        </form>
        <div
          className="cursor-pointer"
          onClick={() => router.push("/register")}
        >
          <p>You are not a member yet?</p>
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
