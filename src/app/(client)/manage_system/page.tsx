"use client";
import axios from "axios";
import React, { useEffect, useState } from "react";

interface userType {
  user_id: number;
  role_id: number;
  email: string;
  first_name: string;
  last_name: string;
}

const page = () => {
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
        console.error("Error fetching project:", err);
      }
    };
    fetchUsers();
  }, []);
  return (
    <table className="w-full">
      <thead>
        <tr>
          <th>user_id</th>
          <th>role_id</th>
          <th>email</th>
          <th>first_name</th>
          <th>last_name</th>
        </tr>
      </thead>
      <tbody>
        {users.map((item) => (
          <tr key={item.user_id}>
            <td>{item.user_id}</td>
            <td>{item.role_id}</td>
            <td>{item.first_name}</td>
            <td>{item.last_name}</td>
            <td>{item.email}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default page;
