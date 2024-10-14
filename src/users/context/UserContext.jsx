import { createContext, useContext, useState, useEffect } from 'react';
import { useAuthContext } from './AuthContext'; 
import { getUserData } from '../../backend/getUserData';

const UserContext = createContext();

const useUserContext = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUserContext must be used within a UserProvider');
  }
  return context;
};

const UserProvider = ({ children }) => {
  const { currentUser } = useAuthContext(); 
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        try {
          const userData = await getUserData(currentUser);
          setUser(userData);
        } catch (error) {
          console.error('Error fetching user data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchUserData();
    } else {
      setUser(null);
      setLoading(false);
    }
  }, [currentUser]);  

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {!loading && children}
    </UserContext.Provider>
  );
};

export { UserProvider, useUserContext, UserContext };
