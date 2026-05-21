import Link from "next/link"
import { MENU } from "./constants/menu"

export default function Home() {
  return (
    <div className="w-full h-screen grid grid-cols-1 lg:grid-cols-2 padding-body gap-[20px] overflow-hidden">
      <div className="hidden lg:block w-full h-full">
        <img src='/home/home-thumbnail.jpg' alt="home thumbnail" className="w-full h-full" />
      </div>
      <div className="w-full h-full grid grid-rows-2">
        <div className="flex flex-col items-start justify-between">
          <Link href={'/'}>
            <img src='/common/logo.svg' alt="logo" className="w-[30px] h-[30px] lg:w-[40px] lg:h-[40px]" />
          </Link>
          <div className="hidden w-full lg:flex flex-row justify-between">
            {MENU.map((item, index) => (
              <ul key={index}>
                <Link href={item.link} className="text-primary hover:font-[600] transition-all duration-300">{item.tab}</Link>
              </ul>
            ))}
          </div>
        </div>
        <div className="lg:hidden w-full flex flex-row justify-between items-end">
          {MENU.map((item, index) => (
            <ul key={index}>
              <Link href={item.link} className="text-primary hover:font-[600] transition-all duration-300">{item.tab}</Link>
            </ul>
          ))}
        </div>
      </div>
      <div className="block lg:hidden w-full h-full">
        <img src='/home/home-thumbnail.jpg' alt="home thumbnail" className="w-full h-full" />
      </div>
    </div>
  )
}