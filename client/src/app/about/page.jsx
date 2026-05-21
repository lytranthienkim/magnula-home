import { Navbar } from "@/components/common/Navbar";
import { AboutHeader } from "@/components/layout/AboutHeader";

export default function About () {
    return (
        <div className="flex flex-col">
            <Navbar/>
            <AboutHeader/>
        </div>
    )
}