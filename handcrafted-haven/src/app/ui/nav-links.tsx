"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { name: "HomePage", href: "/" },
  { name: "Seller Profiles", href: "/profiles" },
  { name: "Product Listings", href: "/list" },
  { name: "Reviews & Ratings", href: "/review" },
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
              "text-sm md:text-base md:p-1 hover:bg-black hover:text-white rounded-sm font-bold",
              {
                "bg-black text-white hover:bg-gray-600": pathname === link.href,
              }
            )}
          >
            <p className="px-2">{link.name}</p>
          </Link>
        );
      })}
    </>
  );
}
