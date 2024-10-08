import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getDatabase, ref, onValue } from "firebase/database";
import { auth } from "../../backend/firebase";
import { getUserData } from "../../backend/getUserData";
import { useUserContext } from "../context/UserContext"; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const [clinicsCount, setClinicsCount] = useState(0);
  const [hospitalsCount, setHospitalsCount] = useState(0);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);

  const [totalStaff, setTotalStaff] = useState(0);
  const [infoDeskStaffCount, setInfoDeskStaffCount] = useState(0);
  const [philHealthStaffCount, setPhilHealthStaffCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const { user } = useUserContext(); 

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      if (currentUser) {
        try {
          const userData = await getUserData(currentUser);
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const db = getDatabase();

    if (user && user.role === "superadmin") {
      const clinicsRef = ref(db, "clinics");
      onValue(clinicsRef, (snapshot) => {
        const clinics = snapshot.val();
        const clinicsCount = clinics ? Object.keys(clinics).length : 0;
        setClinicsCount(clinicsCount);
      });

      const hospitalsRef = ref(db, "hospitals");
      onValue(hospitalsRef, (snapshot) => {
        const hospitals = snapshot.val();
        const hospitalsCount = hospitals ? Object.keys(hospitals).length : 0;
        setHospitalsCount(hospitalsCount);
      });

      const patientsRef = ref(db, "patients");
      onValue(patientsRef, (snapshot) => {
        const patients = snapshot.val();
        const patientsCount = patients ? Object.keys(patients).length : 0;
        setTotalPatients(patientsCount);
      });

      const doctorsRef = ref(db, "doctors");
      onValue(doctorsRef, (snapshot) => {
        const doctors = snapshot.val();
        const doctorsCount = doctors ? Object.keys(doctors).length : 0;
        setTotalDoctors(doctorsCount);
      });

      const staffRef = ref(db, "staff");
      onValue(staffRef, (snapshot) => {
        const staff = snapshot.val();
        if (staff) {
          const staffKeys = Object.keys(staff);
          const totalStaff = staffKeys.length;
          const infoDeskStaffCount = staffKeys.filter(
            (key) => staff[key].role === "Information Desk Staff"
          ).length;
          const philHealthStaffCount = staffKeys.filter(
            (key) => staff[key].role === "Philhealth Staff"
          ).length;

          setTotalStaff(totalStaff);
          setInfoDeskStaffCount(infoDeskStaffCount);
          setPhilHealthStaffCount(philHealthStaffCount);
        } else {
          setTotalStaff(0);
          setInfoDeskStaffCount(0);
          setPhilHealthStaffCount(0);
        }
      });
    }
  }, [user]);

  if (loading) return <div>Loading...</div>;

  return (
    user &&
    user.role === "superadmin" && (
      <div className="p-8">
        <h2 className="text-2xl font-semibold mb-4">Overview Statistics</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="shadow-lg p-4 rounded-lg bg-white">
            <h3 className="text-lg font-semibold mb-4">Hospitals vs Clinics</h3>
            <Bar
            className=""
              data={{
                labels: ["Hospitals", "Clinics"],
                datasets: [
                  {
                    label: "Count",
                    data: [hospitalsCount, clinicsCount],
                    backgroundColor: [
                      "rgba(128, 118, 118)",
                      "rgba(128, 118, 118)",
                    ],
                    
                    
                    borderRadius: 60,
                  },
                ],
              }}
              options={{
                responsive: true,
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: "rgba(102, 24, 30, 1)" 
                    }
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                    grid: {
                      color: "rgba(102, 24, 30, 1)" 
                    }
                  },
                },
              }}
            />
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-4 h-fit">
              <div className="shadow-lg p-4 rounded-lg bg-highlight_pink text-primary_maroon text-center">
                <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
                <div className="text-7xl font-bold">{totalPatients}</div>
              </div>

              <div className="shadow-lg p-4 rounded-lg bg-highlight_pink text-primary_maroon text-center">
                <h3 className="text-lg font-semibold mb-2">Total Doctors</h3>
                <div className="text-7xl font-bold">{totalDoctors}</div>
              </div>
            </div>

            <div className="w-full flex items-center">
              <div className="shadow-lg p-4 pt-8 rounded-lg bg-highlight_pink text-primary_maroon text-center">
                <h3 className="text-lg font-semibold mb-2">Total Staff</h3>
                <div className="text-7xl font-bold">{totalStaff}</div>
                <div className="flex justify-center gap-4 items-center p-4">
                  <div className="p-4 rounded-lg bg-highlight_pink text-primary_maroon text-center">
                    <h3 className="font-semibold mb-2">
                      Information Desk Staff
                    </h3>
                    <div className="text-6xl font-bold">
                      {infoDeskStaffCount}
                    </div>
                  </div>
                  <div className="p-4 rounded-lg bg-highlight_pink text-primary_maroon text-center">
                    <h3 className="font-semibold mb-2">
                      PhilHealth Staff
                    </h3>
                    <div className="text-6xl font-bold">
                      {philHealthStaffCount}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  );
};

export default Dashboard;
