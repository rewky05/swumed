import { createContext, useContext, useState, useCallback } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database'; 

const ProviderContext = createContext();

export const useProviderContext = () => {
  return useContext(ProviderContext);
};

export const ProviderProvider = ({ children }) => {
  const [providerId, setProviderId] = useState(null); 
  const [branchId, setBranchId] = useState(null);
  const [providerType, setProviderType] = useState(null); 
  const [doctors, setDoctors] = useState([]); 

  const fetchBranchDoctors = useCallback(async (providerId, branchId, providerType) => {
    const db = getDatabase();
    
    const providerPath = providerType === 'clinic' ? 'clinics' : 'hospitals';
    const doctorsRef = ref(db, `${providerPath}/${providerId}/branch/${branchId}/doctors`);

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
      doctors,
      fetchBranchDoctors, 
    }}>
      {children}
    </ProviderContext.Provider>
  );
};

export default ProviderContext;
