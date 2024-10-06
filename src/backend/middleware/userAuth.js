const admin = require('firebase-admin');

const checkRole = (allowedRoles) => {
  return async (req, res, next) => {
    try {
      const userId = req.body.userId; 

      const userPaths = ['doctors', 'patients', 'staff', 'superadmins'];
      let userRole = null;

      for (const path of userPaths) {
        const userRecord = await admin.database().ref(`${path}/${userId}`).once('value');
        if (userRecord.exists()) {
          const userData = userRecord.val();
          
          if (path === 'staff') {
            const roleMapping = {
              'Information Desk Staff': 'Information Desk Staff',
              'Philhealth Staff': 'Philhealth Staff'
            };
            userRole = roleMapping[userData.role] || 'staff'; 
          } else {
            userRole = path.slice(0, -1); 
          }

          break; 
        }
      }

      if (userRole && allowedRoles.includes(userRole)) {
        next(); 
      } else {
        return res.status(403).json({ message: 'Access denied' });
      }

    } catch (error) {
      return res.status(500).json({ message: 'Error checking role', error });
    }
  };
};

module.exports = { checkRole };
