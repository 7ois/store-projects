'use client'
import axios from 'axios'
// import { useAuthStore } from '@/stores/authStore'
import { ArrowLeft } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {

    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((e) => ({
            ...e, [name]: value
        }))
    }

    const handleLogin = async (e: any) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3001/api/login', { email: formData.email, password: formData.password });
            console.log(JSON.stringify(response.data.user))
            localStorage.setItem('token', response.data.token);
            router.push('/dashboard');
        } catch (error) {
            alert('Login failed');
        }
    };

    return (
        <div className='w-full h-[800px] flex rounded-[10px] overflow-hidden shadow-lg'>
            <div className='relative w-full bg-[#fff] flex flex-col justify-center items-center gap-2 p-20'>
                <div
                    className='absolute top-5 left-5 cursor-pointer'
                    onClick={() => router.push('/dashboard')}
                >
                    <ArrowLeft size={25} color='#1C3B6C' />
                </div>
                <Image src="/images/logo_main.jpg"
                    alt="Logo"
                    width={150}
                    height={150}
                />
                <h1 className='text-5xl my-5'>Log In</h1>
                <form onSubmit={handleLogin} className='grid gap-5 w-full text-2xl'>
                    <div className='grid gap-2'>
                        <label className='text-xl'>Email</label>
                        <input
                            type="email"
                            name="email"
                            className='h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base'
                            placeholder='Enter email.'
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='grid gap-2'>
                        <label className='text-xl'>Password</label>
                        <input
                            type="password"
                            name="password"
                            className='h-[50px] pl-2 border border-[#c5c5c5] rounded-lg text-base'
                            placeholder='Enter password.'
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='text-base cursor-pointer'>
                        <p>For get Password ?</p>
                    </div>
                    <div className='w-full flex items-center justify-center my-5'>
                        <button type='submit'
                            className='bg-blue text-[#fff] w-[200px] h-[60px] border rounded-[10px] '
                        >Log In</button>
                    </div>
                </form>
                <div className='cursor-pointer' onClick={() => router.push('/register')}>
                    <p>You are not a member yet?</p>
                </div>
            </div>

            <div className='w-full bg-blue text-[#fff]'>
                <h1>Image</h1>
            </div>
        </div>
    )
}

export default page