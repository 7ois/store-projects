"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useAllProjectStore } from "@/stores/allProjectStore";

const Page = () => {
  const router = useRouter();
  const params = useParams(); // ดึงข้อมูลจาก params
  const { typeId } = params; // ดึงค่าจาก params

  const { projects, setTypeId, fetchProjects } = useAllProjectStore();

  useEffect(() => {
    if (typeId) {
      setTypeId(typeId.toString());
      fetchProjects({ typeId: typeId.toString() });
    }
  }, [typeId, setTypeId, fetchProjects]);

  return (
    <div className="grid gap-3">
      {/* <div> */}
      <ChevronLeft onClick={() => router.back()} className="cursor-pointer" />
      {/* </div> */}
      {projects.length > 0 ? (
        projects.map((project) => (
          <Link
            href={`/project_center/${project.type_id}/${project.project_id}`}
            key={project.project_id}
            className="grid gap-2 items-center rounded-[10px] shadow-md px-5 py-2 cursor-pointer w-full h-[100px] overflow-hidden transition delay-75 hover:bg-blue hover:text-white"
          >
            <h1 className="text-xl">{project.project_name_th}</h1>
            <p className="text-[#B4B4B4] text-base w-full truncate">
              {project.abstract_th}
            </p>
          </Link>
        ))
      ) : (
        <p>No data available</p>
      )}
    </div>
  );
};

export default Page;
