"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ClerkLoaded, ClerkLoading, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import ProfileRounded from "@/app/assets/ProfileRounded.svg";
import useSaveUserTimeZone from "@/app/hooks/useSaveUserTimeZone";

const routes = [
  {
    path: "/",
    href: "/",
    name: "Todos",
  },
  {
    path: "/reports",
    href: "/reports",
    name: "Reports",
  },
];

export default function Navbar() {
  const pathname = usePathname();

  useSaveUserTimeZone();

  return (
    <nav className="border-r border-primary min-w-24 max-w-[6rem] sm:min-w-80 sm:max-w-xs h-full p-4 sm:p-10 flex flex-col gap-4">
      <h1 className="hidden sm:block sticky top-0">Todo Next</h1>

      <div className="sticky top-0 min-h-8">
        <ClerkLoading>
          <Image
            className="w-8 h-8"
            src={ProfileRounded}
            alt={"loading profile"}
          />
        </ClerkLoading>

        <ClerkLoaded>
          <UserButton afterSignOutUrl="/" />
        </ClerkLoaded>
      </div>

      {routes.map(({ path, href, name }) => (
        <Link
          key={name}
          className={`${pathname === path ? "text-primary font-bold underline" : ""} hover:text-primary hover:font-bold focus:text-primary focus:font-bold`}
          href={href}
        >
          {name}
        </Link>
      ))}
    </nav>
  );
}
