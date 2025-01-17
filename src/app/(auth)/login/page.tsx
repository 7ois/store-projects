'use client'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const page = () => {

    const router = useRouter()
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    })
    // const login = useAuthStore((state) => state.login);
    const { login } = useAuthStore()

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((e) => ({
            ...e, [name]: value
        }))
    }

    const loginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            if (!res.ok) {
                throw new Error('Failed to login')
            }
            const data = await res.json()
            login(data.user, data.token);
            // console.log('Backend response:', data);
            alert('Login successful!')
            router.push('/dashboard')
        } catch (error) {
            console.error('Login error:', error)
            alert('Login failed')
            setFormData({ email: "", password: "" })
        }
    }

    useEffect(() => {
        console.log(formData)
    }, [formData])

    return (
        <div className='w-full h-[800px] flex rounded-[10px] overflow-hidden shadow-lg'>
            <div className='relative w-full bg-[#fff] flex flex-col justify-center items-center gap-2 p-20'>
                <h1>LOGO</h1>
                <h1 className='text-5xl my-5'>Log In</h1>
                <form onSubmit={loginSubmit} className='grid gap-5 w-full text-2xl'>
                    <div className='grid gap-2'>
                        <label className='text-xl'>Email</label>
                        <input
                            type="email"
                            name="email"
                            className='bg-[#E0EEFD] h-[50px] rounded-lg pl-2'
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                    <div className='grid gap-2'>
                        <label className='text-xl'>Password</label>
                        <input
                            type="password"
                            name="password"
                            className='bg-[#E0EEFD] h-[50px] rounded-lg pl-2'
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
                <div className='absolute bottom-20 cursor-pointer'>
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