import { auth } from "../../../auth";
import NavLinks from "./nav-links";
import Image from "next/image";
import Link from "next/link";
import { signOut } from "../../../auth";

export default async function NavBar() {
  const session = await auth();
  const authenticated = !!session;

  return (
    <div className="bg-[#F4EDE4]">
      <div className="flex flex-row justify-between items-center">
        <div>
          <Link href={"/"} className="flex flex-row">
            <Image
              src={"/images/handcrafted-icon.svg"}
              height={80}
              width={80}
              alt="Handcrafted Icon"
              className="ml-4 my-2"
            />
            <Image
              src={"/images/Handcrafted Haven.svg"}
              height={150}
              width={150}
              alt="Handcrafted Logo"
            />
          </Link>
        </div>
        <div className="flex flex-wrap p-4 gap-3 justify-end items-center">
          <NavLinks />
          {!authenticated ? (
            <>
              <Link
                href="/login"
                className="flex items-center gap-5 self-start rounded-lg bg-black px-6 py-3 text-sm font-medium text-white hover:bg-white hover:text-black border-2 border-black hover:shadow-2xl md:text-base transition duration-800"
              >
                <span>Log in</span>
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-5 self-start rounded-lg bg-white px-6 py-3 text-sm font-medium text-black border-black border-2 transition duration-800 hover:bg-black hover:text-white hover:shadow-2xl md:text-base"
              >
                <span>Register</span>
              </Link>
            </>
          ) : (
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button className="rounded-md bg-gray-50 px-6 py-3 text-sm hover:bg-red-100 hover:text-red-600 md:flex-none md:justify-start md:p-2 md:px-3 transition duration-800 border-2 border-black">
                <div>Sign Out</div>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
