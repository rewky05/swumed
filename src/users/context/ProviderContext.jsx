import { createContext, useContext, useState, useCallback  } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database'; // Firebase methods

const ProviderContext = createContext();

export const useProviderContext = () => {
  return useContext(ProviderContext);
};

export const ProviderProvider = ({ children }) => {
  const [providerId, setProviderId] = useState(null); 
  const [branchId, setBranchId] = useState(null); 
  const [providerType, setProviderType] = useState(null); 
  const [doctors, setDoctors] = useState([]); // Add a state to hold the fetched doctors

  // const fetchBranchDoctors = useCallback(async (providerId, providerType) => {
  //   const db = getDatabase();
  //   const doctorsRef = ref(db, `doctors/${providerType}/${providerId}/${branchId}`);

  //   return new Promise((resolve, reject) => {
  //     onValue(
  //       doctorsRef,
  //       (snapshot) => {
  //         const doctorsData = snapshot.val();
  //         if (doctorsData) {
  //           const doctorsArray = Object.keys(doctorsData).map((key) => ({
  //             ...doctorsData[key],
  //             id: key,
  //           }));
  //           setDoctors(doctorsArray); // Set the doctors state
  //           resolve(doctorsArray);
  //         } else {
  //           setDoctors([]);
  //           resolve([]);
  //         }
  //       },
  //       (error) => {
  //         console.error("Error fetching doctors:", error);
  //         reject(error);
  //       }
  //     );
  //   });
  // }, []);

  const fetchBranchDoctors = useCallback(async (providerId, branchId, providerType) => {
    const db = getDatabase();
    const doctorsRef = ref(db, `facilityType/${providerType}/${providerId}/branch/${branchId}/doctors`);
  
    return new Promise((resolve, reject) => {
      onValue(
        doctorsRef,
        (snapshot) => {
          const doctorsData = snapshot.val();
          if (doctorsData) {
            const doctorsArray = Object.keys(doctorsData).map((key) => ({
              ...doctorsData[key],
              id: key,
            }));
            setDoctors(doctorsArray);
            resolve(doctorsArray);
          } else {
            setDoctors([]);
            resolve([]);
          }
        },
        (error) => {
          console.error("Error fetching doctors:", error);
          reject(error);
        }
      );
    });
  }, []);
  
  return (
    <ProviderContext.Provider value={{ 
      providerId, 
      setProviderId, 
      branchId, 
      setBranchId, 
      providerType, 
      setProviderType,
      doctors, // Provide the doctors array
      fetchBranchDoctors, // Provide the fetch function
    }}>
      {children}
    </ProviderContext.Provider>
  );
};

export default ProviderContext;
