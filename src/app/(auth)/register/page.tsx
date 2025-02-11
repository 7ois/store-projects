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

const Page = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    getValues,
    setValue,
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
      // ถ้ามีข้อผิดพลาดในการสมัคร
      console.error("Error during registration:", error);
      alert("Submitting form failed");
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
      } catch (error) {
        console.error("Error fetching roles:", error);
      }
    };

    fetchRoles();
  }, []);

  const handleRoleSelect = (value: number) => {
    setValue("role_id", value);
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
        <h1 className="text-5xl my-5">Register</h1>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-5 w-full text-2xl"
        >
          <div className="grid gap-1">
            <label htmlFor="email" className="text-xl">
              Email
            </label>
            <input
              {...register("email")}
              type="email"
              className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
            />
            {errors.email && (
              <p className="text-primary text-base">{`${errors.email.message}`}</p>
            )}
          </div>

          <div className="grid gap-1">
            <label htmlFor="password" className="text-xl">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
            />
            {errors.password && (
              <p className="text-primary text-base">{`${errors.password.message}`}</p>
            )}
          </div>

          <div className="grid gap-1">
            <label htmlFor="confirmPassword" className="text-xl">
              Confirm Password
            </label>
            <input
              {...register("confirmPassword")}
              type="password"
              className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
            />
            {errors.confirmPassword && (
              <p className="text-primary text-base">{`${errors.confirmPassword.message}`}</p>
            )}
          </div>

          {email ? (
            email.endsWith("@rmuti.ac.th") ? (
              <div className={`grid grid-cols-2 gap-5 w-full`}>
                <div className="grid gap-1 w-full">
                  <label className="text-xl">Firstname</label>
                  <input
                    {...register("first_name")}
                    type="text"
                    className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
                  />
                  {errors.first_name && (
                    <p className="text-primary text-base">{`${errors.first_name.message}`}</p>
                  )}
                </div>

                <div className="grid gap-1 w-full">
                  <label className="text-xl">Lastname</label>
                  <input
                    {...register("last_name")}
                    type="text"
                    className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
                  />
                  {errors.last_name && (
                    <p className="text-primary text-base">{`${errors.last_name.message}`}</p>
                  )}
                </div>

                <div className="grid">
                  <Dropdown
                    items={roles}
                    onSelect={handleRoleSelect}
                    labelName="Role"
                  />
                  {errors.role_id && (
                    <p className="text-primary text-base">{`${errors.role_id.message}`}</p>
                  )}
                </div>
              </div>
            ) : null
          ) : null}

          <div className="w-full flex items-center justify-center my-5">
            <button
              type="submit"
              className="bg-blue text-[#fff] w-[200px] h-[60px] border border-[#c5c5c5] rounded-[10px]"
            >
              Register
            </button>
          </div>
        </form>
      </div>

      <div className="w-full bg-blue text-[#fff]">
        <h1>Image</h1>
      </div>
    </div>
  );
};

export default Page;
