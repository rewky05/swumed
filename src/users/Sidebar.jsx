import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { getAuth, signOut } from "firebase/auth";
import {
  FaUserMd,
  FaUsers,
  FaCogs,
  FaThLarge,
  FaChevronDown,
  FaChevronRight,
  FaHospital
} from "react-icons/fa";
import { BiLogOut } from "react-icons/bi";
import { useUserContext } from "./context/UserContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const auth = getAuth();
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(location.pathname);
  const [isAccountsOpen, setIsAccountsOpen] = useState(false);
  const [isProvidersOpen, setIsProvidersOpen] = useState(false);

  const { user } = useUserContext();

  useEffect(() => {
    setActiveItem(location.pathname);
  }, [location]);

  const toggleAccountsSection = () => {
    setIsAccountsOpen(!isAccountsOpen);
  };

  const toggleProvidersSection = () => {
    setIsProvidersOpen(!isProvidersOpen);
  };

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
    <div className={`${user.role === "superadmin" ? 'w-[18rem]' : 'w-64'} h-screen pt-20 fixed bg-white border-r border-r-lightgray border-opacity-10 flex flex-col`}>
      <nav className="flex-grow">
        <ul className="space-y-2 p-4">
          {/* Superadmin */}
          {user?.role === "superadmin" && (
            <>
              <Link to="/superadmin-dashboard">
                <li
                  className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                    activeItem === "/superadmin-dashboard"
                      ? "bg-red-100 text-primary_maroon font-semibold"
                      : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
                  }`}
                >
                  <FaThLarge className="mr-3" />
                  Dashboard
                </li>
              </Link>

              {/* Accounts */}
              <div>
                <button
                  onClick={toggleAccountsSection}
                  className={`flex items-center w-full text-left py-2 px-4 rounded-lg cursor-pointer ${
                    isAccountsOpen
                      ? "bg-red-100 text-primary_maroon font-semibold"
                      : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
                  }`}
                >
                  <FaUsers className="mr-3" />
                  Accounts
                  {isAccountsOpen ? (
                    <FaChevronDown className="ml-auto" />
                  ) : (
                    <FaChevronRight className="ml-auto" />
                  )}
                </button>

                {isAccountsOpen && (
                  <div className="ml-6 mt-2 space-y-2">
                    <Link to="/accounts">
                      <li
                        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                          activeItem === "/accounts"
                            ? "bg-red-100 text-primary_maroon font-semibold"
                            : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
                        }`}
                      >
                        Create Account
                      </li>
                    </Link>

                    <Link to="/doctors-superadmin">
                      <li
                        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                          activeItem === "/doctors-superadmin"
                            ? "bg-red-100 text-primary_maroon font-semibold"
                            : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
                        }`}
                      >
                        Doctors
                      </li>
                    </Link>

                    <Link to="/patients-superadmin">
                      <li
                        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                          activeItem === "/patients-superadmin"
                            ? "bg-red-100 text-primary_maroon font-semibold"
                            : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
                        }`}
                      >
                        Patients
                      </li>
                    </Link>

                    <Link to="/infodesk-superadmin">
                      <li
                        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                          activeItem === "/infodesk-superadmin"
                            ? "bg-red-100 text-primary_maroon font-semibold"
                            : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
                        }`}
                      >
                        Information Desk Staff
                      </li>
                    </Link>

                    <Link to="/philhealth-superadmin">
                      <li
                        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                          activeItem === "/philhealth-superadmin"
                            ? "bg-red-100 text-primary_maroon font-semibold"
                            : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
                        }`}
                      >
                        Philhealth Staff
                      </li>
                    </Link>
                  </div>
                )}
              </div>

              {/* Healthcare Providers */}
              <div>
                <button
                  onClick={toggleProvidersSection}
                  className={`flex items-center w-full text-left py-2 px-4 rounded-lg cursor-pointer ${
                    isProvidersOpen
                      ? "bg-red-100 text-primary_maroon font-semibold"
                      : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
                  }`}
                >
                  <FaHospital className="mr-3" />
                  Healthcare Providers
                  {isProvidersOpen ? (
                    <FaChevronDown className="ml-auto" />
                  ) : (
                    <FaChevronRight className="ml-auto" />
                  )}
                </button>

                {isProvidersOpen && (
                  <div className="ml-6 mt-2 space-y-2">
                    <Link to="/healthcare-provider">
                      <li
                        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                          activeItem === "/healthcare-provider"
                            ? "bg-red-100 text-primary_maroon font-semibold"
                            : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
                        }`}
                      >
                        Add Providers
                      </li>
                    </Link>

                    <Link to="/hospitals-superadmin">
                      <li
                        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                          activeItem === "/hospitals-superadmin"
                            ? "bg-red-100 text-primary_maroon font-semibold"
                            : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
                        }`}
                      >
                        Hospitals
                      </li>
                    </Link>

                    <Link to="/clinics-superadmin">
                      <li
                        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                          activeItem === "/clinics-superadmin"
                            ? "bg-red-100 text-primary_maroon font-semibold"
                            : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
                        }`}
                      >
                        Clinics
                      </li>
                    </Link>

                  </div>
                )}
              </div>
            </>
          )}

          {/* Information Desk Staff */}
          {user?.role === "Information Desk Staff" && (
            <>
              <Link to="/infodesk-dashboard">
                <li
                  className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                    activeItem === "/infodesk-dashboard"
                      ? "bg-red-100 text-primary_maroon font-semibold"
                      : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
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
                      ? "bg-red-100 text-primary_maroon font-semibold"
                      : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
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
                      ? "bg-red-100 text-primary_maroon font-semibold"
                      : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
                  }`}
                >
                  <FaUserMd className="mr-3" />
                  Doctors
                </li>
              </Link>
            </>
          )}

          {/* Philhealth Staff */}
          {user?.role === "Philhealth Staff" && (
            <Link to="/philhealth-dashboard">
              <li
                className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                  activeItem === "/philhealth-dashboard"
                    ? "bg-red-100 text-primary_maroon font-semibold"
                    : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
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
                  ? "bg-red-100 text-primary_maroon font-semibold"
                  : "text-gray-600 hover:bg-gray-100 transition-all hover:scale-105 hover:font-semibold"
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
