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
import DashboardPhilhealth from "./users/philhealth/Dashboard";
import Accounts from "./users/superadmin/accounts/Accounts";
import HealthcareProvider from "./users/superadmin/accounts/HealthcareProvider";

import { UserProvider } from "./users/context/UserContext";
import { PatientProvider } from "./users/context/PatientContext";
import { ProviderProvider } from "./users/context/ProviderContext";
import { AuthProvider } from "./users/context/AuthContext";
import { MedicalRecordsProvider } from "./users/context/MedicalRecordsContext";

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
    return <div>Loading...</div>; // Optionally add a loading spinner or message
  }

  return (
    <Router>
      <AuthProvider value={{ user, setUser }}> {/* Wrap the entire app with AuthProvider */}
        <UserProvider>
          <PatientProvider>
            <ProviderProvider>
              <MedicalRecordsProvider> {/* Move MedicalRecordsProvider outside of Routes */}
                <Routes>
                  <Route path="/" element={<Navigate to="/login" />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/infodesk-dashboard" element={<Layout />}>
                    <Route index element={<DashboardInfodesk />} />
                    <Route path="patients" element={<Patients />} /> {/* Patients route */}
                    <Route path="doctors" element={<Doctors />} />
                    <Route path="settings" element={<Settings />} />
                  </Route>
                  <Route path="/superadmin-dashboard" element={<Layout />}>
                    <Route index element={<DashboardSuperadmin />} />
                    <Route path="accounts" element={<Accounts />} />
                    <Route
                      path="healthcare-provider"
                      element={<HealthcareProvider />}
                    />
                  </Route>
                  <Route path="/philhealth-dashboard" element={<Layout />}>
                    <Route index element={<DashboardPhilhealth />} />
                  </Route>
                </Routes>
              </MedicalRecordsProvider>
            </ProviderProvider>
          </PatientProvider>
        </UserProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
