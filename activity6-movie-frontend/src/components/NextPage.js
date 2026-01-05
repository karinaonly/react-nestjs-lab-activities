import React from 'react'
import { IoIosArrowForward } from "react-icons/io";
import { MdKeyboardDoubleArrowRight } from "react-icons/md";

function NextPage() {
  return (
    <div className='flex justify-center items-center gap-4 my-5'>
        <button className='w-14 h-14 rounded-full border flex justify-center items-center' style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>1</button>
        <button className='w-14 h-14 rounded-full border flex justify-center items-center' style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>2</button>
        <button className='w-14 h-14 rounded-full border flex justify-center items-center' style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}>3</button>
        <button className='w-14 h-14 rounded-full border flex justify-center items-center' style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}><IoIosArrowForward /></button>
        <button className='w-14 h-14 rounded-full border flex justify-center items-center' style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)' }}><MdKeyboardDoubleArrowRight /></button>
    </div>
  )
}

export default NextPage