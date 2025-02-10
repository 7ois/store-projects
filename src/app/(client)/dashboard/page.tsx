"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'
import Link from 'next/link';

interface Project {
    date: string;
    description: string;
    file_name: string;
    file_path: string;
    keywords: string;
    project_id: number
    project_name: string;
    type_id: number
}

const page = () => {

    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get(('http://localhost:3001/api/getProjects'))
                const data = response.data
                console.log("API Response:", data);

                setProjects(data.data)
            } catch (err) {
                console.error('Error fetching projects:', err);
            }
        }

        fetchProjects()
    }, [])

    return (
        <div className='grid gap-3'>
            {projects.length === 0 ? "No data available" :
                projects.map((project, index) => {
                    return (
                        <Link href={`/dashboard/${project.project_id}`} key={project.project_id} className="grid gap-2 items-center rounded-[10px] shadow-md px-5 py-2 cursor-pointer w-full h-[100px] overflow-hidden">
                            <h1 className="text-xl">{project.project_name}</h1>
                            <p className="text-[#B4B4B4] text-base w-full truncate">{project.description}</p>
                        </Link>
                    );
                })
            }
        </div>
    );
}

export default page