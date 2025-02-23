"use client";
import React, { useState } from "react";
import Popup from "./Popup";

interface TypeAdd {
  isOpenAddType: boolean;
  //   openPopup: (item: boolean) => void;
  setOpenPopup: () => void;
}

const AddTypeProject = ({ setOpenPopup, isOpenAddType }: TypeAdd) => {
  const [typeProject, setTypeProject] = useState("");

  const handleSubmit = (e: any) => {
    e.preventDefault();
    console.log("Form submitted: ", typeProject);
    setTypeProject("");
  };

  return (
    <>
      <Popup isOpen={isOpenAddType} onClose={setOpenPopup}>
        <div className="border-b-[1px] grid items-center justify-center py-5 bg-blue text-white">
          <h1>เพิ่มประเภทโครงงาน</h1>
        </div>
        <form onSubmit={handleSubmit} className="">
          <div className="flex gap-2 m-5 items-center justify-center">
            <label>ชื่อประเภทโครงงาน</label>
            <input
              className="border h-[50px] rounded-lg pl-2"
              placeholder="กรอกชื่อประเภทโครงงาน"
              type="text"
              onChange={(e) => setTypeProject(e.target.value)}
              value={typeProject}
            />
          </div>
          <div className="flex items-center justify-between gap-2 p-5 border-t-[1px]">
            <button
              type="button"
              className="border border-primary text-primary h-[40px] w-full rounded-lg"
              onClick={setOpenPopup}
            >
              Cancel
            </button>
            <button className="bg-blue text-white h-[40px] w-full rounded-lg">
              Submit
            </button>
          </div>
        </form>
      </Popup>
      {/* <button className={styles.button} onClick={() => setOpenModal(true)}>เพิ่มประเภทโครงงาน</button> */}
    </>
  );
};

export default AddTypeProject;
