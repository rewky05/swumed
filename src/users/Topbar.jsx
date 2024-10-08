import { useUserContext } from "../users/context/UserContext";
import Logo from "../assets/swumed-logo.png";
import { IoSettingsOutline, IoPersonOutline } from "react-icons/io5";
import { FaCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const Topbar = () => {
  const { user } = useUserContext()

  const userName = user ? user.name : "N/A";

  return (
    <div className="bg-white shadow-sm z-40 py-[40px] px-4 fixed top-0 w-full h-[80px] flex justify-between items-center text-white font-medium select-none">
      <img src={Logo} className="h-[68px]" />

      <div className="flex items-center">
        <div className="bg-primary_maroon rounded-[50%] p-2 m-4">
          <IoPersonOutline className="text-3xl text-white p-1" />
          <div className="text-[#1DD75B] text-xs fixed pl-6 mt-[-4px]">
            <FaCircle />
          </div>
        </div>
        <h2 className="text-black">{userName}</h2>
        <Link to="/settings">
          <button className="text-gray-500 text-2xl flex items-center font-medium rounded-[8px] py-2 px-4 cursor-pointer">
            <IoSettingsOutline className="hover:rotate-90 duration-300" />
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Topbar;
