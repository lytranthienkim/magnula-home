'use client'

import { CiFacebook } from "react-icons/ci";
import { CiInstagram } from "react-icons/ci";

export const Footer = () => {
    return (
        <div className="w-full flex flex-col mt-[48px] border-t-[1px] border-[#DEDEDE]">
            <div className="flex flex-col lg:flex-row justify-between gap-[16px] padding-wide my-2">
                <div className="flex flex-col justify-between gap-[16px]">
                    <img src='/common/logo-footer.svg' alt="logo footer" className="w-[100px] lg:w-[150px] lg:h-[25px]"/>
                    <p className="font-[700] body-01">Reach out for a personalized quote.</p>
                </div>
                <div className="flex flex-col items-start lg:items-end justify-between gap-[4px]">
                    <p className="body-03 font-[500]">+91 9431990482</p>
                    <p className="body-03 font-[500]">magnulahome@gmail.com</p>
                    <p className="body-03 font-[500]">Indore, Madhya Pradesh, 453111</p>
                    <div className="flex flex-row gap-[16px]">
                        <CiFacebook size={20}/>
                        <CiInstagram size={20}/>
                    </div>
                </div>
            </div>
            <hr className="border-t-[1px] border-[#DEDEDE]"></hr>
            <p className="body-04 text-center py-2 text-secondary">Magnula Home. All rights reserved 2025.</p>
        </div>
    )
}