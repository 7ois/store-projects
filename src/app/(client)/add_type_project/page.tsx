"use client";
import AddTypeProject from "@/components/AddTypeProject";
import { usePopup } from "@/context/PopupContext";
import axios from "axios";
import { CircleX, Plus } from "lucide-react";
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
              <ul className="max-w-4xl my-4 mx-auto py-4 grid grid-cols-5 gap-5 justify-center">
                {typeProjects.map((type) => (
                  <li
                    className="my-4 p-4 bg-blue rounded-lg shadow-lg cursor-pointer relative"
                    key={type.type_id}
                  >
                    <div className="rounded-full absolute -top-2 -right-2 bg-primary">
                      <CircleX strokeWidth={1} className="text-white" />
                    </div>
                    <p className="text-white">{type.type_name}</p>
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
