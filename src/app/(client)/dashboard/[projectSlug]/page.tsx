"use client";

// import { useRouter } from 'next/navigation'
import React from "react";
import { useParams } from "next/navigation";

const Page = () => {
  const params = useParams();
  console.log("Params from useParams():", params);

  return (
    <div>
      <h1>Title: {params.projectSlug}</h1>
      <h1>Description: </h1>
      <h1>Owner: </h1>
      <h1>Advisor: </h1>
      <h1>Issue Date: </h1>
      <h1>Keywords: </h1>
      <h1>Type: </h1>
      <h1>File: </h1>
    </div>
  );
};

export default Page;
