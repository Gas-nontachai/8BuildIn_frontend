"use client"
import { useState } from "react";
import { ModeEdit, Delete } from "@mui/icons-material";

const Page = () => {
  const [data, setData] = useState([
    { id: 1, name: "John Doe", role: "Admin" },
    { id: 2, name: "Jane Smith", role: "User" },
  ]);

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl font-bold mb-4">Example Pattern</h1>
        <button className="mb-4 px-4 py-2 bg-green-600 hover:bg-green-500 text-white rounded">เพิ่มข้อมูล</button>
      </div>
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
              <td className="border p-2  flex justify-center gap-2">
                <button
                  className="inline-flex items-center gap-2 
                             px-3 py-1 
                             bg-blue-600 text-white 
                             rounded-md 
                             hover:bg-blue-700 
                             focus:outline-none focus:ring-2 focus:ring-blue-300 
                             transition-colors shadow-sm"
                >
                  <ModeEdit className="w-5 h-5" />
                  <span>แก้ไข</span>
                </button>

                {/* ปุ่มลบ */}
                <button
                  className="inline-flex items-center gap-2 
                             px-3 py-1 
                             bg-red-600 text-white 
                             rounded-md 
                             hover:bg-red-700 
                             focus:outline-none focus:ring-2 focus:ring-red-300 
                             transition-colors shadow-sm"
                >
                  <Delete className="w-5 h-5" />
                  <span>ลบ</span>
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
