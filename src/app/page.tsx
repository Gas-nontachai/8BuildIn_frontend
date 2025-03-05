"use client";
import { useState, useEffect } from "react";
import { ModeEdit, Delete } from "@mui/icons-material";

const Page = () => {
  const [data, setData] = useState([
    { id: 1, name: "John Doe", role: "Admin" },
    { id: 2, name: "Jane Smith", role: "User" },
  ]);

  return (
    <>
      <div className="flex justify-between">
        <h1 className="text-xl font-bold mb-4">Hello World !!</h1> 
      </div>
    </>
  );
};

export default Page;
