"use client";
import { User } from "@/entity/user";
import axios from "axios";
import { CirclePlus, RotateCcw, X } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import Dropdown from "./Dropdown";
import {
  FormProjectData,
  formProjectSchema,
  validateFormData,
} from "@/lib/project";

interface PopupEditProjectProps {
  selectedProjectId: number | null;
  closePopup: () => void;
}

const PopupEditProject = ({
  selectedProjectId,
  closePopup,
}: PopupEditProjectProps) => {
  const [types, setTypes] = useState<{ id: number; value: string }[]>([]);
  const [ownerSuggestions, setOwnerSuggestions] = useState<User[]>([]);
  const [activeOwnerIndex, setActiveOwnerIndex] = useState<number | null>(null);
  const [advisorSuggestions, setAdvisorSuggestions] = useState<User[]>([]);
  const [activeAdvisorIndex, setActiveAdvisorIndex] = useState<number | null>(
    null,
  );
  const [formData, setFormData] = useState<FormProjectData>({
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

  const [validationErrors, setValidationErrors] = useState<{
    [key: string]: string;
  }>({});

  const validateForm = (): boolean => {
    return validateFormData(formData, formProjectSchema, setValidationErrors);
  };

  const [originalFile, setOriginalFile] = useState<string | null>("");
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [isFileModified, setIsFileModified] = useState(false);

  const getAllUsers = async (query: string, role_id?: string) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_API_URL}/getAllUsers`;

      const params = new URLSearchParams();
      if (query) {
        params.append("search", query);
      }
      if (role_id) {
        params.append("role_id", role_id);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const response = await axios.get(url);
      const data = await response.data.data;

      const filteredData = Array.isArray(data)
        ? data.filter(
            (user) =>
              user.role_id !== 4 &&
              user.user_id !== formData.main_owner.user_id,
          )
        : [];

      return filteredData;
    } catch {
      return [];
    }
  };

  useEffect(() => {
    if (!selectedProjectId) return;

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

    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getProject/${selectedProjectId}`,
        );
        const mainOwner = response.data.project.users.find(
          (user: User) => user.role_group === "main_owner",
        ) || { user_id: 0, role_group: "main_owner", value: "" };

        const owners = response.data.project.users
          .filter((user: User) => user.role_group === "owner")
          .map((owner: User) => ({
            user_id: owner.user_id,
            role_group: owner.role_group,
            value: `${owner.first_name} ${owner.last_name}`,
          }));

        const advisor = response.data.project.users
          .filter((user: User) => user.role_group === "advisor")
          .map((ad: User) => ({
            user_id: ad.user_id,
            role_group: ad.role_group,
            value: `${ad.first_name} ${ad.last_name}`,
          }));

        const projectFile = response.data.project.file_path
          ? `${process.env.NEXT_PUBLIC_UPLOAD_URL}${response.data.project.file_path}`
          : "";

        setOriginalFile(projectFile);

        const selectedType = response.data.project.type_id;

        setFormData((prev) => ({
          ...prev,
          project_name_th: response.data.project.project_name_th || "",
          project_name_en: response.data.project.project_name_en || "",
          abstract_th: response.data.project.abstract_th || "",
          abstract_en: response.data.project.abstract_en || "",
          keyword: response.data.project.keywords || [],
          date: response.data.project.date
            ? response.data.project.date.split("T")[0]
            : "",
          type_id: selectedType || 0,
          main_owner: response.data.project.main_owner || {
            user_id: mainOwner.user_id,
            role_group: mainOwner.role_group,
            value: `${mainOwner.first_name} ${mainOwner.last_name}`,
          },
          owner: owners || [],
          advisor: advisor || [],
          file: projectFile || "",
        }));
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };

    fetchType();
    fetchProject();
  }, []);

  const handleFocus = async (index: number, field: "owner" | "advisor") => {
    const suggestions = await getAllUsers("", field === "advisor" ? "2" : "");

    if (field === "advisor") {
      setActiveAdvisorIndex(index);
      setAdvisorSuggestions(suggestions!);
    } else {
      setActiveOwnerIndex(index);
      setOwnerSuggestions(suggestions!);
    }
  };

  const handleChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
    field: "owner" | "advisor",
  ) => {
    const newData = [...formData[field]];
    newData[index] = {
      user_id: 0,
      value: e.target.value,
      role_group: field,
    };

    // อัปเดต formData
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
      ],
    });
  };

  const handleRemove = (field: "owner" | "advisor", index: number) => {
    setFormData({
      ...formData,
      [field]: formData[field].filter((_, i) => i !== index), // ลบ item ที่ index ที่กำหนด
    });

    setValidationErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };

      Object.keys(updatedErrors).forEach((key) => {
        if (key.startsWith(`${field}.${field}.${index}`)) {
          delete updatedErrors[key];
        }
      });

      Object.keys(updatedErrors).forEach((key) => {
        const keyParts = key.split(".");
        if (keyParts[0] === field && keyParts[1] === field) {
          const errorIndex = parseInt(keyParts[2], 10);
          if (errorIndex > index) {
            const newKey = `${field}.${field}.${errorIndex - 1}`;
            updatedErrors[newKey] = updatedErrors[key];
            delete updatedErrors[key];
          }
        }
      });

      return updatedErrors;
    });
  };

  const handleTypeSelect = (value: number) => {
    setFormData((prev) => ({
      ...prev,
      type_id: value,
    }));
    setValidationErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors.type_id;
      return updatedErrors;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;

    if (file) {
      setFormData((prev) => ({
        ...prev,
        file: file,
      }));

      setIsFileModified(true);
    }
  };

  const handleRevertFile = () => {
    if (originalFile) {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setFormData((prev) => ({
        ...prev,
        file: originalFile,
      }));

      setIsFileModified(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const isValid = validateForm();
    if (!isValid) return;

    const mapRoleGroup = [
      {
        user_id: formData.main_owner.user_id,
        role_group: formData.main_owner.role_group,
      },
      ...(formData.owner && formData.owner.length > 0
        ? formData.owner
            .filter((owner) => owner.user_id)
            .map((owner) => ({
              user_id: owner.user_id,
              role_group: owner.role_group,
            }))
        : []),
      ...(formData.advisor && formData.advisor.length > 0
        ? formData.advisor
            .filter((advisor) => advisor.user_id)
            .map((advisor) => ({
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

    if (formData.file && formData.file !== "" && formData.file !== undefined) {
      formDataToSend.append("file", formData.file);
    }

    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_API_URL}/updateProject/${selectedProjectId}`,
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string,
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    setValidationErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[field];
      return updatedErrors;
    });
  };

  const handleTextAreaChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
    field: string,
  ) => {
    setFormData({ ...formData, [field]: e.target.value });
    setValidationErrors((prevErrors) => {
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[field];
      return updatedErrors;
    });
  };

  return (
    <div className="max-w-[1000px] text-lg grid">
      <div className="text-2xl h-20 flex items-center justify-center py-6 shadow-sm bg-blue rounded-se-lg text-white">
        แก้ไขโครงงาน
      </div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="grid gap-6 px-10 py-5 items-center overflow-y-auto max-h-[460px]">
          <div className="grid grid-cols-4 items-center relative">
            <label>ชื่อโครงงาน</label>
            <input
              type="text"
              className="h-[50px] px-2 border border-[#c5c5c5] col-span-3 rounded-lg"
              onChange={(e) => handleInputChange(e, "project_name_th")}
              placeholder="ชื่อโครงงาน"
              value={formData?.project_name_th}
            />
            {validationErrors.project_name_th && (
              <div className="text-primary absolute -bottom-6 left-1/4">
                {validationErrors.project_name_th}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 items-center relative">
            <label>Project name</label>
            <input
              type="text"
              className="h-[50px] px-2 border border-[#c5c5c5] col-span-3 rounded-lg"
              onChange={(e) => handleInputChange(e, "project_name_en")}
              placeholder="Project name"
              value={formData?.project_name_en}
            />
            {validationErrors.project_name_en && (
              <div className="text-primary absolute -bottom-6 left-1/4">
                {validationErrors.project_name_en}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 items-center relative">
            <label>บทคัดย่อ</label>
            <textarea
              className="h-[150px] px-2 border border-[#c5c5c5] col-span-3 rounded-lg resize-none"
              onChange={(e) => handleTextAreaChange(e, "abstract_th")}
              placeholder="บทคัดย่อ"
              value={formData?.abstract_th}
            />
            {validationErrors.abstract_th && (
              <div className="text-primary absolute -bottom-6 left-1/4">
                {validationErrors.abstract_th}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 items-center relative">
            <label>Abstract</label>
            <textarea
              className="h-[150px] px-2 border border-[#c5c5c5] col-span-3 rounded-lg resize-none"
              onChange={(e) => handleTextAreaChange(e, "abstract_en")}
              placeholder="abstract"
              value={formData?.abstract_en}
            />
            {validationErrors.abstract_en && (
              <div className="text-primary absolute -bottom-6 left-1/4">
                {validationErrors.abstract_en}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 items-center relative">
            <label>คำสำคัญ</label>
            <input
              type="text"
              className="h-[50px] px-2 border border-[#c5c5c5] col-span-3 rounded-lg"
              placeholder='ป้อนคำหลักโดยคั่นด้วยเครื่องหมายจุลภาค ","'
              value={(formData?.keyword || []).join(", ")}
              onChange={(e) => {
                const keywords = e.target.value
                  .split(",")
                  .map((keyword) => keyword.trim());

                setFormData({ ...formData, keyword: keywords });
                setValidationErrors((prevErrors) => {
                  const updatedErrors = { ...prevErrors };
                  delete updatedErrors.keyword;
                  return updatedErrors;
                });
              }}
            />
            {validationErrors.keyword && (
              <div className="text-primary absolute -bottom-6 left-1/4">
                {validationErrors.keyword}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 items-center relative">
            <label>ประเภทโครงงาน</label>
            <Dropdown
              items={types}
              onSelect={handleTypeSelect}
              selectedId={formData.type_id}
              className="col-span-3"
            />
            {validationErrors.type_id && (
              <div className="text-primary absolute -bottom-6 left-1/4">
                {validationErrors.type_id}
              </div>
            )}
          </div>

          <div className="grid grid-cols-4 items-center relative">
            <label>Date</label>
            <input
              type="date"
              className="h-[50px] col-span-3 pl-3 pr-4 border border-[#c5c5c5] text-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-colors"
              onChange={(e) => handleInputChange(e, "date")}
              placeholder="Select a date"
              value={formData.date || ""}
            />
          </div>

          <div className="grid grid-cols-4 items-center relative">
            <label>เจ้าของหลัก</label>
            <input
              disabled
              type="text"
              className="h-[50px] col-span-3 col-start-2 px-2 border border-[#c5c5c5] w-full rounded-lg"
              value={formData.main_owner.value}
              placeholder="main owner"
            />
          </div>

          <div className="grid grid-cols-4 items-center">
            <label>เจ้าของ</label>
            {formData.owner.map((owner, index) => (
              <div key={index} className="col-span-3 col-start-2 relative mb-6">
                <input
                  type="text"
                  className="h-[50px] px-2 border border-[#c5c5c5] w-full rounded-lg"
                  value={owner.value}
                  placeholder="เจ้าของ"
                  onChange={(e) => handleChange(e, index, "owner")}
                  onFocus={() => handleFocus(index, "owner")}
                  onBlur={() =>
                    setTimeout(() => setActiveOwnerIndex(null), 200)
                  }
                />
                {validationErrors[`owner.${index}`] && (
                  <div className="text-primary absolute -bottom-6 left-0">
                    {validationErrors[`owner.${index}`]}
                  </div>
                )}
                {index === activeOwnerIndex &&
                  Array.isArray(ownerSuggestions) &&
                  ownerSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-white border-[1px] rounded-lg border-[#c5c5c5] shadow-md mt-2 z-10 overflow-hidden">
                      {ownerSuggestions.map((value, idx) => (
                        <div
                          key={idx}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() =>
                            handleSelectUserForField(value, "owner", index)
                          }
                        >
                          <p>
                            {value.first_name} {value.last_name}
                          </p>
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
              className="h-[50px] text-white px-2 bg-blue col-span-3 rounded-lg col-start-2 flex items-center justify-center gap-3 transition duration-75 hover:bg-orange"
            >
              <div className="w-full grid grid-cols-2 gap-5 items-center justify-centerr">
                <div className="w-full flex  items-center justify-end">
                  <CirclePlus size={20} />
                </div>
                <p className="text-start">เพิ่มเจ้าของ</p>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-4 items-center">
            <label>ที่ปรึกษา</label>
            {formData.advisor.map((advisor, index) => (
              <div key={index} className="col-span-3 col-start-2 relative mb-6">
                <input
                  type="text"
                  className="h-[50px] px-2 border border-[#c5c5c5] w-full rounded-lg"
                  value={advisor.value}
                  placeholder="ที่ปรึกษา"
                  onChange={(e) => handleChange(e, index, "advisor")}
                  onFocus={() => handleFocus(index, "advisor")}
                  onBlur={() =>
                    setTimeout(() => setActiveAdvisorIndex(null), 200)
                  }
                />
                {validationErrors[`advisor.${index}`] && (
                  <div className="text-primary absolute -bottom-6 left-0">
                    {validationErrors[`advisor.${index}`]}
                  </div>
                )}
                {index === activeAdvisorIndex &&
                  Array.isArray(advisorSuggestions) &&
                  advisorSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 w-full bg-white border-[1px] rounded-lg border-[#c5c5c5] shadow-md mt-2 z-10 overflow-hidden">
                      {advisorSuggestions.map((value, idx) => (
                        <div
                          key={idx}
                          className="p-2 cursor-pointer hover:bg-gray-100"
                          onClick={() =>
                            handleSelectUserForField(value, "advisor", index)
                          }
                        >
                          <p>
                            {value.first_name} {value.last_name}
                          </p>
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
              className="h-[50px] text-white px-2 bg-blue col-span-3 rounded-lg col-start-2 flex items-center justify-center gap-3 transition duration-75 hover:bg-orange"
            >
              <div className="w-full grid grid-cols-2 gap-5 items-center justify-centerr">
                <div className="w-full flex  items-center justify-end">
                  <CirclePlus size={20} />
                </div>
                <p className="text-start">เพิ่มที่ปรึกษา</p>
              </div>
            </button>
          </div>

          <div className="grid grid-cols-4 items-center relative">
            <label>File</label>
            {formData.file && typeof formData.file === "string" && (
              <div>
                <p>ไฟล์ปัจจุบัน:</p>
                <a
                  href={formData.file}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {formData.file.split("/").pop()}
                </a>
              </div>
            )}

            <input
              ref={fileInputRef}
              onChange={handleFileChange}
              type="file"
              accept=".pdf"
            />

            {originalFile && isFileModified && (
              <button
                type="button"
                onClick={handleRevertFile}
                className="h-[50px] text-white px-2 bg-blue col-span-3 rounded-lg col-start-2 flex items-center justify-center mt-5 transition duration-75 hover:bg-orange"
              >
                <div className="w-full grid grid-cols-[auto_200px] gap-5 items-center justify-center">
                  <RotateCcw size={20} />
                  <p>เปลี่ยนกลับเป็นไฟล์ต้นฉบับ</p>
                </div>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-center gap-10 h-auto py-6 shadow-md">
          <button
            type="button"
            className="border w-[300px] h-[50px] rounded-[10px] border-primary text-primary transition duration-75 hover:bg-primary hover:text-white"
            onClick={closePopup}
          >
            ยกเลิก
          </button>
          <button className="w-[300px] h-[50px] rounded-[10px] bg-blue text-[#fff] transition duration-75 hover:bg-orange">
            บันทึก
          </button>
        </div>
      </form>
    </div>
  );
};

export default PopupEditProject;
