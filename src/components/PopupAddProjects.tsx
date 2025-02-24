"use client";
import { User } from "@/entity/user";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import Dropdown from "./Dropdown";
import { CirclePlus, X } from "lucide-react";

interface FormData {
  project_name_th: string;
  project_name_en: string;
  abstract_th: string;
  abstract_en: string;
  keyword: string[];
  date: string;
  type_id: number;
  main_owner: { user_id: number; role_group: "main_owner"; value: string };
  owner: { user_id: number; role_group: "owner"; value: string }[]; // Array of owner objects
  advisor: { user_id: number; role_group: "advisor"; value: string }[]; // Array of advisor objects
  file: string | File;
}

const PopupAddProjects = ({ closePopup }: { closePopup: () => void }) => {
  const [formData, setFormData] = useState<FormData>({
    project_name_th: "",
    project_name_en: "",
    abstract_th: "",
    abstract_en: "",
    keyword: [],
    date: "",
    type_id: 0,
    main_owner: { user_id: 0, role_group: "main_owner", value: "" },
    owner: [],
    advisor: [],
    file: "" as string | File,
  });
  const [types, setTypes] = useState<{ id: number; value: string }[]>([]);
  const [ownerSuggestions, setOwnerSuggestions] = useState<User[]>([]);
  const [activeOwnerIndex, setActiveOwnerIndex] = useState<number | null>(null); //สำหรับเช็คว่าอยู่ input ไหน
  const [advisorSuggestions, setAdvisorSuggestions] = useState<User[]>([]);
  const [activeAdvisorIndex, setActiveAdvisorIndex] = useState<number | null>(
    null,
  ); //สำหรับเช็คว่าอยู่ input ไหน

  const getAllUsers = async (query: string, role_id?: string) => {
    try {
      if (query.length < 2) return;

      let url = `${process.env.NEXT_PUBLIC_API_URL}/getAllUsers?search=${query}`;
      if (role_id) {
        url += `&role_id=${role_id}`;
      }

      const response = await axios.get(url);
      const data = await response.data.data;

      return Array.isArray(data) ? data : [];
    } catch {
      return [];
    }
  };

  const handleSelectUserForField = (
    user: User,
    field: "owner" | "advisor",
    index?: number,
  ) => {
    const newData = [...formData[field]];

    if (index !== undefined) {
      newData[index] = {
        user_id: user.user_id!,
        value: `${user.first_name} ${user.last_name}`,
        role_group: field,
      };
    } else {
      // สำหรับกรณี main_owner ซึ่งไม่ใช้ array
      setFormData({
        ...formData,
        [field]: [
          ...formData[field],
          {
            user_id: user.user_id!,
            value: `${user.first_name} ${user.last_name}`,
            role_group: field,
          },
        ],
      });
    }

    setFormData({
      ...formData,
      [field]: newData,
    });

    if (field === "owner") {
      setOwnerSuggestions([]);
    } else if (field === "advisor") {
      setAdvisorSuggestions([]);
    }
  };

  useEffect(() => {
    const fetchType = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getAllTypeProjects`,
        );
        const formattedTypes = response.data.map(
          (item: { type_id: number; type_name: string }) => ({
            id: item.type_id,
            value: item.type_name,
          }),
        );
        setTypes(formattedTypes);
      } catch {}
    };

    const token = localStorage.getItem("token");
    if (token) {
      const decoded: any = jwtDecode(token);

      setFormData((prevFormData) => ({
        ...prevFormData,
        main_owner: {
          user_id: decoded.user_id,
          role_group: "main_owner",
          value: `${decoded.first_name} ${decoded.last_name}`,
        },
      }));
    }

    fetchType();
  }, []);

  const handleTypeSelect = (value: number) => {
    setFormData({ ...formData, type_id: value });
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "owner" | "advisor",
  ) => {
    const newData = [...formData[field]];
    newData[index].value = e.target.value;

    setFormData({
      ...formData,
      [field]: newData,
    });

    const suggestions = await getAllUsers(
      e.target.value,
      field === "advisor" ? "2" : "",
    );

    if (field === "advisor") {
      setAdvisorSuggestions(suggestions!);
    } else {
      setOwnerSuggestions(suggestions!);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      file: e.target.files ? e.target.files[0] : "",
    });
  };

  const handleAdd = (field: "owner" | "advisor") => {
    setFormData({
      ...formData,
      [field]: [
        ...formData[field],
        {
          user_id: 0,
          role_group: field === "owner" ? "owner" : "advisor",
          value: "",
        },
      ], // เพิ่มช่อง input ใหม่
    });
  };

  const handleRemove = (field: "owner" | "advisor", index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index), // ลบ item ที่ index ที่กำหนด
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const mapRoleGroup = [
      {
        user_id: formData.main_owner.user_id,
        role_group: formData.main_owner.role_group,
      },
      ...(formData.owner && formData.owner.length > 0
        ? formData.owner.map((owner) => ({
            user_id: owner.user_id,
            role_group: owner.role_group,
          }))
        : []),
      ...(formData.advisor && formData.advisor.length > 0
        ? formData.advisor.map((advisor) => ({
            user_id: advisor.user_id,
            role_group: advisor.role_group,
          }))
        : []),
    ];

    const formDataToSend = new FormData();
    formDataToSend.append("type_id", formData.type_id.toString());
    formDataToSend.append("project_name_th", formData.project_name_th);
    formDataToSend.append("project_name_en", formData.project_name_en);
    formDataToSend.append("abstract_th", formData.abstract_th);
    formDataToSend.append("abstract_en", formData.abstract_en);
    formDataToSend.append("keywords", JSON.stringify(formData.keyword));
    formDataToSend.append("date", formData.date);
    formDataToSend.append("role_group", JSON.stringify(mapRoleGroup));
    if (formData.file) {
      formDataToSend.append("file", formData.file);
    }
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/postProjects`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      closePopup();
    } catch {}
  };

  return (
    <div className="max-w-[1000px] grid overflow-hidden">
      <div className=" h-10 flex items-center justify-center py-6 shadow-sm">
        Add project
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="px-10 my-5 grid grid-cols-4 gap-2 text-lg items-center overflow-y-auto max-h-[460px]">
          <label>Project name TH</label>
          <input
            type="text"
            className="h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, project_name_th: e.target.value })
            }
            placeholder="project-name"
            value={formData.project_name_th}
          />

          <label>Project name EN</label>
          <input
            type="text"
            className="h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, project_name_en: e.target.value })
            }
            placeholder="project-name-EN"
            value={formData.project_name_en}
          />

          <label>Abstract TH</label>
          <input
            type="text"
            className="h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, abstract_th: e.target.value })
            }
            placeholder="abstract_th"
            value={formData.abstract_th}
          />

          <label>Abstract EN</label>
          <input
            type="text"
            className="h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg"
            onChange={(e) =>
              setFormData({ ...formData, abstract_en: e.target.value })
            }
            placeholder="abstract_en"
            value={formData.abstract_en}
          />

          <label>Keyword</label>
          <input
            type="text"
            className="h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg"
            placeholder="Enter keywords, separated by commas"
            value={formData.keyword.join(", ")}
            onChange={(e) => {
              const keywords = e.target.value
                .split(",")
                .map((keyword) => keyword.trim());
              setFormData({ ...formData, keyword: keywords });
            }}
          />

          <label>Type Project</label>
          <Dropdown
            items={types}
            onSelect={handleTypeSelect}
            className="col-span-3"
          />

          <label>Date</label>
          <input
            type="date"
            className="h-[50px] col-span-3 pl-3 pr-4 border border-[#c5c5c5] text-base text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors"
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            placeholder="Select a date"
            value={formData.date}
          />

          <label>Main owner</label>
          <div className="col-span-3 col-start-2 relative">
            <input
              disabled
              type="text"
              className="h-[50px] pl-2 border border-[#c5c5c5] text-base w-full rounded-lg"
              value={formData.main_owner.value}
              placeholder="main owner"
            />
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
          />
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

export default PopupAddProjects;
