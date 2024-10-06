import { createContext, useState, useContext, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

// Create the context
const MedicalRecordsContext = createContext();

// Custom hook for accessing the Medical Records context
export const useMedicalRecordsContext = () => useContext(MedicalRecordsContext);

// MedicalRecordsProvider component that provides the context to its children
export const MedicalRecordsProvider = ({ children }) => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch medical records on mount
    const db = getDatabase();
    const recordsRef = ref(db, "patients");

    onValue(recordsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const recordsList = Object.keys(data).map((key) => ({
          id: key, // Patient UID
          ...data[key],
        }));
        setMedicalRecords(recordsList);
      }
      setLoading(false);
    });
  }, []);

  return (
    <MedicalRecordsContext.Provider value={{ medicalRecords, setMedicalRecords, loading }}>
      {children}
    </MedicalRecordsContext.Provider>
  );
};
