import Stats from "./dashboard/Stats";
import Patients from "./dashboard/Patients";
import Doctors from "./dashboard/Doctors";

import { useState, useEffect } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../backend/firebase';

import { usePatientContext } from '../context/PatientContext';
import { useAuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const { selectedPatientId, setSelectedPatientId, selectedPatient, setSelectedPatient } = usePatientContext();
  const { currentUser, loading } = useAuthContext();
  
  const [allPatients, setAllPatients] = useState([]);

  useEffect(() => {
    const patientsRef = ref(database, 'patients');
  
    const unsubscribe = onValue(patientsRef, (snapshot) => {
      const patientsData = snapshot.val();
      if (patientsData) {
        const patientsArray = Object.keys(patientsData).map((key) => ({
          id: key,
          ...patientsData[key]
        }));
        setAllPatients(patientsArray);
      }
    });
  
    return () => {
      unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col">
      <Stats />
      <Patients 
        allPatients={allPatients} 
        selectedPatient={selectedPatient} 
        setSelectedPatient={setSelectedPatient}
        setSelectedPatientId={setSelectedPatientId}
      />
      <Doctors />
    </div>
  );
};

export default Dashboard;
