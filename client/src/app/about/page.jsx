import { Footer } from "@/components/common/navigation/Footer";
import { AboutContainer } from "@/components/layout/about/AboutContainer";

export default function About() {
    return (
        <div className="relative w-full min-h-screen flex flex-col justify-between">
            <main>
                <AboutContainer/>
            </main>
            <Footer />
        </div>
    )
}