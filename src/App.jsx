import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { auth } from "./backend/firebase";
import { getUserData } from "./backend/getUserData";
import Login from "./Login";
import Layout from "./users/Layout";
import Patients from "./users/infodesk/main/Patients";
import Doctors from "./users/infodesk/main/Doctors";

import Settings from "./users/Settings";

import DashboardSuperadmin from "./users/superadmin/Dashboard";
import DashboardInfodesk from "./users/infodesk/Dashboard";

import Accounts from "./users/superadmin/accounts/Accounts";
import DoctorsSuperadmin from "./users/superadmin/view-accounts/Doctors";
import PatientsSuperadmin from "./users/superadmin/view-accounts/Patients";
import InfodeskSuperadmin from "./users/superadmin/view-accounts/Infodesk";
import PhilhealthSuperadmin from "./users/superadmin/view-accounts/Philhealth";
import HealthcareProvider from "./users/superadmin/accounts/HealthcareProvider";
import FacilityList from "./users/superadmin/view-providers/FacilityList";
// import HospitalsSuperadmin from "./users/superadmin/view-providers/Hospitals";

import { UserProvider } from "./users/context/UserContext";
import { PatientProvider } from "./users/context/PatientContext";
import { AuthProvider } from "./users/context/AuthContext";
import { MedicalRecordsProvider } from "./users/context/MedicalRecordsContext";
import { DoctorProvider } from "./users/context/DoctorContext";

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const userData = await getUserData(currentUser);
          setUser(userData);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <AuthProvider value={{ user, setUser }}>
        <UserProvider>
          <PatientProvider>
            <MedicalRecordsProvider>
              <DoctorProvider>
                <Routes>
                  <Route
                    path="/"
                    element={
                      user ? (
                        user.role === "superadmin" ? (
                          <Navigate to="/superadmin-dashboard" />
                        ) : user.role === "Information Desk Staff" ? (
                          <Navigate to="/infodesk-dashboard" />
                        ) : user.role === "Philhealth Staff" ? (
                          <Navigate to="/philhealth-dashboard" />
                        ) : (
                          <p>Unauthorized</p>
                        )
                      ) : (
                        <Login />
                      )
                    }
                  />

                  {user && (
                    <Route path="/" element={<Layout user={user} />}>
                      {/* Superadmin Routes */}
                      {user.role === "superadmin" && (
                        <>
                          <Route
                            path="superadmin-dashboard"
                            element={<DashboardSuperadmin />}
                          />
                          <Route path="accounts" element={<Accounts />} />

                          <Route
                            path="doctors-superadmin"
                            element={<DoctorsSuperadmin />}
                          />
                          <Route
                            path="patients-superadmin"
                            element={<PatientsSuperadmin />}
                          />
                          <Route
                            path="infodesk-superadmin"
                            element={<InfodeskSuperadmin />}
                          />
                          <Route
                            path="philhealth-superadmin"
                            element={<PhilhealthSuperadmin />}
                          />
                          <Route
                            path="healthcare-provider"
                            element={<HealthcareProvider />}
                          />

                          <Route
                            path="clinics-superadmin"
                            element={
                              <FacilityList
                                facilityType="clinics"
                                title="Clinics"
                              />
                            }
                          />
                          <Route
                            path="hospitals-superadmin"
                            element={
                              <FacilityList
                                facilityType="hospitals"
                                title="Hospitals"
                              />
                            }
                          />
                        </>
                      )}

                      {/* Information Desk Staff Routes */}
                      {user.role === "Information Desk Staff" && (
                        <>
                          <Route
                            path="infodesk-dashboard"
                            element={<DashboardInfodesk />}
                          />
                          <Route path="patients" element={<Patients />} />
                          <Route
                            path="doctors"
                            element={<Doctors user={user} />}
                          />
                        </>
                      )}

                      {/* Philhealth Staff Routes */}
                      {user.role === "Philhealth Staff" && (
                        <>
                          <Route
                            path="philhealth-dashboard"
                            element={<Patients />}
                          />
                          <Route path="patients" element={<Patients />} />
                        </>
                      )}

                      {/* Settings accessible to all */}
                      <Route path="settings" element={<Settings />} />

                      <Route
                        path="*"
                        element={
                          ![
                            "Superadmin",
                            "Information Desk Staff",
                            "Philhealth Staff",
                          ].includes(user.role) ? (
                            <p>Unauthorized</p>
                          ) : (
                            <Navigate to="/" />
                          )
                        }
                      />
                    </Route>
                  )}
                </Routes>
              </DoctorProvider>
            </MedicalRecordsProvider>
          </PatientProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
