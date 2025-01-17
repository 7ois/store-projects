'use client'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect } from 'react'


const page = () => {
  const router = useRouter()
  const pathname = usePathname()
  useEffect(() => {
    if (pathname === '/') {
      router.push('/dashboard')
    }
  }, [router])

  return (
    <div className='text-base'>Loading...</div>
  )
}

export default page