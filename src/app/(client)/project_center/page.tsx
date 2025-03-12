"use client";
import { useAllProjectStore } from "@/stores/allProjectStore";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

interface TypeProject {
  type_id: number;
  type_name: string;
  project_count: number;
}

const Page = () => {
  // const router = useRouter();
  const [typeProject, setTypeProject] = useState<TypeProject[]>([]);
  const [activeButton, setActiveButton] = useState<number | null>(0);

  useEffect(() => {
    const fetchTypeProjects = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getAllTypeProjects`
        );
        const data = response.data;

        if (Array.isArray(data)) {
          const totalProjectCount = data.reduce((total, type) => {
            const count = parseInt(type.project_count, 10) || 0; // แปลงเป็น number และตั้งค่าเป็น 0 ถ้าเป็น NaN
            return total + count;
          }, 0);

          // เพิ่มข้อมูลที่ตำแหน่ง 0 พร้อม project_count ที่รวม
          const newData = [
            {
              type_id: 0,
              type_name: "ทั้งหมด",
              project_count: totalProjectCount,
            },
            ...data,
          ];

          setTypeProject(newData);
        } else {
          console.log("ข้อมูลไม่ถูกต้อง");
        }
      } catch (err) {
        console.error("Error fetching type projects:", err);
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

  const handleClick = (id: number) => {
    setCurrentPage(1);
    fetchProjects({
      limit: 10,
      offset: 0,
    });
    setTypeId(id.toString());
    setActiveButton(id);
  };

  //
  // const typeId = selectType;
  const {
    projects,
    currentPage,
    setTypeId,
    typeId,
    fetchProjects,
    setCurrentPage,
    totalCount,
  } = useAllProjectStore();
  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    sessionStorage.removeItem("redirectTo");
  }, []);

  useEffect(() => {
    if (typeId) {
      fetchProjects({
        typeId: typeId,
        limit,
        offset: (currentPage - 1) * limit,
      });
      setActiveButton(parseInt(typeId, 10));
    }
  }, [typeId, setTypeId, fetchProjects, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProjects({
      typeId: typeId!,
      limit,
      offset: (page - 1) * limit,
    });
  };

  return (
    <div className="flex flex-col gap-2 w-full h-full relative">
      <div
        className="flex text-white items-center p-5 rounded-lg shadow-md bg-gradient-to-r from-blue to-white
        lg:text-xl lg:h-[80px]
        2xl:text-2xl 2xl:h-[100px]"
      >
        <h1>เลือกประเภทโครงงาน</h1>
      </div>

      <div className="w-full h-auto overflow-hidden px-2">
        <div className="w-full h-full overflow-x-scroll scroll-smooth">
          <ul
            className="w-full flex gap-2 flex-nowrap pb-4 pt-3 text-base
            lg:text-lg lg:gap-5"
          >
            {typeProject.length > 0 ? (
              typeProject.map((type) => (
                <div
                  key={type.type_id}
                  onClick={() => handleClick(type.type_id)}
                  className="flex-shrink-0 w-[200px]
                  lg:w-[200px]
                  2xl:w-[300px]"
                >
                  <li
                    className={`relative flex items-center bg-blue text-white rounded-lg shadow-lg justify-center w-full cursor-pointer transition-transform duration-75 ${
                      activeButton === type.type_id
                        ? "bg-orange"
                        : "hover:bg-orange hover:-translate-y-1"
                    } h-[60px]
                    lg:h-[70px] lg:px-4
                    2xl:h-20`}
                  >
                    <span className="font-medium truncate max-w-[200px]">
                      {type.type_name}
                    </span>

                    <span className="absolute -top-2 right-2 bg-primary text-white font-bold rounded-full text-xs px-3 py-1">
                      {formatProjectCount(type.project_count)} โครงงาน
                    </span>
                  </li>
                </div>
              ))
            ) : (
              <p>ไม่พบข้อมูล</p>
            )}
          </ul>
        </div>
      </div>

      <div
        className="max-h-[423px] w-full h-auto rounded-lg overflow-auto shadow-md text-base p-3
        lg:text-lg lg:p-5"
      >
        <div
          className="grid gap-2
          lg:gap-3"
        >
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link
                href={`/project_center/${project.project_id}`}
                key={project.project_id}
                className="grid gap-3 items-center rounded-[10px] shadow-md cursor-pointer w-full h-auto overflow-hidden transition duration-75 hover:bg-blue hover:text-white p-3
                lg:p-5"
              >
                <h1
                  className="font-medium overflow-hidden text-ellipsis break-words"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {project.project_name_th}
                </h1>

                <p
                  className="text-[#B4B4B4] w-full overflow-hidden text-ellipsis break-words text-sm
                  lg:text-base"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {project.abstract_th}
                </p>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">ไม่มีข้อมูล</p>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div
        className="absolute bottom-0 w-full flex justify-between items-center mt-4 text-sm
      lg:text-lg"
      >
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="w-[100px] h-[40px] border border-blue box-border text-blue rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed disabled:text-white disabled:border-none
          lg:w-[100px] lg:h-[50px]"
        >
          ย้อนกลับ
        </button>
        <span>
          หน้า {currentPage} จาก {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages || currentPage > totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="w-[100px] h-[40px] border border-blue box-border text-blue rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed disabled:text-white disabled:border-none
          lg:w-[100px] lg:h-[50px]"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default Page;
