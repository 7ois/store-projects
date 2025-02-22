"use client";
import axios from "axios";
import Link from "next/link";
// import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface TypeProject {
  type_id: number;
  type_name: string;
}

const page = () => {
  // const router = useRouter();
  const [typeProject, setTypeProject] = useState<TypeProject[]>([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

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
          // setError("ข้อมูลไม่ถูกต้อง");
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

  return (
    <div className="relative rounded-lg shadow-lg w-full h-auto p-5">
      <div className="absolute -left-2 border w-[200px] h-[50px] bg-blue flex items-center justify-center">
        <h1 className="text-xl text-[#fff]">Select Type Project</h1>
      </div>
      <ul className="grid grid-cols-3 gap-5 mt-20">
        {typeProject.length > 0 ? (
          typeProject.map((type) => (
            <Link key={type.type_id} href={`/project_center/${type.type_id}`}>
              <li className="flex items-center bg-blue text-white rounded-lg shadow-lg justify-center w-full h-20 cursor-pointer transition delay-100 hover:-translate-y-1 hover:bg-orange">
                {type.type_name}
              </li>
            </Link>
          ))
        ) : (
          <p>ไม่พบข้อมูล</p>
        )}
      </ul>
    </div>
  );
};

export default page;
