import React from 'react'
import {
    CircularProgress
} from "@mui/material";

const Loading = () => {
    return (
        <div className="flex justify-center flex-col items-center py-4 text-[15px]" >
            <CircularProgress />
            <span className="mt-3" > กำลังโหลดข้อมูล...</span>
        </div>
    )
}

export default Loading