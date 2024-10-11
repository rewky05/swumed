import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";

const InfodeskStaff = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [selectedStaff, setSelectedStaff] = useState(null);

  const fetchHospitalAndBranchNames = async (hospitalId, clinicId, branchId) => {
    const db = getDatabase();
  
    const branchRef = hospitalId
      ? ref(db, `hospitals/${hospitalId}/branch/${branchId}/name`)
      : clinicId
      ? ref(db, `clinics/${clinicId}/branch/${branchId}/name`)
      : null; 
  
    let namePromise;
  
    if (clinicId) {
      namePromise = ref(db, `clinics/${clinicId}/name`);
    } else if (hospitalId) {
      namePromise = ref(db, `hospitals/${hospitalId}/name`);
    } else {
      namePromise = Promise.resolve("Unknown");
    }
  
    const branchNamePromise = branchRef
      ? new Promise((resolve) => {
          onValue(branchRef, (snapshot) => {
            resolve(snapshot.val());
          });
        })
      : Promise.resolve("Unknown"); 
  
    const [nameSnapshot, branchName] = await Promise.all([
      namePromise
        ? new Promise((resolve) => onValue(namePromise, (snapshot) => resolve(snapshot.val())))
        : Promise.resolve("Unknown"),
      branchNamePromise,
    ]);
  
    return {
      hospitalName: nameSnapshot || "Unknown",
      branchName: branchName || "Unknown",
    };
  };  

  const fetchStaffMembers = () => {
    const db = getDatabase();
    const staffRef = ref(db, "staff");
  
    onValue(staffRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const staffList = await Promise.all(
          Object.keys(data)
            .filter((key) => data[key].role === "Information Desk Staff")
            .map(async (key) => {
              const { hospital_id, clinic_id, branch_id } = data[key];
              const { hospitalName, branchName } = await fetchHospitalAndBranchNames(
                hospital_id || null,
                clinic_id || null,
                branch_id
              );
              return {
                id: key,
                ...data[key],
                hospitalName,
                branchName,
              };
            })
        );
        setStaffMembers(staffList);
      }
    });
  };  

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const handleViewStaffDetails = (staff) => {
    setSelectedStaff(staff);
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-4">Information Desk Staff</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Name</th>
              <th className="p-2">Email</th>
              <th className="p-2">Branch</th>
              <th className="p-2">Hospital/Clinic</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffMembers.length > 0 ? (
              staffMembers.map((staff) => (
                <tr key={staff.id} className="border-b">
                  <td className="p-2">{staff.name}</td>
                  <td className="p-2">{staff.account.email}</td>
                  <td className="p-2">{staff.branchName}</td>
                  <td className="p-2">{staff.hospitalName}</td>
                  <td className="p-2 text-center">
                    <button
                      onClick={() => handleViewStaffDetails(staff)}
                      className="text-blue-500 underline"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-2">
                  No Information Desk Staff found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default InfodeskStaff;
