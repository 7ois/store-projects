"use client";
import Popup from "@/components/Popup";
import PopupTypeProject from "@/components/PopupTypeProject";
import axios from "axios";
import { CircleX, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface TypeProject {
  type_id: number;
  type_name: string;
}

const Page = () => {
  // const { openPopup, closePopup } = usePopup();
  const [typeProjects, setTypeProjects] = useState<TypeProject[]>([]);
  const [isOpenAddType, setIsOpenAddType] = useState(false);
  const [isOpenEditType, setIsOpenEditType] = useState(false);
  const [selectedTypeProject, setSelectedTypeProject] =
    useState<TypeProject | null>(null);
  const [isOpenDeleteType, setIsOpenDeleteType] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState<number | null>(null);

  const handleClosePopup = () => {
    setIsOpenDeleteType(false);
  };
  const handleEditClick = (type: TypeProject) => {
    setSelectedTypeProject(type);
    setIsOpenEditType(true);
  };

  const handleAddPopup = () => {
    setIsOpenAddType(!isOpenAddType);
  };
  const handleEditPopup = () => {
    setIsOpenEditType(!isOpenEditType);
  };

  const fetchType = async () => {
    try {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/getAllTypeProjects`
      );
      setTypeProjects(response.data);
    } catch (err) {
      console.error("Error fetching typeproject:", err);
    }
  };

  const handleDelete = async (typeId: number) => {
    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_API_URL}/deleteTypeProject/${typeId}`
      );

      setIsOpenDeleteType(false);
    } catch (err) {
      console.error("Error deleting project", err);
    }
  };

  const handleTrashDelete = (id: number) => {
    setSelectedDelete(id);
    setIsOpenDeleteType(true);
  };

  useEffect(() => {
    fetchType();
  }, []);

  useEffect(() => {
    fetchType();
  }, [isOpenAddType, isOpenEditType, isOpenDeleteType]);

  return (
    <div
      className="flex flex-col gap-2 w-full h-full
      lg:text-lg"
    >
      <div
        className="flex items-center justify-between p-5 rounded-lg shadow-md bg-gradient-to-r from-blue to-white text-white
        lg:text-xl lg:h-[80px]
        2xl:text-2xl 2xl:h-[100px]"
      >
        <h1>เพิ่มประเภทโครงงาน</h1>
        <button
          className="bg-white flex gap-2 items-center border text-blue border-blue p-[10px] rounded-[10px] transition duration-75 hover:border-orange hover:text-orange
          lg:text-lg"
          onClick={() => setIsOpenAddType(true)}
        >
          <Plus size={20} />
          เพิ่มประเภทโครงงาน
        </button>
      </div>

      <PopupTypeProject
        isOpenAddType={isOpenAddType}
        setOpenPopup={handleAddPopup}
      />

      <div className="max-h-[423px] w-full h-auto rounded-lg p-5 overflow-auto shadow-md">
        {typeProjects.length > 0 && (
          <ul
            className="grid gap-5
          lg:grid-cols-2
          2xl:grid-cols-3"
          >
            {typeProjects.map((type) => (
              <li
                className="grid grid-cols-[auto_130px] items-center bg-white text-black rounded-lg shadow-md h-20 px-4"
                key={type.type_id}
              >
                <div className="w-full min-w-0">
                  <p
                    className="truncate overflow-hidden whitespace-nowrap 
                    max-w-full sm:max-w-[150px] md:max-w-[200px] lg:max-w-[250px] 2xl:max-w-[300px]"
                  >
                    {type.type_name}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 items-center justify-between w-full">
                  <button
                    className="flex items-center justify-center border-[1px] border-primary bg-white text-primary w-full h-full box-border rounded-lg transition duration-75 hover:bg-primary hover:text-white"
                    onClick={() => handleTrashDelete(type.type_id)}
                  >
                    <Trash2 />
                  </button>
                  <button
                    className="flex items-center justify-center bg-blue text-white rounded-lg p-4 transition duration-75 hover:bg-orange"
                    onClick={() => handleEditClick(type)}
                  >
                    <Pencil />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
        {typeProjects.length === 0 && (
          <div className="text-blue text-center">
            <h2>ยังไม่มีประเภทโครงการ</h2>
            <p>เริ่มเพิ่มบางส่วน!</p>
          </div>
        )}
      </div>
      <Popup isOpen={isOpenDeleteType} onClose={handleClosePopup}>
        <div className="bg-white rounded-lg shadow-lg text-center grid items-center justify-center text-lg">
          <div className="w-full p-5 text-primary grid items-center justify-center">
            <CircleX strokeWidth={1} className="w-40 h-40" />
            <p className="font-medium">ยืนยันการลบ</p>
          </div>
          <div className="flex gap-4 items-center justify-center w-[400px] p-5">
            <button
              className="bg-gray-300 text-gray-800 px-4 h-[50px] w-full rounded-lg shadow-md transition-all duration-75 hover:bg-gray-400"
              onClick={() => setIsOpenDeleteType(false)}
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
      <PopupTypeProject
        isOpenAddType={isOpenEditType}
        setOpenPopup={handleEditPopup}
        editData={selectedTypeProject!}
      />
    </div>
  );
};

export default Page;
