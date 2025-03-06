"use client";
import Popup from "@/components/Popup";
import { useUsersStore } from "@/stores/userStore";
import axios from "axios";
import { CircleX, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { users, currentPage, fetchUsers, setCurrentPage, totalCount } =
    useUsersStore();
  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit);
  const [isOpenDeleteUser, setIsOpenDeleteUser] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState<number | null>(null);

  const handleTrashDelete = (id: number) => {
    setSelectedDelete(id);
    setIsOpenDeleteUser(true);
  };
  const handleClosePopup = () => {
    setIsOpenDeleteUser(false);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchUsers({
      limit,
      offset: (page - 1) * limit,
    });
  };

  const handleDelete = async (userId: number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/deleteUser/${userId}`
      );

      fetchUsers({ limit, offset: (currentPage - 1) * limit });
      setIsOpenDeleteUser(false);
    } catch (err) {
      console.error("Error deleting project", err);
    }
  };

  useEffect(() => {
    fetchUsers({
      limit,
      offset: (currentPage - 1) * limit,
    });
  }, [currentPage, fetchUsers]);

  return (
    <div className="h-full w-full text-base relative">
      <div className="flex items-center p-5 rounded-lg shadow-md h-[86px]">
        <h1>Manage User</h1>
      </div>

      <div className="max-h-[564px] w-full h-auto rounded-lg p-5 overflow-auto shadow-md">
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
          {users.length > 0 ? (
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
                  <td
                    className={`${
                      item.role_id === 1 && "h-[82px]"
                    } p-4 flex items-center`}
                  >
                    <button
                      disabled={item.role_id === 1}
                      onClick={() => handleTrashDelete(item.user_id!)}
                      className={`${
                        item.role_id === 1 && "hidden"
                      } w-full h-[50px] flex items-center justify-center gap-2 p-2 rounded-md bg-primary text-white transition duration-75 hover:bg-[#E04B4B]`}
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            <tbody>
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  ไม่มีข้อมูล
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      <Popup isOpen={isOpenDeleteUser} onClose={handleClosePopup}>
        <div className="bg-white rounded-lg shadow-lg text-center grid items-center justify-center">
          <div className="w-full p-5 text-primary grid items-center justify-center">
            <CircleX strokeWidth={1} className="w-40 h-40" />
            <p className="text-lg font-medium">ยืนยันการลบ</p>
          </div>
          <div className="flex gap-4 items-center justify-center w-[400px] p-5">
            <button
              className="bg-gray-300 text-gray-800 px-4 h-[50px] w-full rounded-lg shadow-md transition-all duration-75 hover:bg-gray-400"
              onClick={() => setIsOpenDeleteUser(false)}
            >
              ยกเลิก
            </button>

            <button
              className="bg-primary text-white px-4 h-[50px] w-full rounded-lg shadow-md transition-all duration-75 hover:bg-[#E04B4B]"
              onClick={() => handleDelete(selectedDelete!)}
            >
              ยืนยัน
            </button>
          </div>
        </div>
      </Popup>

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
    </div>
  );
};

export default Page;
