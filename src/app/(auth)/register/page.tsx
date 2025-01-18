'use client'
import Dropdown from '@/components/Dropdown';
import { ArrowLeft } from 'lucide-react';
import Image from 'next/image';
// import axios from 'axios';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {

    const router = useRouter();
    const [showNameInputs, setShowNameInputs] = useState(false);
    const [formData, setFormData] = useState({
        role_id: 4,
        first_name: '',
        last_name: '',
        email: '',
        password: ''
    });
    const [roles, setRoles] = useState<{ role_id: number, role_name: string }[]>([])
    // const [responseMessage, setResponseMessage] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        if (name == "email") {
            if (value.endsWith('@rmuti.ac.th')) {
                setShowNameInputs(true);
            } else {
                setShowNameInputs(false)
            }
        }
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            })
            if (!response.ok) {
                throw new Error('Failed to register user')
            }
            const data = await response.json()
            alert(`User registered successfully.`)
            console.log(data)
            router.push('/login')
            // setResponseMessage(`Success: ${response.data.message}`);
        } catch (error) {
            // setResponseMessage(`Error: ${error.response?.data?.error || error.message}`)
            console.error('Error:', error)
            alert('Error registering user')
        }
    }

    useEffect(() => {
        const fetcRoles = async () => {
            const res = await fetch('http://localhost:3001/users_role')
            const json = await res.json()

            const filteredRoles = json.data.filter((role: { role_id: number }) => role.role_id == 2 || role.role_id == 3)
            setRoles(filteredRoles)
        }
        fetcRoles()
    }, [])

    const handleRoleSelect = (id: number) => {
        setFormData({ ...formData, role_id: id });
    };

    useEffect(() => {
        console.log(formData)
    }, [formData])

    return (
        <div className='w-full h-[800px] flex rounded-[10px] overflow-hidden shadow-lg'>
            <div className='relative w-full bg-[#fff] flex flex-col justify-center items-center gap-2 p-20'>
                <div
                    className='absolute top-5 left-5 cursor-pointer'
                    onClick={() => router.back()}
                >
                    <ArrowLeft size={25} color='#1C3B6C' />
                </div>
                <Image src="/images/logo_main.jpg"
                    alt="Logo"
                    width={150}
                    height={150}
                />
                <h1 className='text-5xl my-5'>Register</h1>
                <form onSubmit={handleSubmit} className='grid gap-5 w-full text-2xl'>
                    <div className='grid gap-1'>
                        <label className='text-xl'>Email</label>
                        <input type="email"
                            name='email'
                            value={formData.email}
                            onChange={handleChange}
                            placeholder='Enter your email'
                            className='h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base'
                        />
                    </div>
                    <div className='grid gap-1'>
                        <label className='text-xl'>Password</label>
                        <input type="password"
                            name='password'
                            value={formData.password}
                            onChange={handleChange}
                            className='h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base'
                            placeholder='Enter your password' />
                    </div>

                    <div className={`${showNameInputs ? "" : "hidden"} grid grid-cols-2 gap-5 w-full`}>
                        <div className='grid gap-1 w-full'>
                            <label className='text-xl'>Firstname</label>
                            <input type="text"
                                name='first_name'
                                value={formData.first_name}
                                onChange={handleChange}
                                className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
                                placeholder='Enter your Fistname' />
                        </div>
                        <div className='grid gap-1 w-full'>
                            <label className='text-xl'>Lastname</label>
                            <input type="text"
                                name='last_name'
                                value={formData.last_name}
                                onChange={handleChange}
                                className="h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base"
                                placeholder='Enter your Lastname' />
                        </div>

                        <Dropdown items={roles} onSelect={handleRoleSelect} />
                    </div>

                    <div className='w-full flex items-center justify-center my-5'>
                        <button type='submit'
                            className='bg-blue text-[#fff] w-[200px] h-[60px] border border-[#c5c5c5] rounded-[10px]'
                        >Register</button>
                    </div>
                </form>
            </div>

            <div className='w-full bg-blue text-[#fff]'>
                <h1>Image</h1>
            </div>
        </div>
    )
}

export default page