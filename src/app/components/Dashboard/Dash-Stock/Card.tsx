import React from 'react'
import { Inventory2, MoveToInbox, LocalShipping, Store, TrendingUp } from "@mui/icons-material";

const CardStock = () => {
    return (
        <div className="grid md:grid-cols-4 mb-10 gap-10 sm:grid-cols-2">
            <div className="w-4/4 h-auto bg-white rounded-xl shadow-md px-12 py-5">
                <div className="flex flex-col">
                    <span className="text-[20px] font-[500]">ทำรายการ</span>
                    <div className="flex justify-between">
                        <span className="text-[30px] font-[500]">0</span>
                        <div className="bg-blue-200 w-16 h-16 rounded-2xl flex justify-center items-center">
                            <Inventory2 fontSize="large" className="text-blue-500" />
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="bg-emerald-300 w-8 h-8 rounded-full flex justify-center items-center  mr-2">
                            <TrendingUp fontSize="small" className="text-white" />
                        </div>
                        <span className="font-[400] mt-1">ครั้ง</span>
                    </div>
                </div>
            </div>

            <div className="w-4/4 h-auto bg-white rounded-xl shadow-md px-12 py-5">
                <div className="flex flex-col">
                    <span className="text-[20px] font-[500]">จำนวนที่รับเข้า</span>
                    <div className="flex justify-between">
                        <span className="text-[30px] font-[500]">0</span>
                        <div className="bg-emerald-200 w-16 h-16 rounded-2xl flex justify-center items-center">
                            <MoveToInbox fontSize="large" className="text-emerald-500" />
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="bg-emerald-300 w-8 h-8 rounded-full flex justify-center items-center  mr-2">
                            <TrendingUp fontSize="small" className="text-white" />
                        </div>
                        <span className="font-[400] mt-1">Inbound</span>
                    </div>
                </div>
            </div>

            <div className="w-4/4 h-auto bg-white rounded-xl shadow-md px-12 py-5">
                <div className="flex flex-col">
                    <span className="text-[20px] font-[500]">จำนวนที่เบิกออก</span>
                    <div className="flex justify-between">
                        <span className="text-[30px] font-[500]">0</span>
                        <div className="bg-red-200 w-16 h-16 rounded-2xl flex justify-center items-center">
                            <LocalShipping fontSize="large" className="text-red-500" />
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="bg-red-300 w-8 h-8 rounded-full flex justify-center items-center  mr-2">
                            <TrendingUp fontSize="small" className="text-white" />
                        </div>
                        <span className="font-[400] mt-1">Outbound</span>
                    </div>
                </div>
            </div>

            <div className="w-4/4 h-auto bg-white rounded-xl shadow-md px-12 py-5">
                <div className="flex flex-col">
                    <span className="text-[20px] font-[500]">คงเหลือในคลัง</span>
                    <div className="flex justify-between">
                        <span className="text-[30px] font-[500]">0</span>
                        <div className="bg-orange-200 w-16 h-16 rounded-2xl flex justify-center items-center">
                            <Store fontSize="large" className="text-orange-500" />
                        </div>
                    </div>
                    <div className="flex justify-start">
                        <div className="bg-emerald-300 w-8 h-8 rounded-full flex justify-center items-center  mr-2">
                            <TrendingUp fontSize="small" className="text-white" />
                        </div>
                        <span className="font-[400] mt-1">Pending</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CardStock