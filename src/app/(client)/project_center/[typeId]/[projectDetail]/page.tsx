"use client";

// import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { Project } from "@/entity/project";
import { ChevronLeft, MoveLeft } from "lucide-react";

const Page = () => {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);

  const router = useRouter();
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getProject/${params.projectDetail}`
        );
        setProject(response.data.project);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };
    if (params) fetchProject();
  }, [params]);

  return (
    <div>
      <ChevronLeft
        onClick={() => router.back()}
        size={25}
        color="#1C3B6C"
        className="cursor-pointer"
      />
      {project ? (
        <div>
          {/* <h1>{project.project_id}</h1> */}
          <div className="grid gap-3">
            <div className="grid grid-cols-[200px_auto]">
              <h1>Title:</h1>
              <h1>{project.project_name_th}</h1>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1>Orter Title:</h1>
              <h1>{project.project_name_en}</h1>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1>Abstract:</h1>
              <h1>{project.abstract_th}</h1>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1>Orter Abstract:</h1>
              <h1>{project.abstract_en}</h1>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1>Date:</h1>
              <h1>{project.date}</h1>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1>Keywords:</h1>
              <h1>-</h1>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1>Type:</h1>
              <h1>{project.type_id}</h1>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1>Owner:</h1>
              <ul className="flex">
                <li>
                  <h1>
                    {project.users
                      ?.filter(
                        (user) =>
                          user.role_group === "main_owner" ||
                          user.role_group === "owner"
                      )
                      .map((user) => `${user.first_name} ${user.last_name}`)
                      .join(", ")}
                  </h1>
                </li>
              </ul>
            </div>
            <div className="grid grid-cols-[200px_auto]">
              <h1>Advisor:</h1>
              <ul className="flex">
                <li>
                  <h1>
                    {project.users
                      ?.filter((user) => user.role_group === "advisor")
                      .map((user) => `${user.first_name} ${user.last_name}`)
                      .join(", ")}
                  </h1>
                </li>
              </ul>
            </div>
          </div>
          {/* <div className="mt-4">
            <h3>Users in this Project:</h3>
            <ul>
              {project.users?.map((user) => (
                <li key={user.user_id}>
                  <strong>
                    {user.first_name} {user.last_name}
                  </strong>{" "}
                  ({user.role_group})<br />
                  Email: <a href={`mailto:${user.email}`}>{user.email}</a>
                </li>
              ))}
            </ul>
          </div> */}
          <embed
            src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}${project.file_path}`}
            width="600"
            height="400"
          />
          <a
            href={`${process.env.NEXT_PUBLIC_UPLOAD_URL}${project.file_path}`}
            download={project.file_name}
            className="text-blue-500 mt-2 block"
          >
            Download PDF
          </a>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Page;
