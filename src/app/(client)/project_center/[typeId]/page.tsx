"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Link from "next/link";
// import { ChevronLeft } from "lucide-react";
import { useAllProjectStore } from "@/stores/allProjectStore";

const Page = () => {
  const params = useParams();
  const { typeId } = params;

  const {
    projects,
    currentPage,
    setTypeId,
    fetchProjects,
    setCurrentPage,
    totalCount,
  } = useAllProjectStore();
  const limit = 5;
  const totalPages = Math.ceil(totalCount / limit);

  useEffect(() => {
    if (typeId) {
      setTypeId(typeId.toString());
      fetchProjects({
        typeId: typeId.toString(),
        limit,
        offset: (currentPage - 1) * limit,
      });
    }
  }, [typeId, setTypeId, fetchProjects, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProjects({
      typeId: typeId?.toString(),
      limit,
      offset: (page - 1) * limit,
    });
  };

  return (
    <div className="h-full w-full relative">
      {/* <ChevronLeft
        onClick={() => router.back()}
        className="cursor-pointer absolute -top-8"
      /> */}
      <div className="max-h-[650px] w-full h-auto rounded-lg p-5 overflow-auto shadow-md">
        <div className="grid gap-3">
          {projects.length > 0 ? (
            projects.map((project) => (
              <Link
                href={`/project_center/${project.type_id}/${project.project_id}`}
                key={project.project_id}
                className="grid gap-3 items-center rounded-[10px] shadow-md p-5 cursor-pointer w-full h-auto overflow-hidden transition duration-75 hover:bg-blue hover:text-white"
              >
                <h1
                  className="text-base font-medium overflow-hidden text-ellipsis break-words"
                  style={{
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                  }}
                >
                  {project.project_name_th}
                </h1>

                <p
                  className="text-[#B4B4B4] text-sm w-full overflow-hidden text-ellipsis break-words"
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
            <p>No data available</p>
          )}
        </div>
      </div>

      {/* Pagination Controls */}
      <div className="absolute bottom-0 w-full flex justify-between items-center mt-4 text-base">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="w-[100px] h-[50px] border border-blue box-border text-blue rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed disabled:text-white disabled:border-none"
        >
          ย้อนกลับ
        </button>
        <span>
          หน้า {currentPage} จาก {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages || currentPage > totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="w-[100px] h-[50px] bg-blue text-white rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          ถัดไป
        </button>
      </div>
    </div>
  );
};

export default Page;
