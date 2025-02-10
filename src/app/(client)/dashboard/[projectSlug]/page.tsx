"use client";

// import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";
import { Project } from "@/entity/project";

const Page = () => {
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);

  console.log("Params from useParams():", params);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3001/api/getProject/${params.projectSlug}`,
        );
        setProject(response.data.project);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };
    if (params) fetchProject();
  }, [params]);
  return (
    <div className="overflow-y-auto max-h-[700px]">
      <h1>Page ID: {params.projectSlug}</h1>
      {project ? (
        <div>
          <h1>{project.project_id}</h1>
          <h2>{project.project_name}</h2>
          <p>{project.description}</p>
          <p>{project.date}</p>
          <embed
            src={`http://localhost:3001${project.file_path}`}
            width="600"
            height="400"
          />
          <a
            href={`http://localhost:3001${project.file_path}`}
            download={project.file_name}
            className="text-blue-500 mt-2 block"
          >
            Download PDF
          </a>

          <div className="mt-4">
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
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Page;
