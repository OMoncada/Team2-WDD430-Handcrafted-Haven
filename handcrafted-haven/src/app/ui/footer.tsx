import NavLinks from "./nav-links";

export default function Footer() {
  return (
    <div className="mt-10 py-10 bg-[#F4EDE4]">
      <p className="text-center text-2xl my-2">Footer</p>
      <div className="flex flex-row justify-center gap-5">
        <NavLinks />
      </div>
    </div>
  );
}
