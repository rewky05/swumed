import { createContext, useContext, useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../backend/firebase"; 
import { useUserContext } from "./UserContext"; 

const DoctorContext = createContext();
export const useDoctorContext = () => useContext(DoctorContext);

export const DoctorProvider = ({ children }) => {
  const { user } = useUserContext(); 

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorDetails = (doctorIds) => {
      const doctorsData = [];

      doctorIds.forEach((doctorId) => {
        const doctorRef = ref(database, `doctors/${doctorId}`);

        onValue(doctorRef, (snapshot) => {
          const doctor = snapshot.val();
          if (doctor) {
            doctorsData.push({ id: doctorId, ...doctor });
          }
        });
      });

      setDoctors(doctorsData);
      console.log(doctors)
      setLoading(false);
      console.log("Fetched doctor details:", doctorsData);
    };

    const fetchDoctors = () => {
      if (user && (user.clinic_id || user.hospital_id) && user.branch_id) {
        const path = user.clinic_id
          ? `clinics/${user.clinic_id}/branch/${user.branch_id}/doctors`
          : `hospitals/${user.hospital_id}/branch/${user.branch_id}/doctors`;

        const doctorsRef = ref(database, path);
        console.log("Fetching doctor IDs from:", path);

        onValue(doctorsRef, (snapshot) => {
          const doctorIds = snapshot.val() ? Object.keys(snapshot.val()) : [];
          console.log("Doctor IDs:", doctorIds);

          if (doctorIds.length > 0) {
            fetchDoctorDetails(doctorIds);
          } else {
            setDoctors([]);
            setLoading(false);
          }
        });
      } else {
        setDoctors([]);
        setLoading(false);
        console.log("User does not have valid clinic or hospital ID");
      }
    };

    fetchDoctors();
  }, [user]);

  return (
    <DoctorContext.Provider value={{ doctors, loading }}>
      {children}
    </DoctorContext.Provider>
  );
};

