"use client";
import AddTypeProject from "@/components/AddTypeProject";
import { usePopup } from "@/context/PopupContext";
import axios from "axios";
import { CircleX, Pencil, Plus, Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface TypeProject {
  type_id: number;
  type_name: string;
}

const page = () => {
  // const { openPopup, closePopup } = usePopup();
  const [typeProjects, setTypeProjects] = useState<TypeProject[]>([]);
  const [isOpenAddType, setIsOpenAddType] = useState(false);

  const handlePopup = () => {
    setIsOpenAddType(!isOpenAddType);
  };

  useEffect(() => {
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
    fetchType();
  }, [typeProjects]);

  return (
    <>
      <div className="flex w-full gap-5">
        <div className="p-5 rounded-[10px] shadow-md w-full h-full">
          <div className="relative flex items-center w-full mb-5 justify-end">
            <div className="absolute -left-7 border w-[200px] h-[50px] bg-blue flex items-center justify-center">
              <h1 className="text-xl text-[#fff]">Add type project</h1>
            </div>
            <button
              className="flex gap-2 items-center border text-blue border-blue p-[10px] rounded-[10px] transition delay-75 hover:border-orange hover:text-orange"
              onClick={() => setIsOpenAddType(true)}
            >
              <Plus size={20} />
              Add type project
            </button>
            <AddTypeProject
              isOpenAddType={isOpenAddType}
              setOpenPopup={handlePopup}
            />
          </div>
          <div>
            {typeProjects.length > 0 && (
              <ul className="grid grid-cols-3 gap-5">
                {typeProjects.map((type) => (
                  <li
                    className="grid grid-cols-[auto_130px] items-center bg-white text-black rounded-lg shadow-lg h-20 px-4"
                    key={type.type_id}
                  >
                    <div className="w-full">
                      <p>{type.type_name}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-2 items-center justify-between w-full">
                      <button className="flex items-center justify-center border-[1px] border-primary bg-white text-primary w-full h-full box-border rounded-lg transition delay-75 hover:bg-primary hover:text-white">
                        <Trash2 />
                      </button>
                      <button className="flex items-center justify-center bg-blue text-white rounded-lg p-4 transition delay-75 hover:bg-orange">
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
        </div>
      </div>
    </>
  );
};

export default page;
