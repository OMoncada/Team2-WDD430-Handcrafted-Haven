"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { name: "HomePage", href: "/" },
  { name: "Seller Profiles", href: "/profiles" },
  { name: "Product Listings", href: "/list" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <>
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
  "block text-sm md:text-base md:p-1 hover:bg-black hover:text-white rounded-sm font-bold transition",
  { "bg-black text-white": pathname === link.href }
)}

          >
            <p className="px-2">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
