'use client'
import { Book, Camera, CirclePlus, X } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { usePopup } from "@/context/PopupContext";
import Popup from '@/components/Popup';
import Dropdown from '@/components/Dropdown';
import axios from 'axios';
import SearchDropdown from '@/components/SearchDropdown';

const data = [
    { id: 1, title: "What project?", description: "It's my time I hope you miss each other. I want to hug you." },
]

const page = () => {
    // const userName = "Passakorn Wannapak"
    // const email = "passakorn.wa@rmuti.ac.th"

    const { openPopup, closePopup } = usePopup();

    return (
        <div className='flex w-full gap-5'>
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
            <div className='p-5 rounded-[10px] shadow-md w-full h-full'>
                <div className='relative flex items-center w-full mb-5 justify-end'>
                    <div className='absolute -left-7 border w-[200px] h-[50px] bg-blue flex items-center justify-center'>
                        <h1 className='text-xl text-[#fff]'>My project</h1>
                    </div>
                    <button className='flex gap-2 items-center border text-blue border-blue p-[10px] rounded-[10px]'
                        onClick={openPopup}>
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
            <Popup>
                <Popuppage closePopup={closePopup} />
            </Popup>
        </div>
    )
}

export default page


const Popuppage = ({ closePopup }: { closePopup: () => void }) => {

    const [formData, setFormData] = useState({
        project_name: '',
        description: '',
        year: '',
        type_id: 0,
        main_owner: { user_id: 0, role_group: 'main_owner', value: '' },
        owner: [{ user_id: 0, role_group: 'owner', value: '' }],
        advisor: [{ user_id: 0, role_group: 'advisor', value: '' }],
        file: '' as string | File
    })
    const [types, setTypes] = useState<{ id: number, value: string }[]>([])

    useEffect(() => {
        const fetchType = async () => {
            try {
                const response = await axios.get('http://localhost:3001/api/getTypeProjects');
                console.log(response.data)
                const formattedTypes = response.data.map((item: { type_id: number; type_name: string }) => ({
                    id: item.type_id,
                    value: item.type_name,
                }));
                setTypes(formattedTypes);
            } catch (error) {
                console.error("Error fetching roles:", error);
            }
        };

        fetchType();
    }, []);

    useEffect(() => {

    }, [])

    const handleTypeSelect = (value: number) => {
        setFormData({ ...formData, type_id: value });
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, field: 'owner' | 'advisor') => {
        const newData = [...formData[field]];
        newData[index].value = e.target.value;
        setFormData({
            ...formData,
            [field]: newData
        });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            file: e.target.files ? e.target.files[0] : ''
        });
    };

    const handleAdd = (field: 'owner' | 'advisor') => {
        setFormData({
            ...formData,
            [field]: [...formData[field], { user_id: 0, role_group: field === 'owner' ? 'owner' : 'advisor', value: '' }] // เพิ่มช่อง input ใหม่
        });
    };

    const handleRemove = (field: 'owner' | 'advisor', index: number) => {
        if (index === 0) return;
        setFormData({
            ...formData,
            [field]: formData[field].filter((_, i) => i !== index), // ลบ item ที่ index ที่กำหนด
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const mapRoleGroup = [
            { user_id: 1, role_group: formData.main_owner.role_group },
            ...formData.owner.map((owner, index) => ({
                user_id: index + 2, role_group: owner.role_group
            })),
            ...formData.advisor.map((advisor, index) => ({
                user_id: index + 5, role_group: advisor.role_group
            })),
        ]

        const formDataToSend = new FormData();
        formDataToSend.append('type_id', formData.type_id.toString());
        formDataToSend.append('project_name', formData.project_name);
        formDataToSend.append('description', formData.description);
        formDataToSend.append('keywords', '');
        formDataToSend.append('date', formData.year);
        formDataToSend.append('role_group', JSON.stringify(mapRoleGroup));
        if (formData.file) {
            formDataToSend.append('file', formData.file);
        }
        // console.log(JSON.stringify(mapRoleGroup))
        formDataToSend.forEach((value, key) => {
            console.log(`${key}:`, value);
        });
        // try {
        //     const respone = await axios.post('http://localhost:3001/api/postProjects', formDataToSend, {
        //         headers: {
        //             'Content-Type': 'multipart/form-data'
        //         }
        //     });
        //     closePopup();
        // } catch (err) {
        //     console.error("Error create project: ", err)
        // }
    }

    return (
        <div className='max-w-[1000px] grid overflow-hidden'>
            <div className=' h-10 flex items-center justify-center pb-6 shadow-sm'>Header</div>
            <form onSubmit={handleSubmit} encType='multipart/form-data'>
                <div className='p-10 grid grid-cols-4 gap-2 text-lg items-center overflow-y-auto max-h-[590px]'>
                    <label>Project name</label>
                    <input
                        type="text"
                        className='h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg'
                        onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                        placeholder='project-name'
                        value={formData.project_name}
                    />

                    <label>Description</label>
                    <input
                        type="text"
                        className='h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg'
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder='description'
                        value={formData.description}
                    />

                    <label>Type Project</label>
                    <Dropdown items={types} onSelect={handleTypeSelect} className='col-span-3' />

                    <label>Year</label>
                    <input
                        type="text"
                        className='h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg'
                        onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                        placeholder='year'
                        value={formData.year}
                    />

                    <label>Main owner</label>
                    <input
                        type="text"
                        className='h-[50px] pl-2 border border-[#c5c5c5] text-base col-span-3 rounded-lg'
                        onChange={(e) => setFormData({ ...formData, main_owner: { ...formData.main_owner, value: e.target.value } })}
                        placeholder='main owner'
                        value={formData.main_owner.value}
                    />

                    <label>Owner</label>
                    {formData.owner.map((owner, index) => (

                        <div key={index} className='col-span-3 col-start-2 relative' >
                            <input
                                type="text"
                                className="h-[50px] pl-2 border border-[#c5c5c5] text-base w-full rounded-lg"
                                value={owner.value}
                                onChange={(e) => handleChange(e, index, 'owner')}
                                placeholder="owner"
                            />
                            {index !== 0 && (
                                <X
                                    size={20}
                                    className='text-primary cursor-pointer absolute top-1/2 right-3 -translate-y-1/2'
                                    onClick={() => handleRemove('owner', index)}
                                />
                            )}
                        </div>
                    ))
                    }
                    <button type="button" onClick={() => handleAdd('owner')} className="h-[50px] text-white pl-2 bg-blue text-base col-span-3 rounded-lg col-start-2 flex items-center justify-center gap-3"><CirclePlus size={20} />ADD owner</button>

                    <label>Advisor</label>
                    {
                        formData.advisor.map((advisor, index) => (
                            <div key={index} className='col-span-3 col-start-2 relative'>
                                <input
                                    type="text"
                                    className="h-[50px] pl-2 border border-[#c5c5c5] text-base w-full rounded-lg"
                                    value={advisor.value}
                                    onChange={(e) => handleChange(e, index, 'advisor')}
                                    placeholder="advisor"
                                />
                                {index !== 0 && (
                                    <X
                                        size={20}
                                        className='text-primary cursor-pointer absolute top-1/2 right-3 -translate-y-1/2'
                                        onClick={() => handleRemove('advisor', index)}
                                    />
                                )}
                            </div>
                        ))
                    }
                    <button type="button" onClick={() => handleAdd('advisor')} className="h-[50px] text-white pl-2 bg-blue text-base col-span-3 rounded-lg col-start-2 flex items-center justify-center gap-3"><CirclePlus size={20} />ADD advisor</button>

                    <label>File</label>
                    <input
                        onChange={handleFileChange}
                        type="file"
                        className='h-[50px] pl-2 border-[#c5c5c5] text-base'
                    />

                </div >
                <div className='flex items-center justify-center gap-10 h-auto py-6 shadow-md'>
                    <button
                        className='border w-[300px] h-[50px] rounded-[10px] border-primary text-primary'
                        onClick={closePopup}
                    >Cancel
                    </button>
                    <button className='border w-[300px] h-[50px] rounded-[10px] bg-blue text-[#fff]'>Submit</button>
                </div>
            </form >
        </div >
    )
}