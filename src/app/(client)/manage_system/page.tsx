"use client";
import Popup from "@/components/Popup";
import { useUsersStore } from "@/stores/userStore";
import axios from "axios";
import { CircleX, LockKeyhole, LockKeyholeOpen } from "lucide-react";
import React, { useEffect, useState } from "react";

const Page = () => {
  const { users, currentPage, fetchUsers, setCurrentPage, totalCount } =
    useUsersStore();
  const limit = 10;
  const totalPages = Math.ceil(totalCount / limit);
  const [isOpenDeleteUser, setIsOpenDeleteUser] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState<number | null>(null);
  const [selectDate, setSelectDate] = useState<string | "">("");

  const handleTrashDelete = (id: number, date: string | "") => {
    console.log("h: , ", date);
    setSelectDate(date);
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

  const handleDelete = async (userId: number, date: string) => {
    if (date == "") {
      try {
        await axios.delete(
          `${process.env.NEXT_PUBLIC_API_URL}/deleteUser/${userId}`
        );

        fetchUsers({ limit, offset: (currentPage - 1) * limit });
        setIsOpenDeleteUser(false);
      } catch (err) {
        console.error("Error deleting project", err);
      }
    } else {
      try {
        await axios.patch(
          `${process.env.NEXT_PUBLIC_API_URL}/rollbackUser/${userId}`
        );

        fetchUsers({ limit, offset: (currentPage - 1) * limit });
        setIsOpenDeleteUser(false);
      } catch (err) {
        console.error("Error deleting project", err);
      }
    }
  };

  useEffect(() => {
    fetchUsers({
      limit,
      offset: (currentPage - 1) * limit,
    });
  }, [currentPage, fetchUsers]);

  return (
    <div className="flex flex-col gap-2 h-full w-full text-lg relative">
      <div
        className="text-white flex items-center p-5 rounded-lg shadow-md bg-gradient-to-r from-blue to-white
        lg:text-xl lg:h-[80px]
        2xl:text-2xl 2xl:h-[100px]"
      >
        <h1>จัดการผู้ใช้</h1>
      </div>

      <div className="max-h-[550px] w-full h-auto rounded-lg p-5 shadow-md">
        <div className="relative overflow-auto w-full">
          <table className="w-full min-w-max border-collapse cursor-default table-auto">
            <thead className="bg-blue text-white w-full">
              <tr className="h-16 text-sm lg:text-base">
                <th className="border-r border-gray-100 whitespace-nowrap px-4">
                  รหัสผู้ใช้
                </th>
                <th className="border-r border-gray-100 px-4">บทบาท</th>
                <th className="border-r border-gray-100 px-4">ชื่อจริง</th>
                <th className="border-r border-gray-100 px-4">นามสกุล</th>
                <th className="border-r border-gray-100 px-4">อีเมล</th>
                <th className="w-60">จัดการผู้ใช้</th>
              </tr>
            </thead>
            {users.length > 0 ? (
              <tbody>
                {users.map((item, index) => (
                  <tr
                    key={item.user_id}
                    className={`h-auto ${
                      index % 2 === 0 ? "" : "bg-[#D6E0F5]"
                    }`}
                  >
                    <td className="px-4 text-center border-r border-gray-100">
                      {item.user_id}
                    </td>
                    <td className="px-4 border-r border-gray-100">
                      {item.role_name}
                    </td>
                    <td className="px-4 border-r border-gray-100">
                      {item.first_name}
                    </td>
                    <td className="px-4 border-r border-gray-100">
                      {item.last_name}
                    </td>
                    <td className="px-4 border-r border-gray-100">
                      {item.email}
                    </td>
                    <td className="p-4 flex items-center justify-center h-[82px]">
                      <button
                        disabled={item.role_id === 1}
                        onClick={() =>
                          handleTrashDelete(
                            item.user_id!,
                            item.deleted_at ? item.deleted_at : ""
                          )
                        }
                        className={`${
                          item.role_id === 1 && "hidden"
                        } w-[150px] h-[50px] grid grid-cols-[55px_auto] items-center gap-2 rounded-md text-white transition duration-75 ${
                          item.deleted_at !== null
                            ? "bg-blue hover:bg-orange"
                            : "bg-primary hover:bg-[#E04B4B"
                        }`}
                      >
                        <div className="flex items-center justify-center w-full">
                          {item.deleted_at !== null ? (
                            <LockKeyholeOpen size={20} strokeWidth={1.5} />
                          ) : (
                            <LockKeyhole size={20} strokeWidth={1.5} />
                          )}
                        </div>
                        <p className="text-left">
                          {item.deleted_at !== null ? "ปลดระงับ" : "ระงับ"}
                        </p>
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
      </div>

      <Popup isOpen={isOpenDeleteUser} onClose={handleClosePopup}>
        <div className="bg-white rounded-lg shadow-lg text-center grid items-center justify-center">
          <div
            className={`w-full p-5 flex gap-3 items-center justify-center border ${
              selectDate ? "text-blue" : "text-primary"
            } `}
          >
            {selectDate ? (
              <LockKeyholeOpen size={17} strokeWidth={2} />
            ) : (
              <LockKeyhole size={17} strokeWidth={2} />
            )}
            <p className="font-bold">
              {selectDate ? 'ยืนยันการ "ปลดระงับ"' : 'ยืนยันการ "ระงับ"'}
            </p>
          </div>
          <div className="flex gap-4 items-center justify-center w-[400px] p-4">
            <button
              className="bg-white text-primary border-[1px] border-primary px-4 h-[50px] w-full rounded-lg shadow-md transition-all duration-75 hover:bg-primary hover:text-white"
              onClick={() => setIsOpenDeleteUser(false)}
            >
              ยกเลิก
            </button>

            <button
              className="bg-blue text-white px-4 h-[50px] w-full rounded-lg shadow-md transition-all duration-75 hover:bg-orange"
              onClick={() => handleDelete(selectedDelete!, selectDate)}
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
          หน้า {currentPage} จาก {totalPages}
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
