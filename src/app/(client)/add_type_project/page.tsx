"use client";
import Popup from "@/components/Popup";
import PopupTypeProject from "@/components/PopupTypeProject";
import axios from "axios";
import { Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Jojo from "../../../../public/images/Jojo.jpg";
import Image from "next/image";

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
    <>
      <div className="flex w-full gap-5">
        <div className="p-5 rounded-[10px] shadow-md w-full h-full">
          <div className="relative flex items-center w-full mb-5 justify-end">
            <div className="absolute -left-7 border w-[200px] h-[50px] bg-blue flex items-center justify-center">
              <h1 className="text-xl text-[#fff]">Add type project</h1>
            </div>
            <button
              className="flex gap-2 items-center border text-blue border-blue p-[10px] rounded-[10px] transition duration-75 hover:border-orange hover:text-orange"
              onClick={() => setIsOpenAddType(true)}
            >
              <Plus size={20} />
              Add type project
            </button>
            <PopupTypeProject
              isOpenAddType={isOpenAddType}
              setOpenPopup={handleAddPopup}
            />
          </div>
          <div>
            {typeProjects.length > 0 && (
              <ul className="grid grid-cols-3 gap-5">
                {typeProjects.map((type) => (
                  <li
                    className="grid grid-cols-[auto_130px] items-center bg-white text-black rounded-lg shadow-md h-20 px-4"
                    key={type.type_id}
                  >
                    <div className="w-full">
                      <p>{type.type_name}</p>
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
                <h2>There are no typeProject yet.</h2>
                <p>Start adding some!</p>
              </div>
            )}
          </div>
          <Popup isOpen={isOpenDeleteType} onClose={handleClosePopup}>
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
                  onClick={() => setIsOpenDeleteType(false)}
                >
                  รีบเดินหนี!
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
      </div>
    </>
  );
};

export default Page;
