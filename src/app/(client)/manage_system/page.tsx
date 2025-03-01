"use client";
import axios from "axios";
import { Trash2 } from "lucide-react";
import React, { useEffect, useState } from "react";

interface userType {
  user_id: number;
  role_name: number;
  email: string;
  first_name: string;
  last_name: string;
}

const Page = () => {
  const [users, setUsers] = useState<userType[]>([]);
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/getAllUsers`
        );
        const data = response.data.data;
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users:", err);
      }
    };
    fetchUsers();
  }, []);
  return (
    <table className="w-full cursor-default">
      <thead className="bg-blue text-white">
        <tr className="h-16">
          <th>user_id</th>
          <th>role_name</th>
          <th>email</th>
          <th>first_name</th>
          <th>last_name</th>
          <th>manage</th>
        </tr>
      </thead>
      <tbody>
        {users.map((item, index) => (
          <tr
            key={item.user_id}
            className={`h-auto ${index % 2 === 0 ? "" : "bg-[#D6E0F5]"}`}
          >
            <td className="px-4">{item.user_id}</td>
            <td className="px-4">{item.role_name}</td>
            <td className="px-4">{item.first_name}</td>
            <td className="px-4">{item.last_name}</td>
            <td className="px-4">{item.email}</td>
            <td className="px-4 flex items-center p-4">
              <button className="w-full h-full flex items-center justify-center gap-2 p-2 rounded-md bg-primary text-white hover:bg-[#E04B4B]">
                <Trash2 size={18} />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Page;
