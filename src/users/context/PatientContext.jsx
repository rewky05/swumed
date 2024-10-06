import { useContext, createContext, useState, useCallback } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database'; // Firebase methods

const PatientContext = createContext();

export const usePatientContext = () => {
  return useContext(PatientContext);
};

export const PatientProvider = ({ children }) => {
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]); // This is the state

  const fetchPatients = useCallback(async () => {
    const db = getDatabase();
    const patientsRef = ref(db, 'patients'); // Reference to the patients node

    return new Promise((resolve, reject) => {
      onValue(
        patientsRef,
        (snapshot) => {
          const patientsData = snapshot.val();
          if (patientsData) {
            const patientsArray = Object.keys(patientsData).map((key) => ({
              ...patientsData[key],
              id: key,
            }));
            setPatients(patientsArray); // Setting the state
            resolve(patientsArray);
          } else {
            setPatients([]); // If no data, set to empty array
            resolve([]);
          }
        },
        (error) => {
          console.error("Error fetching patients:", error);
          reject(error);
        }
      );
    });
  }, []);

  return (
    <PatientContext.Provider
      value={{
        selectedPatientId,
        setSelectedPatientId,
        selectedPatient,
        setSelectedPatient,
        patients,
        fetchPatients,
      }}
    >
      {children}
    </PatientContext.Provider>
  );
};

export default PatientContext;
