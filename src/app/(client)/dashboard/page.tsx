"use client"
import React, { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'

interface Project {
    id: number;
    project_name: string;
    description: string;
    year: string;
    file_download: string;
}

const page = () => {

    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await fetch('http://localhost:3001/projects'); // แก้ไข endpoint ให้ตรงกับ API ของคุณ
                const data = await response.json();
                if (response.ok) {
                    setProjects(data.data); // ต้องตรงกับ key ใน response
                } else {
                    console.error('Error fetching projects:', data.error);
                }
            } catch (error) {
                console.error('Error fetching projects:', error);
            }
        };

        fetchProjects();
    }, []);

    return (
        <div className='grid gap-3'>
            {Array.isArray(projects) && projects.length > 0 ? (
                projects.map((project, index) => (
                    <div key={index}
                        className='grid gap-2 items-center rounded-[10px] shadow-md px-5 py-2 cursor-pointer w-full h-[100px] overflow-hidden'
                    >
                        <h1 className='text-xl'>{project.project_name}</h1>
                        <p className='text-[#B4B4B4] text-base w-full truncate'>{project.description}</p>
                    </div>
                ))
            ) : (
                <p>No projects available.</p>
            )}

        </div >
    )
}

export default page