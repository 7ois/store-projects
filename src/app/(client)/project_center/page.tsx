"use client";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";

interface TypeProject {
  type_id: number;
  type_name: string;
  project_count: number;
}

const Page = () => {
  const [typeProject, setTypeProject] = useState<TypeProject[]>([]);

  useEffect(() => {
    const fetchTypeProjects = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getAllTypeProjects`
        );
        const data = response.data;

        if (Array.isArray(data)) {
          setTypeProject(data);
        } else {
          console.log("ข้อมูลไม่ถูกต้อง");
        }
      } catch (err) {
        console.error("Error fetching type projects:", err);
        // setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        // setLoading(false);
      }
    };

    fetchTypeProjects();
  }, []);

  const formatProjectCount = (count: number) => {
    if (count >= 1000000000) {
      return `${(count / 1000000000).toFixed(1)}B`; // Billion
    } else if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`; // Million
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(0)}k`; // Thousand
    } else {
      return new Intl.NumberFormat().format(count); // For less than 1000
    }
  };

  return (
    <div className="w-full h-full">
      <div className="flex items-center p-5 rounded-lg shadow-md h-[86px]">
        <h1>Select Type Project</h1>
      </div>

      <div className="max-h-[564px] w-full h-auto rounded-lg p-5 overflow-auto shadow-md">
        <ul className="grid grid-cols-3 gap-5">
          {typeProject.length > 0 ? (
            typeProject.map((type) => (
              <Link key={type.type_id} href={`/project_center/${type.type_id}`}>
                <li className="relative flex flex-col items-center bg-blue text-white rounded-lg shadow-lg justify-center w-full h-20 cursor-pointer transition-transform duration-75  hover:-translate-y-1 hover:bg-orange">
                  <span className="text-base font-medium">
                    {type.type_name}
                  </span>

                  <span className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {formatProjectCount(type.project_count)} Projects
                  </span>
                </li>
              </Link>
            ))
          ) : (
            <p>ไม่พบข้อมูล</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Page;
