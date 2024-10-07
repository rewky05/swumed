import { createContext, useState, useContext, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

const MedicalRecordsContext = createContext();

export const useMedicalRecordsContext = () => useContext(MedicalRecordsContext);

export const MedicalRecordsProvider = ({ children }) => {
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const db = getDatabase();
    const recordsRef = ref(db, "patients");

    onValue(recordsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const recordsList = Object.keys(data).map((key) => ({
          id: key, 
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
