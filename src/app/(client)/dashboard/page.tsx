"use client"
import React, { useEffect, useState } from 'react'
// import { useRouter } from 'next/navigation'

interface Project {
    id: number;
    name: string;
    description: string;
    year: string;
    file_download: string;
}

const page = () => {

    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetcProject = async () => {
            try {
                const res = await fetch('http://localhost:3001/projects')
                const data = await res.json()
                console.log(data)
                setProjects(data)
            } catch (error) {
                console.log('Error fetching projects:', error)
            }
        }
        fetcProject()
    }, [])
    return (
        <div className='grid gap-3'>
            {Array.isArray(projects) && projects.length > 0 ? (
                projects.map((project, index) => (
                    <div key={index}
                        className='grid gap-2 items-center rounded-[10px] shadow-md px-5 py-2 cursor-pointer w-full h-[100px] overflow-hidden'
                    >
                        <h1 className='text-xl'>{project.name}</h1>
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