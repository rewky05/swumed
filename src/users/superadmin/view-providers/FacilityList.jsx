// import { useState, useEffect } from "react";
// import { getDatabase, ref, onValue } from "firebase/database";
// // import ViewModal from "../../modals/branch/View";
// // import UpdateModal from "../../modals/branch/Update";
// // import DeleteModal from "../../modals/branch/Delete";
// import Collapsible from "./Collapsible";
// import BranchDetails from "./BranchDetails";

// const FacilityList = ({ facilityType, title }) => {
//   const [loading, setLoading] = useState(true);
//   const [facilities, setFacilities] = useState([]);
//   const [selectedBranch, setSelectedBranch] = useState(null);
//   const [currentModal, setCurrentModal] = useState(null);

//   useEffect(() => {
//     const db = getDatabase();
//     const facilityRef = ref(db, facilityType);

//     const unsubscribe = onValue(facilityRef, (snapshot) => {
//       setLoading(true);
//       const facilityData = snapshot.exists()
//         ? Object.entries(snapshot.val()).map(([key, value]) => ({
//             id: key,
//             name: value.name,
//             branches: value.branch,
//           }))
//         : [];
//       setFacilities(facilityData);
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, [facilityType]);

//   const handleView = (branch) => {
//     setSelectedBranch(branch);
//     setCurrentModal("view");
//   };

//   const handleEdit = (facilityId, branchId, branch) => {
//     setSelectedBranch(branch);
//     setCurrentModal("edit");
//   };

//   const handleDelete = (facilityId, branchId) => {
//     setSelectedBranch({ id: branchId });
//     setCurrentModal("delete");
//   };

//   // const closeModal = () => {
//   //   setSelectedBranch(null);
//   //   setCurrentModal(null);
//   // };

//   if (loading) {
//     return <div>Loading {title}...</div>;
//   }

//   return (
//     <div className="overflow-x-auto border rounded-xl shadow-md p-4">
//   <h2 className="text-2xl mb-4">{title}</h2>
//   <table className="w-full text-left text-sm text-[#171A1F]">
//     <thead>
//       <tr className="border-b bg-[#FAFAFB] text-[#565E6C] font-medium p-4">
//         <th className="p-4">Facility Name</th>
//         <th className="p-4">Branch Name</th>
//         <th className="p-4 text-center">Actions</th>
//       </tr>
//     </thead>
//     <tbody className="bg-white">
//       {facilities.length > 0 ? (
//         facilities.map((facility) => (
//           <di key={facility.id}>
//             {Object.entries(facility.branches).map(([branchId, branch]) => (
//               <tr key={branchId} className="border-b">
//                 <td className="p-3">{facility.name}</td>
//                 <td className="p-3">{branch.name}</td>
//                 <td className="p-3 text-center">
//                   <button
//                     className="action-button mr-2"
//                     onClick={() => handleView(branch)}
//                   >
//                     View
//                   </button>
//                   <button
//                     className="action-button mr-2"
//                     onClick={() => handleEdit(facility.id, branchId, branch)}
//                   >
//                     Edit
//                   </button>
//                   <button
//                     className="action-button"
//                     onClick={() => handleDelete(facility.id, branchId)}
//                   >
//                     Delete
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </di>
//         ))
//       ) : (
//         <tr>
//           <td colSpan="3" className="text-center p-4">
//             No facilities found
//           </td>
//         </tr>
//       )}
//     </tbody>
//   </table>
// </div>

//   );
// };

// export default FacilityList;

import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
// import ViewModal from "../../modals/branch/View";
// import UpdateModal from "../../modals/branch/Update";
// import DeleteModal from "../../modals/branch/Delete";

const FacilityList = ({ facilityType, title }) => {
  const [loading, setLoading] = useState(true);
  const [facilities, setFacilities] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [currentModal, setCurrentModal] = useState(null);

  useEffect(() => {
    const db = getDatabase();
    const facilityRef = ref(db, facilityType);

    const unsubscribe = onValue(facilityRef, (snapshot) => {
      setLoading(true);
      const facilityData = snapshot.exists()
        ? Object.entries(snapshot.val()).map(([key, value]) => ({
            id: key,
            name: value.name,
            branches: value.branch,
          }))
        : [];
      setFacilities(facilityData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [facilityType]);

  const handleView = (branch) => {
    setSelectedBranch(branch);
    setCurrentModal("view");
  };

  const handleEdit = (facilityId, branchId, branch) => {
    setSelectedBranch(branch);
    setCurrentModal("edit");
  };

  const handleDelete = (facilityId, branchId) => {
    setSelectedBranch({ id: branchId });
    setCurrentModal("delete");
  };

  // const closeModal = () => {
  //   setSelectedBranch(null);
  //   setCurrentModal(null);
  // };

  if (loading) {
    return <div>Loading {title}...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center mb-4">
        <h2 className="text-lg font-semibold p-1">{title}</h2>
      </div>
      <div className="overflow-x-auto overflow-y-auto border rounded-xl overflow-hidden shadow-md">
        <table className="w-full text-left text-sm text-[#171A1F]">
          <thead>
            <tr className="border-b bg-[#FAFAFB] text-[#565E6C] font-medium p-4">
              <th className="p-4">Facility Name</th>
              <th className="p-4">Branch Name</th>
              <th className="p-4">Address</th>
              <th className="p-4">Staff</th>
              <th className="p-4">Patients</th>
              <th className="p-4">Doctors</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {facilities.length > 0 ? (
              facilities.map((facility) =>
                Object.entries(facility.branches).map(([branchId, branch]) => (
                  <tr key={branchId} className="border-b">
                    <td className="p-4">{facility.name}</td>
                    <td className="p-4">{branch.name}</td>
                    <td className="p-4">{branch.address}</td>
                    <td className="p-4">
                      {branch.staff ? Object.keys(branch.staff).length : 0}
                    </td>
                    <td className="p-4">
                      {branch.patients
                        ? Object.keys(branch.patients).length
                        : 0}
                    </td>
                    <td className="p-4">
                      {branch.doctors ? Object.keys(branch.doctors).length : 0}
                    </td>
                    <td className="p-4 text-center">
                      <button
                        onClick={() => handleView(branch)}
                        className="action-button"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          handleEdit(facility.id, branchId, branch)
                        }
                        className="action-button"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(facility.id, branchId)}
                        className="action-button"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )
            ) : (
              <tr>
                <td colSpan="7" className="text-center p-4">
                  No facilities found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FacilityList;
