import { ref, get } from "firebase/database";
import { database } from './firebase'; 

export const getUserData = async (currentUser) => {
  if (!currentUser) {
    return null;
  }

  const userPaths = ['doctors', 'patients', 'staff', 'superadmins'];
  let userData = null;

  for (const path of userPaths) {
    const userRef = ref(database, `${path}/${currentUser.uid}`);
    const snapshot = await get(userRef);

    if (snapshot.exists()) {
      userData = snapshot.val();

      if (path === 'staff') {
        const roleMapping = {
          'Information Desk Staff': 'Information Desk Staff',
          'Philhealth Staff': 'Philhealth Staff'
        };
        userData.role = roleMapping[userData.role] || 'staff';
      } else {
        userData.role = path.slice(0, -1); 
      }

      break; 
    }
  }

  return userData; 
};
