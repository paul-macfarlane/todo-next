// this a client component because this needs "usePathname" hook to get current route.
// there is a workaround where server components can get the url path using middleware that I can also look into and make this a server component
"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

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

  return (
    <nav className="border-r border-primary min-w-24 max-w-[6rem] sm:min-w-80 sm:max-w-xs h-full p-4 sm:p-10 flex flex-col gap-4">
      <h1 className="hidden sm:block">Todo Next</h1>

      <UserButton afterSignOutUrl="/" />

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
