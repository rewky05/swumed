import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Sidebar from "./Sidebar";
import { useUserContext } from "./context/UserContext";
import Loading from "./Loading";

const Layout = () => {
  const { user } = useUserContext();
  console.log({ user });

  if (!user) {
    return (
      <Loading />
    );
  }

  return (
    <div className="flex w-[100%]">
      <Topbar />
      <div className="flex w-[18%]">
        <Sidebar user={user} />
      </div>
      <div className="flex flex-col w-[82%] pt-20">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
