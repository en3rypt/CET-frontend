import NavbarSimple from "@/components/navbar";
import { Outlet } from "react-router-dom";
export default function Root() {
  return (
    <div className="font-kanit text-base">
      <NavbarSimple />
      <div className="px-2 md:px-5 xl:px-8 max-w-[1240px] mt-3 mx-auto">
        <Outlet />
      </div>
    </div>
  );
}
