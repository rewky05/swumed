// import { useState, useEffect } from "react";
// import { getDatabase, ref, onValue } from "firebase/database";

// const Philhealth = () => {
//   const [staffMembers, setStaffMembers] = useState([]);
//   const [selectedStaff, setSelectedStaff] = useState(null);
//   const [searchTerm, setSearchTerm] = useState("");

//   const fetchHospitalAndBranchNames = async (hospitalId, branchId) => {
//     const db = getDatabase();

//     const hospitalRef = ref(db, `hospitals/${hospitalId}/name`);
//     const clinicRef = ref(db, `clinics/${hospitalId}/name`);
//     const branchRef = ref(
//       db,
//       `hospitals/${hospitalId}/branch/${branchId}/name`
//     );

//     const hospitalNamePromise = new Promise((resolve) => {
//       onValue(hospitalRef, (snapshot) => {
//         resolve(snapshot.val());
//       });
//     });

//     const clinicNamePromise = new Promise((resolve) => {
//       onValue(clinicRef, (snapshot) => {
//         resolve(snapshot.val());
//       });
//     });

//     const branchNamePromise = new Promise((resolve) => {
//       onValue(branchRef, (snapshot) => {
//         resolve(snapshot.val());
//       });
//     });

//     const [hospitalName, clinicName, branchName] = await Promise.all([
//       hospitalNamePromise,
//       clinicNamePromise,
//       branchNamePromise,
//     ]);

//     return {
//       hospitalName: hospitalName || clinicName || "Unknown",
//       branchName: branchName || "Unknown",
//     };
//   };

//   const fetchStaffMembers = () => {
//     const db = getDatabase();
//     const staffRef = ref(db, "staff");

//     onValue(staffRef, async (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         const staffList = await Promise.all(
//           Object.keys(data)
//             .filter((key) => data[key].role === "Philhealth Staff")
//             .map(async (key) => {
//               const { hospital_id, branch_id } = data[key];
//               const { hospitalName, branchName } =
//                 await fetchHospitalAndBranchNames(hospital_id, branch_id);
//               return {
//                 id: key,
//                 ...data[key],
//                 hospitalName,
//                 branchName,
//               };
//             })
//         );
//         setStaffMembers(staffList);
//       }
//     });
//   };

//   useEffect(() => {
//     fetchStaffMembers();
//   }, []);

//   const handleViewStaffDetails = (staff) => {
//     setSelectedStaff(staff);
//   };

//   const filteredPhilhealth = staffMembers.filter((staff) => {
//     const staffFirstName = staff.firstName?.toLowerCase() || "";
//     const staffLastName = staff.lastName?.toLowerCase() || "";
//     const staffEmail = staff.account?.email?.toLowerCase() || "";
//     const branchName = staff.branchName?.toLowerCase() || "";
//     const facilityName = staff.hospitalName?.toLowerCase() || "";

//     const searchLower = searchTerm.toLowerCase();

//     return (
//       staffFirstName.includes(searchLower) ||
//       staffLastName.includes(searchLower) ||
//       branchName.includes(searchLower) ||
//       staffEmail.includes(searchLower) ||
//       facilityName.includes(searchLower)
//     );
//   });

//   const handleSearchChange = (e) => {
//     setSearchTerm(e.target.value);
//   };

//   return (
//     <div className="p-8">
//       <div className="flex flex-col gap-4 mb-4">
//         <div className="flex flex-col">
//           <h2 className="text-xl font-semibold p-1">Philhealth Staff</h2>
//         </div>

//         <input
//           type="text"
//           placeholder="Search Patients"
//           value={searchTerm}
//           onChange={handleSearchChange}
//           className="border border-gray-300 rounded-md p-2 w-[32.9%] text-sm"
//         />

//         <div className="overflow-x-auto overflow-y-auto border rounded-xl overflow-hidden">
//           <table className="w-full text-left text-[#171A1F] text-sm">
//             <thead>
//               <tr className="border-b bg-[#FAFAFB] text-[#565E6C] font-medium p-4">
//                 <th className="p-4">Name</th>
//                 <th className="p-4">Email</th>
//                 <th className="p-4">Facility</th>
//                 <th className="p-4">Branch</th>
//                 <th className="p-4 text-center">Actions</th>
//               </tr>
//             </thead>
//             <tbody className="bg-white">
//               {filteredPhilhealth.length > 0 ? (
//                 filteredPhilhealth.map((staff) => {
//                   return (
//                     <tr key={staff.id} className="border-b">
//                       <td className="p-3 pl-4">
//                         {staff.firstName + " " + staff.lastName || "N/A"}
//                       </td>
//                       <td className="p-3">{staff.account.email}</td>
//                       <td className="p-3">{staff.hospitalName}</td>
//                       <td className="p-3">{staff.branchName}</td>
//                       <td className="p-3 text-center">
//                         <button
//                           onClick={() => handleViewStaffDetails(staff)}
//                           className="action-button"
//                         >
//                           View
//                         </button>
//                         <button className="action-button">Edit</button>
//                         <button className="action-button">Delete</button>
//                       </td>
//                     </tr>
//                   );
//                 })
//               ) : (
//                 <tr>
//                   <td colSpan="5" className="text-center p-2">
//                     No Philhealth Staff found
//                   </td>
//                 </tr>
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Philhealth;
