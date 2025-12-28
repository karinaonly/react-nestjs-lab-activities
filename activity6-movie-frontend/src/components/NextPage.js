import React from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

function NextPage() {
  return (
    <div className='flex justify-center items-center gap-4 my-5'>
        <button className='w-14 h-14 rounded-full border border-[#D1D9E0] bg-[#FAFBFC] flex justify-center items-center'>1</button>
        <button className='w-14 h-14 rounded-full border border-[#D1D9E0] bg-[#FAFBFC] flex justify-center items-center'>2</button>
        <button className='w-14 h-14 rounded-full border border-[#D1D9E0] bg-[#FAFBFC] flex justify-center items-center'>3</button>
        <button className='w-14 h-14 rounded-full border border-[#D1D9E0] bg-[#FAFBFC] flex justify-center items-center'><IoIosArrowForward /></button>
        <button className='w-14 h-14 rounded-full border border-[#D1D9E0] bg-[#FAFBFC] flex justify-center items-center'><MdKeyboardDoubleArrowRight /></button>
    </div>
  )
}

export default NextPage