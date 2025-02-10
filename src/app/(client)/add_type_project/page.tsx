"use client";
import AddTypeProject from "@/components/AddTypeProject";
import { usePopup } from "@/context/PopupContext";
import React, { useState } from "react";

const page = () => {
  const { openPopup, closePopup } = usePopup();

  const typeProject = [
    { id: "1", typeName: "สหกิจศึกษา" },
    { id: "2", typeName: "วิจัย" },
    { id: "3", typeName: "โครงงาน" },
    { id: "4", typeName: "รายงาน" },
    { id: "5", typeName: "ศิลปะนิพน" },
  ];

  return (
    <>
      <header className="flex items-center justify-between border-b-2 border-blue pb-5">
        <div className="text-[2rem] text-blue flex items-center justify-center">
          <h1>ประเภทโครงงาน</h1>
        </div>
        <button
          className="bg-blue text-white rounded-lg shadow-lg h-[50px] px-5"
          onClick={openPopup}
        >
          เพิ่มประเภทโครงงาน
        </button>
        <AddTypeProject setOpenPopup={closePopup} />
      </header>
      <div>
        {typeProject.length > 0 && (
          <ul className="max-w-4xl my-4 mx-auto py-4 grid grid-cols-5 gap-5 justify-center">
            {typeProject.map((type) => (
              <li
                className="my-4 p-4 bg-blue rounded-lg shadow-lg cursor-pointer"
                key={type.id}
              >
                <p className="text-white">{type.typeName}</p>
              </li>
            ))}
          </ul>
        )}
        {typeProject.length === 0 && (
          <div style={{ textAlign: "center", color: "white" }}>
            <h2>There are no Type yet.</h2>
            <p>Start adding some!</p>
          </div>
        )}
      </div>
    </>
  );
};

export default page;
