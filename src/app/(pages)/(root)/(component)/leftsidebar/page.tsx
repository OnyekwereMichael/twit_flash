'use client'
import Link from 'next/link'
import Logout  from '../../../../../../public/assets/logout.svg'
import Profile from '../../../../../../public/assets/profilepic.svg'
import { sidebarLinks } from '@/app/constants'
import { usePathname } from 'next/navigation'
import Image from 'next/image'
import { GetAuthUser, useLogout } from '@/app/lib/query'
import cloudinaryLoader from '../../../../lib/cloudinary'

const LeftSideBar = () => {
  const pathname = usePathname()
  const { mutate: logout, isPending } = useLogout()
  const {data:authUser} = GetAuthUser()
  console.log(authUser);

  

  return (
    <div>
      <nav className="leftsidebar">
        <div className="flex flex-col gap-10">
          <Link href="/" className="flex gap-3 items-center">
            <div>
              <h1 className="font-Bakbak text-transparent text-[33px] font-semibold max-sm:text-[30px]">
                <span className="bg-gradient-to-r from-[#8A2BE2] via-[#6A0DAD] to-[#4B0082] bg-clip-text">TWIT-</span>
                <span className="text-white/80">FLASH ✨</span>
              </h1>
            </div>
          </Link>
          <Link href={`/profile/${authUser?.username}`} className=" flex  items-center gap-3">
            <Image loader={cloudinaryLoader} src={authUser?.profileImg || Profile} alt="Profile_pic" className="w-14 h-14 rounded-full" width={14} height={14}/>
            <div className="flex flex-col">
              <p className="body-bold">{authUser?.fullname}</p>
              <p className="text-light-3 text-[16px] leading-[140%] font-semibold">@{authUser?.username}</p>
            </div>
          </Link>

          <ul className="flex flex-col gap-4">
            {sidebarLinks.map((link) => {
               const dynamicRoute = link.label === "Profile" && typeof link.route === 'function' ? link.route(authUser?.username) : link.route;
               const isActive = pathname === dynamicRoute;
              return (
                <li className={`leftsidebar-link group px-1 ${isActive && 'bg-purple-500 px-2'}`} key={link.label}>
                <Link href={typeof dynamicRoute === 'string' ? dynamicRoute : '#'} className="flex gap-4 items-center py-4">
                  <Image
                    src={link.imgURL}
                    alt=""
                    className={`group-hover:filter group-hover:invert group-hover:brightness-0 group-hover:contrast-200 ${isActive ? 'filter invert brightness-0 contrast-200' : ''} w-6 h-6`}
                    width={24}
                    height={24}
                  />
                  <p className="font-medium text-[18px] font-Asul">{link.label}</p>
                </Link>
              </li>
              
              )
            })}
          </ul>
        </div>

        {/* Logout button */}
        <button className="shad-button_ghost text-center " onClick={() => logout()}>
          <Image src={Logout} alt="" />
          <p className="sm:medium lg:base:medium font-medium text-[18px]  font-Asul">
            {isPending ? 'Logging out...' : 'Logout'}
          </p>
        </button>
      </nav>
    </div>
  )
}

export default LeftSideBar
