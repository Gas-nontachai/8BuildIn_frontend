"use client"
import { useState } from "react";

const Page = () => {
  const [data, setData] = useState([
    { id: 1, name: "John Doe", role: "Admin" },
    { id: 2, name: "Jane Smith", role: "User" },
  ]);

  const handleDelete = (id: number) => {
    setData(data.filter((item) => item.id !== id));
  };

  return (
    <>
      <h1 className="text-xl font-bold mb-4">จัดการข้อมูล</h1>
      <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded">+ เพิ่มข้อมูล</button>
      <table className="w-full border-collapse bg-white shadow-md">
        <thead>
          <tr className="bg-gray-200">
            <th className="border p-2">#</th>
            <th className="border p-2">ชื่อ</th>
            <th className="border p-2">ตำแหน่ง</th>
            <th className="border p-2">จัดการ</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id} className="text-center">
              <td className="border p-2">{item.id}</td>
              <td className="border p-2">{item.name}</td>
              <td className="border p-2">{item.role}</td>
              <td className="border p-2">
                <button className="px-3 py-1 bg-yellow-500 text-white rounded mr-2">แก้ไข</button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="px-3 py-1 bg-red-500 text-white rounded"
                >
                  ลบ
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Page;
