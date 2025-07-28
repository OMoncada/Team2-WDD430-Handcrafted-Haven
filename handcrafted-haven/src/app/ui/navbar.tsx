import NavLinks from "./nav-links";
import Image from "next/image";
import Link from "next/link";

export default function NavBar() {
  return (
    <div className="bg-[#F4EDE4]">
      <div className="flex flex-row justify-between items-center">
        <div>
          <Link href={"/"} className="flex flex-row">
            <Image
              src={"/images/handcrafted-icon.svg"}
              height={80}
              width={80}
              alt="Handcradted Icon"
              className="ml-4 my-2"
            />
            <Image
              src={"/images/Handcrafted Haven.svg"}
              height={150}
              width={150}
              alt="Handcradted Icon"
            />
          </Link>
        </div>
        <div className="flex flex-wrap p-4 gap-3 justify-end">
          <NavLinks />
        </div>
      </div>
    </div>
  );
}
