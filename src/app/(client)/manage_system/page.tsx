"use client";
import Popup from "@/components/Popup";
import { useUsersStore } from "@/stores/userStore";
import axios from "axios";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Jojo from "../../../../public/images/Jojo.jpg";
import Image from "next/image";

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
        `${process.env.NEXT_PUBLIC_API_URL}/deleteUser/${userId}`,
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
        {users.length > 0 && (
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
                  <button
                    disabled={item.role_id === 1}
                    onClick={() => handleTrashDelete(item.user_id!)}
                    className="w-full h-full flex items-center justify-center gap-2 p-2 rounded-md bg-primary text-white hover:bg-[#E04B4B]"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
        {users.length === 0 && (
          <div className="text-blue text-center">
            <h2>There are no User yet.</h2>
            <p>Start adding some!</p>
          </div>
        )}
      </table>
      <Popup isOpen={isOpenDeleteUser} onClose={handleClosePopup}>
        <div className="p-5 bg-white rounded-lg shadow-lg text-center flex flex-col items-center justify-center">
          <h1 className="text-xl font-bold mb-3">
            ไม่เดินออกไปแต่กดเข้ามางั้นรึ!!!!!!!!!
          </h1>
          <Image src={Jojo} alt="Jojo" />
          <div className="flex gap-4 justify-center">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={() => handleDelete(selectedDelete!)}
            >
              เดินเข้าไปหา!
            </button>
            <button
              className="bg-gray-300 px-4 py-2 rounded-lg"
              onClick={() => setIsOpenDeleteUser(false)}
            >
              รีบเดินหนี!
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
    </>
  );
};

export default Page;
