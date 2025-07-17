"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

const links = [
  { name: "HomePage", href: "/" },
  { name: "Seller Profiles", href: "/" },
  { name: "Product Listings", href: "/" },
  { name: "Reviews & Ratings", href: "/" },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <div className="flex-col">
      {links.map((link) => {
        return (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              "text-sm hover:bg-black hover:text-white rounded-3xl font-bold",
              { "bg-black": pathname === link.href }
            )}
          >
            <p>{link.name}</p>
          </Link>
        );
      })}
    </div>
  );
}
