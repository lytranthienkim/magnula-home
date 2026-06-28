import { AboutHero } from "./AboutHero"
import { HomeContent01 } from "./HomeContent01"
import { HomeContent02 } from "./HomeContent02"
import { HomeContent03 } from "./HomeContent03"

export const AboutContainer = () => {
    return (
        <div className="relative w-full h-full flex flex-col justify-between">
            <AboutHero />
            <HomeContent01 />
            <HomeContent02 />
            <HomeContent03 />
            <div className="w-full h-screen bg-background-primary" />
        </div>
    )
}