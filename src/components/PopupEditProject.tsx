"use client";
import { Project } from "@/entity/project";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Dropdown from "./Dropdown";

// interface FormData {
//   project_name_th: string;
//   project_name_en: string;
//   abstract_th: string;
//   abstract_en: string;
//   keyword: string[];
//   date: string;
//   type_id: number;
//   main_owner: { user_id: number; role_group: "main_owner"; value: string };
//   owner: { user_id: number; role_group: "owner"; value: string }[]; // Array of owner objects
//   advisor: { user_id: number; role_group: "advisor"; value: string }[]; // Array of advisor objects
//   file: string | File;
// }

interface PopupEditProjectProps {
  selectedProjectId: number | null;
  closePopup: () => void;
}

const PopupEditProject = ({
  selectedProjectId,
  closePopup,
}: PopupEditProjectProps) => {
  console.log("selectedProjectId: ", selectedProjectId);

  const [project, setProject] = useState<Project>();

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getProject/${selectedProjectId}`
        );
        setProject(response.data.project);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };
    fetchProject();
  }, [selectedProjectId]);

  console.log(project);

  return (
    <div className="max-w-[1000px] grid overflow-hidden">
      <div className=" h-10 flex items-center justify-center py-6 shadow-sm">
        Edit project
      </div>
      <form encType="multipart/form-data">
        <div className="px-10 my-5 grid grid-cols-4 gap-2 text-lg items-center overflow-y-auto max-h-[460px]">
          <label>Project name TH</label>
          <input
            type="text"
            className="h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg"
            // onChange={(e) =>
            //   setFormData({ ...formData, project_name_th: e.target.value })
            // }
            placeholder="project-name"
            value={project?.project_name_th}
          />

          <label>Project name EN</label>
          <input
            type="text"
            className="h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg"
            // onChange={(e) =>
            //   setFormData({ ...formData, project_name_en: e.target.value })
            // }
            placeholder="project-name-EN"
            value={project?.project_name_en}
          />

          <label>Abstract TH</label>
          <input
            type="text"
            className="h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg"
            // onChange={(e) =>
            //   setFormData({ ...formData, abstract_th: e.target.value })
            // }
            placeholder="abstract_th"
            value={project?.abstract_th}
          />

          <label>Abstract EN</label>
          <input
            type="text"
            className="h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg"
            // onChange={(e) =>
            //   setFormData({ ...formData, abstract_en: e.target.value })
            // }
            placeholder="abstract_en"
            value={project?.abstract_en}
          />

          <label>Keyword</label>
          <input
            type="text"
            className="h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg"
            placeholder="Enter keywords, separated by commas"
            // value={project.keyword.join(", ")}
            // onChange={(e) => {
            //   const keywords = e.target.value
            //     .split(",")
            //     .map((keyword) => keyword.trim());
            //   setFormData({ ...formData, keyword: keywords });
            // }}
          />

          <label>Type Project</label>
          {/* <Dropdown
            items={types}
            onSelect={handleTypeSelect}
            className="col-span-3"
          /> */}

          <label>Date</label>
          {/* <input
            type="date"
            className="h-[50px] col-span-3 pl-3 pr-4 border border-[#c5c5c5] text-base text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors"
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            placeholder="Select a date"
            value={formData.date}
          /> */}
          {/* 
          <label>Main owner</label>
          <div className="col-span-3 col-start-2 relative">
            <input
              disabled
              type="text"
              className="h-[50px] pl-2 border border-[#c5c5c5] text-base w-full rounded-lg"
              value={formData.main_owner.value}
              placeholder="main owner"
              onChange={(e) => handleChangeMainOwner(e)}
              onFocus={() => setIsMainOwnerActive(true)}
              onBlur={() => setTimeout(() => setIsMainOwnerActive(false), 200)}
            />

            {isMainOwnerActive &&
              formData.main_owner.value &&
              Array.isArray(mainOwnerSuggestions) &&
              mainOwnerSuggestions.length > 0 && (
                <div className="absolute top-full left-0 w-full bg-white border border-[#c5c5c5] shadow-lg mt-2 z-10">
                  {mainOwnerSuggestions.map((value, index) => (
                    <div
                      key={index}
                      className="p-2 cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSelectUser(value)}
                    >
                      {value.first_name} {value.last_name}
                    </div>
                  ))}
                </div>
              )}
          </div>
          <label>Owner</label>
          {formData.owner.map((owner, index) => (
            <div key={index} className="col-span-3 col-start-2 relative">
              <input
                type="text"
                className="h-[50px] pl-2 border border-[#c5c5c5] text-base w-full rounded-lg"
                value={owner.value}
                placeholder="owner"
                onChange={(e) => handleChange(e, index, "owner")}
                onFocus={() => setActiveOwnerIndex(index)}
                onBlur={() => setTimeout(() => setActiveOwnerIndex(null), 200)}
              />
              {index === activeOwnerIndex &&
                owner.value &&
                Array.isArray(ownerSuggestions) &&
                ownerSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-[#c5c5c5] shadow-lg mt-2 z-10">
                    {ownerSuggestions.map((value, idx) => (
                      <div
                        key={idx}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() =>
                          handleSelectUserForField(value, "owner", index)
                        }
                      >
                        {value.first_name} {value.last_name}
                      </div>
                    ))}
                  </div>
                )}
              <X
                size={20}
                className="text-primary cursor-pointer absolute top-1/2 right-3 -translate-y-1/2"
                onClick={() => handleRemove("owner", index)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAdd("owner")}
            className="h-[50px] text-white pl-2 bg-blue text-base col-span-3 rounded-lg col-start-2 flex items-center justify-center gap-3"
          >
            <CirclePlus size={20} />
            ADD owner
          </button>

          <label>Advisor</label>
          {formData.advisor.map((advisor, index) => (
            <div key={index} className="col-span-3 col-start-2 relative">
              <input
                type="text"
                className="h-[50px] pl-2 border border-[#c5c5c5] text-base w-full rounded-lg"
                value={advisor.value}
                placeholder="advisor"
                onChange={(e) => handleChange(e, index, "advisor")}
                onFocus={() => setActiveAdvisorIndex(index)}
                onBlur={() =>
                  setTimeout(() => setActiveAdvisorIndex(null), 200)
                }
              />
              {index === activeAdvisorIndex &&
                advisor.value &&
                Array.isArray(advisorSuggestions) &&
                advisorSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 w-full bg-white border border-[#c5c5c5] shadow-lg mt-2 z-10">
                    {advisorSuggestions.map((value, idx) => (
                      <div
                        key={idx}
                        className="p-2 cursor-pointer hover:bg-gray-100"
                        onClick={() =>
                          handleSelectUserForField(value, "advisor", index)
                        }
                      >
                        {value.first_name} {value.last_name}
                      </div>
                    ))}
                  </div>
                )}
              <X
                size={20}
                className="text-primary cursor-pointer absolute top-1/2 right-3 -translate-y-1/2"
                onClick={() => handleRemove("advisor", index)}
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => handleAdd("advisor")}
            className="h-[50px] text-white pl-2 bg-blue text-base col-span-3 rounded-lg col-start-2 flex items-center justify-center gap-3"
          >
            <CirclePlus size={20} />
            ADD advisor
          </button>

          <label>File</label>
          <input
            onChange={handleFileChange}
            type="file"
            accept=".pdf"
            className="h-[50px] pl-2 border-[#c5c5c5] text-base"
          /> */}
        </div>
        <div className="flex items-center justify-center gap-10 h-auto py-6 shadow-md">
          <button
            type="button"
            className="border w-[300px] h-[50px] rounded-[10px] border-primary text-primary"
            onClick={closePopup}
          >
            Cancel
          </button>
          <button className="border w-[300px] h-[50px] rounded-[10px] bg-blue text-[#fff]">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopupEditProject;
