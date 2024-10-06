import { auth, database } from '../backend/firebase'; 

export const getCurrentUser = async () => {
  const user = auth.currentUser;

  if (user) {
    const userId = user.uid;
    
    const userPaths = ['doctors', 'patients', 'staff', 'superadmins']; 

    for (const path of userPaths) {
      const userRef = database.ref(`${path}/${userId}`);
      const snapshot = await userRef.once('value');

      if (snapshot.exists()) {
        const userData = snapshot.val();

        if (path === 'staff') {
          const roleMapping = {
            'Information Desk Staff': 'Information Desk Staff',
            'Philhealth Staff': 'Philhealth Staff'
          };
          userData.role = roleMapping[userData.role] || 'staff'; 
        } else {
          userData.role = path.slice(0, -1); 
        }

        return { ...user, ...userData }; 
      }
    }

    return null;
  } else {
    return null;
  }
};
