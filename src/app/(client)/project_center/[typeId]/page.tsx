"use client";
import { useParams, useRouter } from "next/navigation";
import React, { useEffect } from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { useAllProjectStore } from "@/stores/allProjectStore";

const Page = () => {
  const router = useRouter();
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
  const limit = 10;
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
    <div className="grid gap-3">
      <ChevronLeft onClick={() => router.back()} className="cursor-pointer" />

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

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-500"
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="px-4 py-2 bg-gray-300 rounded disabled:bg-gray-500"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Page;
