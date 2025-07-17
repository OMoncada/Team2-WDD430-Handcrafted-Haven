import NavLinks from "./nav-links";

export default function NavBar() {
  return (
    <div className="bg-[#F4EDE4]">
      <div className="flex flex-wrap p-4 gap-3 justify-end">
        <NavLinks />
      </div>
    </div>
  );
}
