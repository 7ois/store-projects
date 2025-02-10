"use client";

// import { useRouter } from 'next/navigation'
import React from 'react'
import { useParams } from "next/navigation";

const Page = () => {
    const params = useParams();
    console.log("Params from useParams():", params);

    return (
        <div>
            <h1>Page ID: {params.projectSlug}</h1>
        </div>
    );
};

export default Page