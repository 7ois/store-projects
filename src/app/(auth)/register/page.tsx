"use client";
import Dropdown from "@/components/Dropdown";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { registerSchema, registerSchemaType } from "@/lib/types";
import axios from "axios";
import building2 from "../../../../public/images/business2.jpg";
import logo_rmuti from "../../../../public/images/logo_rmuti.png";

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
    setValue,
    clearErrors,
    watch,
  } = useForm<registerSchemaType>({
    resolver: zodResolver(registerSchema),
  });
  const router = useRouter();

  const email = watch("email");
  const [roles, setRoles] = useState<{ id: number; value: string }[]>([]);

  const onSubmit = async (data: registerSchemaType) => {
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (response.status === 200) {
        alert("Register successful");
        reset();
        router.push("/login");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          setError("email", {
            type: "manual",
            message: "อีเมลนี้มีอยู่ในระบบแล้ว",
          });
        }
      }
    }
  };

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getRoles`,
        );
        const formattedRoles = response.data.data
          .filter(
            (data: { role_id: number }) =>
              data.role_id === 2 || data.role_id === 3,
          )
          .map((item: { role_id: number; role_name: string }) => ({
            id: item.role_id,
            value: item.role_name,
          }));
        setRoles(formattedRoles);
        setValue("role_id", 4);
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleRoleSelect = (value: number) => {
    setValue("role_id", value || 4);
    clearErrors("role_id");
  };

  return (
    <div className="w-full h-[900px] flex rounded-[10px] overflow-hidden shadow-lg">
      <div className="relative w-full bg-[#fff] flex flex-col justify-center items-center gap-2 px-20 py-5">
        <div
          className="absolute top-5 left-5 cursor-pointer"
          onClick={() => router.back()}
        >
          <ArrowLeft size={25} color="#1C3B6C" />
        </div>
        <Image
          src="/images/logo_main.jpg"
          alt="Logo"
          width={150}
          height={150}
        />
        <h1 className="text-5xl my-5 font-[400]">สมัครสมาชิก</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 w-full text-2xl"
        >
          <div className="grid gap-1 relative">
            <label htmlFor="email" className="text-xl">
              อีเมล
            </label>
            <input
              {...register("email")}
              placeholder="กรอกอีเมลของคุณ"
              type="email"
              className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
            />
            {errors.email && (
              <p className="text-primary text-base absolute -bottom-6">{`${errors.email.message}`}</p>
            )}
          </div>

          <div className="grid gap-1 relative">
            <label htmlFor="password" className="text-xl">
              รหัสผ่าน
            </label>
            <input
              {...register("password")}
              placeholder="รหัสผ่าน"
              type="password"
              className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
            />
            {errors.password && (
              <p className="text-primary text-base absolute -bottom-6">{`${errors.password.message}`}</p>
            )}
          </div>

          <div className="grid gap-1 relative">
            <label htmlFor="confirmPassword" className="text-xl">
              ยืนยันรหัสผ่าน
            </label>
            <input
              {...register("confirmPassword")}
              placeholder="ยืนยันรหัสผ่าน"
              type="password"
              className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
            />
            {errors.confirmPassword && (
              <p className="text-primary text-base absolute -bottom-6">{`${errors.confirmPassword.message}`}</p>
            )}
          </div>

          {email ? (
            email.endsWith("@rmuti.ac.th") ? (
              <div className={`grid grid-cols-2 gap-5 w-full`}>
                <div className="grid gap-1 w-full relative">
                  <label className="text-xl">ชื่อ</label>
                  <input
                    {...register("first_name")}
                    placeholder='กรุณากรอก "ชื่อ"'
                    type="text"
                    className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
                  />
                  {errors.first_name && (
                    <p className="text-primary text-base absolute -bottom-6">{`${errors.first_name.message}`}</p>
                  )}
                </div>

                <div className="grid gap-1 w-full relative">
                  <label className="text-xl">นามสกุล</label>
                  <input
                    {...register("last_name")}
                    placeholder='กรุณากรอก "นามสกุล"'
                    type="text"
                    className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
                  />
                  {errors.last_name && (
                    <p className="text-primary text-base absolute -bottom-6">{`${errors.last_name.message}`}</p>
                  )}
                </div>

                <div className="grid relative">
                  <Dropdown
                    items={roles}
                    onSelect={handleRoleSelect}
                    labelName="ประเภทผู้ใช้"
                  />
                  {errors.role_id && (
                    <p className="text-primary text-base absolute -bottom-6">{`${errors.role_id.message}`}</p>
                  )}
                </div>
              </div>
            ) : null
          ) : null}

          <div className="w-full flex items-center justify-center my-5">
            <button
              type="submit"
              className="bg-blue text-[#fff] w-[200px] h-[60px] border-[#c5c5c5] rounded-[10px] duration-75 hover:bg-orange"
            >
              สมัครสมาชิก
            </button>
          </div>
        </form>
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
