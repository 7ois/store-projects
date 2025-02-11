"use client";
import { Book, CirclePlus, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { usePopup } from "@/context/PopupContext";
import Popup from "@/components/Popup";
import Dropdown from "@/components/Dropdown";
import axios from "axios";
import { User } from "@/entity/user";
import { Project } from "@/entity/project";
import { jwtDecode } from "jwt-decode";
// import SearchDropdown from "@/components/SearchDropdown";

const Page = () => {
  const { openPopup, closePopup } = usePopup();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get<{ success: boolean; data: Project[] }>(
        `${process.env.NEXT_PUBLIC_API_URL}/getMyProjects`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setProjects(response.data.data);
    } catch {
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProjects();
  }, []);
  const handleClosePopup = () => {
    closePopup();
    fetchProjects(); // เรียก fetchProjects หลังจากที่ปิด Popup
  };

  return (
    <div className="flex w-full gap-5">
      {/* <div className='w-[400px] h-fit shadow-md rounded-[10px] overflow-hidden'>
                <div className='grid gap-10 items-center justify-center my-10'>
                    <div className='w-[200px] h-[200px] rounded-full bg-blue text-[#fff] flex items-center justify-center'>
                        <Camera size={50} />
                    </div>
                    <div className='grid items-center justify-center'>
                        <h1 className='text-blue text-xl'>{userName}</h1>
                        <p className='text-[#B4B4B4]'>{email}</p>
                    </div>
                </div>
                <button className='bg-blue h-[50px] text-[#fff] w-full text-xl'>
                    Edit profile
                </button>
            </div> */}
      <div className="p-5 rounded-[10px] shadow-md w-full h-full">
        <div className="relative flex items-center w-full mb-5 justify-end">
          <div className="absolute -left-7 border w-[200px] h-[50px] bg-blue flex items-center justify-center">
            <h1 className="text-xl text-[#fff]">My project</h1>
          </div>
          <button
            className="flex gap-2 items-center border text-blue border-blue p-[10px] rounded-[10px]"
            onClick={openPopup}
          >
            <Book size={20} />
            Add Project
          </button>
        </div>

        {loading && <p>Loading...</p>}

        {!loading &&
          projects.map((item) => (
            <div
              key={item.project_id}
              className="grid gap-2 items-center rounded-[10px] shadow-md px-5 py-2 cursor-pointer w-full h-[100px] overflow-hidden"
            >
              <h1 className="text-xl">{item.project_name}</h1>
              <p className="text-[#B4B4B4] text-base w-full truncate">
                {item.description}
              </p>
              {item.keywords && (
                <p className="text-sm text-gray-500">
                  Keywords: {item.keywords}
                </p>
              )}
              {item.users && (
                <p className="text-sm text-gray-500">
                  Users:{" "}
                  {item.users
                    .map((user) => `${user.first_name} ${user.last_name ?? ""}`)
                    .join(", ")}
                </p>
              )}
            </div>
          ))}
      </div>
      <Popup>
        <PopupPage closePopup={handleClosePopup} />
      </Popup>
    </div>
  );
};

export default Page;

interface FormData {
  project_name: string;
  description: string;
  year: string;
  type_id: number;
  main_owner: { user_id: number; role_group: "main_owner"; value: string };
  owner: { user_id: number; role_group: "owner"; value: string }[]; // Array of owner objects
  advisor: { user_id: number; role_group: "advisor"; value: string }[]; // Array of advisor objects
  file: string | File;
}

const PopupPage = ({ closePopup }: { closePopup: () => void }) => {
  const [formData, setFormData] = useState<FormData>({
    project_name: "",
    description: "",
    year: "",
    type_id: 0,
    main_owner: { user_id: 0, role_group: "main_owner", value: "" },
    owner: [],
    advisor: [],
    file: "" as string | File,
  });
  const [types, setTypes] = useState<{ id: number; value: string }[]>([]);
  const [mainOwnerSuggestions, setMainOwnerSuggestions] = useState<User[]>([]);
  const [isMainOwnerActive, setIsMainOwnerActive] = useState(false);
  const [ownerSuggestions, setOwnerSuggestions] = useState<User[]>([]);
  const [activeOwnerIndex, setActiveOwnerIndex] = useState<number | null>(null); //สำหรับเช็คว่าอยู่ input ไหน
  const [advisorSuggestions, setAdvisorSuggestions] = useState<User[]>([]);
  const [activeAdvisorIndex, setActiveAdvisorIndex] = useState<number | null>(
    null
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

  const handleChangeMainOwner = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFormData({
      ...formData,
      main_owner: {
        ...formData.main_owner,
        value: e.target.value,
      },
    });

    const suggestions = await getAllUsers(e.target.value, "");

    setMainOwnerSuggestions(suggestions!);
  };

  const handleSelectUser = (user: User) => {
    setFormData({
      ...formData,
      main_owner: {
        ...formData.main_owner,
        user_id: user.user_id!,
        value: `${user.first_name} ${user.last_name}`,
      },
    });

    setMainOwnerSuggestions([]);
  };

  const handleSelectUserForField = (
    user: User,
    field: "owner" | "advisor",
    index?: number
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
          `${process.env.NEXT_PUBLIC_API_URL}/getAllTypeProjects`
        );
        const formattedTypes = response.data.map(
          (item: { type_id: number; type_name: string }) => ({
            id: item.type_id,
            value: item.type_name,
          })
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
    field: "owner" | "advisor"
  ) => {
    const newData = [...formData[field]];
    newData[index].value = e.target.value;

    setFormData({
      ...formData,
      [field]: newData,
    });

    const suggestions = await getAllUsers(
      e.target.value,
      field === "advisor" ? "2" : ""
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
    formDataToSend.append("project_name", formData.project_name);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("keywords", "");
    formDataToSend.append("date", formData.year);
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
        }
      );

      closePopup();
    } catch {}
  };

  return (
    <>
      <div className="max-w-[1000px] grid overflow-hidden">
        <div className=" h-10 flex items-center justify-center py-6 shadow-sm">
          Header
        </div>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="p-10 grid grid-cols-4 gap-2 text-lg items-center overflow-y-auto max-h-[590px]">
            <label>Project name</label>
            <input
              type="text"
              className="h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, project_name: e.target.value })
              }
              placeholder="project-name"
              value={formData.project_name}
            />

            <label>Description</label>
            <input
              type="text"
              className="h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              placeholder="description"
              value={formData.description}
            />

            <label>Type Project</label>
            <Dropdown
              items={types}
              onSelect={handleTypeSelect}
              className="col-span-3"
            />

            <label>Year</label>
            <input
              type="text"
              className="h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg"
              onChange={(e) =>
                setFormData({ ...formData, year: e.target.value })
              }
              placeholder="year"
              value={formData.year}
            />

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
                onBlur={() =>
                  setTimeout(() => setIsMainOwnerActive(false), 200)
                }
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
                  onBlur={() =>
                    setTimeout(() => setActiveOwnerIndex(null), 200)
                  }
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
    </>
  );
};
