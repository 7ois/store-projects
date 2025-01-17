'use client'

import { Book, Camera } from 'lucide-react'
import React, { useState } from 'react'

const data = [
    { id: 1, title: "What project?", description: "It's my time I hope you miss each other. I want to hug you." },
]

const page = () => {
    const userName = "Passakorn Wannapak"
    const email = "passakorn.wa@rmuti.ac.th"

    return (
        <div className='flex w-full gap-5'>
            <div className='w-[400px] h-fit shadow-md rounded-[10px] overflow-hidden'>
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
            </div>
            <div className='p-5 rounded-[10px] shadow-md w-full h-full'>
                <div className='relative flex items-center w-full mb-5 justify-end'>
                    <div className='absolute -left-7 border w-[200px] h-[50px] bg-blue flex items-center justify-center'>
                        <h1 className='text-xl text-[#fff]'>My project</h1>
                    </div>
                    <button className='flex gap-2 items-center border text-blue border-blue p-[10px] rounded-[10px]'>
                        <Book size={20} />
                        Add Project
                    </button>
                </div>
                {data.map((item) => (
                    <div key={item.id}
                        className='grid gap-2 items-center rounded-[10px] shadow-md px-5 py-2 cursor-pointer w-full h-[100px] overflow-hidden'
                    >
                        <h1 className='text-xl'>{item.title}</h1>
                        <p className='text-[#B4B4B4] text-base w-full truncate'>{item.description}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default page