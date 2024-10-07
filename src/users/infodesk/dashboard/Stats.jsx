import { useState, useEffect } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js";
import { getDatabase, ref, onValue } from "firebase/database";
import { useUserContext } from "../../context/UserContext"; 
import { usePatientContext } from "../../context/PatientContext"; 

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const Stats = () => {
  const { user, loading } = useUserContext();
  const { patients, fetchPatients } = usePatientContext(); 

  const [patientsData, setPatientsData] = useState([0, 0]);
  const [doctorsData, setDoctorsData] = useState([]);
  const [admissionsData, setAdmissionsData] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [recentAdmissions, setRecentAdmissions] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (user) {
        console.log("User data:", user);

        if (patients.length === 0) {
          await fetchPatients(); 
        }

        if (patients.length > 0 && totalPatients !== patients.length) {
          const patientsCount = patients.length;
          setTotalPatients(patientsCount);
          setPatientsData([patientsCount, 10 - patientsCount]);
        }

        const db = getDatabase();
        const today = new Date().toISOString().split("T")[0];
        const facilityId = user.hospital_id || user.clinic_id;
        const facilityType = user.hospital_id ? "hospitals" : "clinics";
        const branchId = user.branch_id;
        const branchRef = ref(db, `${facilityType}/${facilityId}/branch/${branchId}`);

        onValue(branchRef, (snapshot) => {
          const branchData = snapshot.val();

          if (branchData) {
            const doctorsCount = branchData.doctors ? Object.keys(branchData.doctors).length : 0;
            setTotalDoctors(doctorsCount);
            setDoctorsData([doctorsCount, 10 - doctorsCount]);

            const admissions = [4, 1, 1, 1, 6];
            Object.entries(branchData.patients || {}).forEach(([patientId]) => {
              const patientRef = ref(db, `patients/${patientId}/medicalRecords`);
              onValue(patientRef, (recordSnapshot) => {
                const records = recordSnapshot.val();
                if (records) {
                  Object.entries(records).forEach(([recordId, record]) => {
                    if (record.date === today) {
                      admissions.push(record);
                    }
                  });
                }
              });
            });

            setRecentAdmissions(admissions.length);
            setAdmissionsData(admissions.map((_, i) => (i + 1) * 10)); 
          }
        });
      }
    };

    fetchData();
  }, [user, fetchPatients, patients, totalPatients]);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Overview Statistics</h2>
      <div className="flex justify-between items-center w-full gap-8">
        
        {/* Total Patients */}
        <div className="shadow-lg p-4 rounded-lg bg-white w-full flex items-center h-40">
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
            <div className="text-3xl font-bold">{totalPatients}</div>
          </div>
          <div className="w-1/2 h-full flex justify-center items-center">
            <Pie
              data={{
                labels: ["Active", "Inactive"],
                datasets: [
                  {
                    label: "Patients",
                    data: patientsData,
                    backgroundColor: ["rgba(102, 24, 30, 1)", "rgba(255, 99, 132, 0.5)"],
                    borderColor: ["rgba(102, 24, 30, 1)", "rgba(255, 99, 132, 0.5)"],
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                  tooltip: {
                    enabled: true,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Total Doctors */}
        <div className="shadow-lg p-4 rounded-lg bg-white w-full flex items-center h-40">
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-2">Total Doctors</h3>
            <div className="text-3xl font-bold">{totalDoctors}</div>
          </div>
          <div className="w-1/2 h-full flex justify-center items-center">
            <Line
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                datasets: [
                  {
                    label: "Doctors",
                    data: doctorsData,
                    backgroundColor: "rgba(102, 24, 30, 1)",
                    borderColor: "rgba(102, 24, 30, 1)",
                    borderWidth: 2,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>

        {/* Recent Admissions */}
        <div className="shadow-lg p-4 rounded-lg bg-white w-full flex items-center h-40">
          <div className="w-1/2">
            <h3 className="text-lg font-semibold mb-2">Recent Admissions</h3>
            <div className="text-3xl font-bold">{recentAdmissions}</div>
          </div>
          <div className="w-1/2 h-full flex justify-center items-center">
            <Bar
              data={{
                labels: ["Jan", "Feb", "Mar", "Apr", "May"],
                datasets: [
                  {
                    label: "Admissions",
                    data: admissionsData,
                    backgroundColor: "rgba(102, 24, 30, 1)",
                    borderColor: "rgba(102, 24, 30, 1)",
                    borderWidth: 1,
                  },
                ],
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                  },
                },
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Stats;
