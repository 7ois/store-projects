"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Project } from "@/entity/project";
import { convertToThaiDate } from "@/lib/convertToThaiDate";

const Page = () => {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);

  // const handleBack = () => {
  //   router.push(`/project_center/${params.type_id}`); // เปลี่ยนเส้นทางกลับไปยัง /d/{id}
  // };

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getProject/${params.projectId}`,
        );
        setProject(response.data.project);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };
    if (params) fetchProject();
  }, [params]);

  return (
    <div className="text-lg">
      {/* <ChevronLeft
        onClick={handleBack}
        size={25}
        color="#1C3B6C"
        className="cursor-pointer"
      /> */}
      {project ? (
        <div className="grid gap-5">
          <div className="grid gap-5 p-5 rounded-lg shadow-md">
            <div className="grid grid-cols-[200px_auto]">
              <h1 className="font-medium">ชื่อโครงงาน:</h1>
              <h1>{project.project_name_th}</h1>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1 className="font-medium">Title:</h1>
              <h1>{project.project_name_en}</h1>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1 className="font-medium">บทคัดย่อ:</h1>
              <h1>{project.abstract_th}</h1>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1 className="font-medium">Abstract:</h1>
              <h1>{project.abstract_en}</h1>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1 className="font-medium">วันที่เผยแพร่:</h1>
              <h1>{convertToThaiDate(project.date, "short")}</h1>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1 className="font-medium">คำสำคัญ:</h1>
              <h1>-</h1>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1 className="font-medium">ประเภทโครงงาน:</h1>
              <h1>{project.type_name}</h1>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1 className="font-medium">เจ้าของ:</h1>
              <ul className="flex">
                <li>
                  {project.users
                    ?.filter(
                      (user) =>
                        user.role_group === "main_owner" ||
                        user.role_group === "owner",
                    )
                    .map((user) => `${user.first_name} ${user.last_name}`)
                    .join(", ")}
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1 className="font-medium">ที่ปรึกษา:</h1>
              <ul className="flex">
                <li>
                  {project.users
                    ?.filter((user) => user.role_group === "advisor")
                    .map((user) => `${user.first_name} ${user.last_name}`)
                    .join(", ")}
                </li>
              </ul>
            </div>
          </div>

          {project.file_path ? (
            <div className="flex w-full gap-5 p-5 rounded-lg shadow-md items-center justify-between">
              <div>
                {project.file_name && (
                  <div className="grid grid-cols-[200px_auto]">
                    <h1 className="font-medium">ไฟล์:</h1>
                    <h1>{project.file_name}</h1>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 w-1/4">
                <a
                  href={`${process.env.NEXT_PUBLIC_UPLOAD_URL}${project.file_path}`}
                  target="_blank"
                  download={project.file_name}
                  className="flex items-center justify-center text-center text-white bg-blue h-[50px] w-full rounded-lg transition duration-75 hover:bg-orange"
                >
                  ดาวน์โหลดโครงงาน
                </a>
              </div>
            </div>
          ) : (
            <p>Loading...</p>
          )}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Page;
