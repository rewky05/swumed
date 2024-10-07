import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import { FaUserMd, FaUsers, FaCogs, FaThLarge } from "react-icons/fa"; 
import { BiLogOut } from "react-icons/bi";
import { useUserContext } from "./context/UserContext"; 
// import { ProviderContext } from "./users/context/ProviderContext"; 

const Sidebar = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const location = useLocation(); 
  const [activeItem, setActiveItem] = useState(location.pathname);

  const { user } = useUserContext()
  // const { branch_id, providerType } = useContext(ProviderContext);

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };

  return (
    <div className="w-64 h-screen pt-20 fixed bg-white shadow-lg flex flex-col">
      <nav className="flex-grow">
        <ul className="space-y-2 p-4">
          {/* Superadmin Links */}
          {user?.role === "superadmin" && (
            <>
              <Link to="/superadmin-dashboard">
                <li
                  className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                    activeItem === "/superadmin-dashboard"
                      ? "bg-red-100 text-primary_maroon"
                      : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105"
                  }`}
                >
                  <FaThLarge className="mr-3" />
                  Dashboard
                </li>
              </Link>
              <Link to="/accounts">
                <li
                  className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                    activeItem === "/accounts"
                      ? "bg-red-100 text-primary_maroon"
                      : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105"
                  }`}
                >
                  <FaUsers className="mr-3" />
                  Accounts
                </li>
              </Link>
              <Link to="/healthcare-provider">
                <li
                  className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                    activeItem === "/healthcare-provider"
                      ? "bg-red-100 text-primary_maroon"
                      : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105"
                  }`}
                >
                  <FaUsers className="mr-3" />
                  Healthcare Providers
                </li>
              </Link>
            </>
          )}

          {/* Information Desk Staff Links */}
          {user?.role === "Information Desk Staff" && (
            <>
              <Link to="/infodesk-dashboard">
                <li
                  className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                    activeItem === "/infodesk-dashboard"
                      ? "bg-red-100 text-primary_maroon"
                      : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105"
                  }`}
                >
                  <FaThLarge className="mr-3" />
                  Dashboard
                </li>
              </Link>

              <Link to="/patients">
                <li
                  className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                    activeItem === "/patients"
                      ? "bg-red-100 text-primary_maroon"
                      : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105"
                  }`}
                >
                  <FaUsers className="mr-3" />
                  Patients
                </li>
              </Link>

              <Link to="/doctors">
                <li
                  className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                    activeItem === "/doctors"
                      ? "bg-red-100 text-primary_maroon"
                      : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105"
                  }`}
                >
                  <FaUserMd className="mr-3" />
                  Doctors
                </li>
              </Link>
            </>
          )}

          {/* Philhealth Staff Links */}
          {user?.role === "Philhealth Staff" && (
            <Link to="/philhealth-dashboard">
              <li
                className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                  activeItem === "/philhealth-dashboard"
                    ? "bg-red-100 text-primary_maroon"
                    : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105"
                }`}
              >
                <FaThLarge className="mr-3" />
                Dashboard
              </li>
            </Link>
          )}

          <Link to="/settings">
            <li
              className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                activeItem === "/settings"
                  ? "bg-red-100 text-primary_maroon"
                  : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105"
              }`}
            >
              <FaCogs className="mr-3" />
              Settings
            </li>
          </Link>
        </ul>
      </nav>

      <div className="flex justify-center p-8">
        <button
          onClick={handleLogout}
          className="rounded-md text-white py-[7px] px-8 flex items-center bg-primary_maroon hover:shadow-lg hover:scale-105"
        >
          <BiLogOut className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
