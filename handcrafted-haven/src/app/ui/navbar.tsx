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
        <div className="flex flex-wrap p-4 gap-3 justify-end items-center">
          <NavLinks />
          <div>
            <Link
              href="/login"
              className="flex items-center gap-5 self-start rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-white hover:text-black border-2 border-black hover:shadow-2xl md:text-base transition duration-1000"
            >
              <span>Log in</span>
            </Link>
          </div>
          <div>
            <Link
              href="/register"
              className="flex items-center gap-5 self-start rounded-lg bg-white px-6 py-3 text-sm font-medium text-black border-black border-2 transition duration-1000 hover:bg-black hover:text-white hover:shadow-2xl md:text-base"
            >
              <span>Register</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
