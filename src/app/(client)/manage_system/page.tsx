"use client";
import { useUsersStore } from "@/stores/userStore";
import { Trash2 } from "lucide-react";
import React, { useEffect } from "react";

const Page = () => {
  const { users, currentPage, fetchUsers, setCurrentPage, totalCount } =
    useUsersStore();
  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers({
      limit,
      offset: (page - 1) * limit,
    });
  };

  useEffect(() => {
    fetchUsers({
      limit,
      offset: (currentPage - 1) * limit,
    });
  }, []);

  return (
    <>
      <table className="w-full cursor-default">
        <thead className="bg-blue text-white">
          <tr className="h-16">
            <th>user_id</th>
            <th>role_name</th>
            <th>email</th>
            <th>first_name</th>
            <th>last_name</th>
            <th>manage</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item, index) => (
            <tr
              key={item.user_id}
              className={`h-auto ${index % 2 === 0 ? "" : "bg-[#D6E0F5]"}`}
            >
              <td className="px-4">{item.user_id}</td>
              <td className="px-4">{item.role_name}</td>
              <td className="px-4">{item.first_name}</td>
              <td className="px-4">{item.last_name}</td>
              <td className="px-4">{item.email}</td>
              <td className="px-4 flex items-center p-4">
                <button className="w-full h-full flex items-center justify-center gap-2 p-2 rounded-md bg-primary text-white hover:bg-[#E04B4B]">
                  <Trash2 size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="absolute bottom-0 w-full flex justify-between items-center mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
          className="w-[100px] h-[50px] border border-blue box-border text-blue rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed disabled:text-white disabled:border-none"
        >
          ย้อนกลับ
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
          className="w-[100px] h-[50px] bg-blue text-white rounded-lg disabled:bg-gray-500 disabled:cursor-not-allowed"
        >
          ถัดไป
        </button>
      </div>
    </>
  );
};

export default Page;
