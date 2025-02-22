"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

const Page = () => {
  const router = useRouter();
  const pathname = usePathname();
  useEffect(() => {
    if (pathname === "/") {
      router.push("/project_center");
    }
  }, [router]);

  return <div className="text-base">Loading...</div>;
};

export default Page;
