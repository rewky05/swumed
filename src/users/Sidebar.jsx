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
                      ? "sidebar-active"
                      : "sidebar-inactive"
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
                      ? "sidebar-active"
                      : "sidebar-inactive"
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
                            ? "sidebar-active"
                            : "sidebar-inactive"
                        }`}
                      >
                        Create Account
                      </li>
                    </Link>

                    <Link to="/doctors-superadmin">
                      <li
                        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                          activeItem === "/doctors-superadmin"
                            ? "sidebar-active"
                            : "sidebar-inactive"
                        }`}
                      >
                        Doctors
                      </li>
                    </Link>

                    <Link to="/patients-superadmin">
                      <li
                        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                          activeItem === "/patients-superadmin"
                            ? "sidebar-active"
                            : "sidebar-inactive"
                        }`}
                      >
                        Patients
                      </li>
                    </Link>

                    <Link to="/infodesk-superadmin">
                      <li
                        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                          activeItem === "/infodesk-superadmin"
                            ? "sidebar-active"
                            : "sidebar-inactive"
                        }`}
                      >
                        Information Desk Staff
                      </li>
                    </Link>

                    <Link to="/philhealth-superadmin">
                      <li
                        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                          activeItem === "/philhealth-superadmin"
                            ? "sidebar-active"
                            : "sidebar-inactive"
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
                      ? "sidebar-active"
                      : "sidebar-inactive"
                  }`}
                >
                  <FaHospital className="mr-3" />
                  Healthcare Facilities
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
                            ? "sidebar-active"
                            : "sidebar-inactive"
                        }`}
                      >
                        Add Facility
                      </li>
                    </Link>

                    <Link to="/hospitals-superadmin">
                      <li
                        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                          activeItem === "/hospitals-superadmin"
                            ? "sidebar-active"
                            : "sidebar-inactive"
                        }`}
                      >
                        Hospitals
                      </li>
                    </Link>

                    <Link to="/clinics-superadmin">
                      <li
                        className={`flex items-center py-2 px-4 rounded-lg cursor-pointer ${
                          activeItem === "/clinics-superadmin"
                            ? "sidebar-active"
                            : "sidebar-inactive"
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
                      ? "sidebar-active"
                      : "sidebar-inactive"
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
                      ? "sidebar-active"
                      : "sidebar-inactive"
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
                      ? "sidebar-active"
                      : "sidebar-inactive"
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
                    ? "sidebar-active"
                    : "sidebar-inactive"
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
                  ? "sidebar-active"
                  : "sidebar-inactive"
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
          className="rounded-md text-white py-[7px] px-8 flex items-center bg-primary_maroon hover:bg-light_maroon hover:transition-all duration-200"
        >
          <BiLogOut className="mr-2" />
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
