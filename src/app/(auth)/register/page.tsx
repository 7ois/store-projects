"use client";
import Dropdown from "@/components/Dropdown";
import Image from "next/image";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { registerSchema, registerSchemaType } from "@/lib/types";
import axios from "axios";
import building2 from "../../../../public/images/business2.jpg";
import logo_rmuti from "../../../../public/images/logo_rmuti.png";
import logo_main from "../../../../public/images/logo_main.jpg";

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
        }
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
          `${process.env.NEXT_PUBLIC_API_URL}/getRoles`
        );
        const formattedRoles = response.data.data
          .filter(
            (data: { role_id: number }) =>
              data.role_id === 2 || data.role_id === 3
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
          onClick={() => router.back()}
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
          สมัครสมาชิก
        </h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid w-full overflow-y-auto gap-3
          lg:gap-5"
        >
          <div className="grid gap-1 relative">
            <label htmlFor="email">อีเมล</label>
            <input
              {...register("email")}
              placeholder="กรอกอีเมลของคุณ"
              type="email"
              className="px-2 border border-[#c5c5c5] rounded-lg h-[40px]
              lg:h-[50px]"
            />
            {errors.email && (
              <p className="text-primary absolute -bottom-6 text-base">{`${errors.email.message}`}</p>
            )}
          </div>

          <div className="grid gap-1 relative">
            <label htmlFor="password">รหัสผ่าน</label>
            <input
              {...register("password")}
              placeholder="รหัสผ่าน"
              type="password"
              className="px-2 border border-[#c5c5c5] rounded-lg h-[40px]
              lg:h-[50px]"
            />
            {errors.password && (
              <p className="text-primary absolute -bottom-6 text-base">{`${errors.password.message}`}</p>
            )}
          </div>

          <div className="grid gap-1 relative">
            <label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</label>
            <input
              {...register("confirmPassword")}
              placeholder="ยืนยันรหัสผ่าน"
              type="password"
              className="px-2 border border-[#c5c5c5] rounded-lg h-[40px]
              lg:h-[50px]"
            />
            {errors.confirmPassword && (
              <p className="text-primary absolute -bottom-6 text-base">{`${errors.confirmPassword.message}`}</p>
            )}
          </div>

          {email ? (
            email.endsWith("@rmuti.ac.th") ? (
              <div
                className="grid grid-cols-2 w-full gap-1
                lg:gap-5"
              >
                <div className="grid gap-1 w-full relative">
                  <label>ชื่อ</label>
                  <input
                    {...register("first_name")}
                    placeholder='กรุณากรอก "ชื่อ"'
                    type="text"
                    className="px-2 w-full border border-[#c5c5c5] rounded-lg h-[40px]
                    lg:h-[50px]"
                  />
                  {errors.first_name && (
                    <p className="text-primary absolute -bottom-6 text-base">{`${errors.first_name.message}`}</p>
                  )}
                </div>

                <div className="grid gap-1 w-full relative">
                  <label>นามสกุล</label>
                  <input
                    {...register("last_name")}
                    placeholder='กรุณากรอก "นามสกุล"'
                    type="text"
                    className="px-2 w-full border border-[#c5c5c5] rounded-lg h-[40px]
                    lg:h-[50px]"
                  />
                  {errors.last_name && (
                    <p className="text-primary absolute -bottom-6 text-base">{`${errors.last_name.message}`}</p>
                  )}
                </div>

                <div className="grid relative">
                  <Dropdown
                    items={roles}
                    onSelect={handleRoleSelect}
                    labelName="ประเภทผู้ใช้"
                    classNameInput="h-[40px]"
                  />
                  {errors.role_id && (
                    <p className="text-primary absolute -bottom-6 text-base">{`${errors.role_id.message}`}</p>
                  )}
                </div>
              </div>
            ) : null
          ) : null}

          <div className="w-full flex items-center justify-center my-5">
            <button
              type="submit"
              className="bg-blue text-[#fff] w-[200px] h-[50px] border-[#c5c5c5] rounded-[10px] duration-75 hover:bg-orange"
            >
              สมัครสมาชิก
            </button>
          </div>
        </form>
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
