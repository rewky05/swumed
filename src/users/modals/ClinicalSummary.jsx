// import { useEffect, useState } from "react";
// import { getDatabase, ref, onValue, update } from "firebase/database";
// import { useUserContext } from "../context/UserContext";

// import { TiArrowSortedDown } from "react-icons/ti";

// const ClinicalSummary = ({ patient, recordId, onConfirm, onClose }) => {
//   const { user } = useUserContext();
//   const [medicalRecords, setMedicalRecords] = useState([]);
//   const [selectedRecordId, setSelectedRecordId] = useState(null);
//   const [clinicalSummary, setClinicalSummary] = useState("");
//   const [error, setError] = useState("");

//   console.log(user);

//   const handleRecordChange = (e) => {
//     setSelectedRecordId(e.target.value);
//     if (error) setError("");
//   }

//   const handleSummaryChange = (e) => {
//     setClinicalSummary(e.target.value);
//     if (error) setError("");
//   };

//   useEffect(() => {
//     if (patient) {
//       const db = getDatabase();
//       const medicalRecordsRef = ref(
//         db,
//         `patients/${patient.id}/medicalRecords`
//       );

//       onValue(medicalRecordsRef, (snapshot) => {
//         const data = snapshot.val();
//         console.log(data);
//         if (data) {
//           const recordsList = Object.keys(data).map((key) => ({
//             id: key,
//             ...data[key],
//           }));

//           const filteredRecords = recordsList.filter((record) => {
//             const hasClinicalSummary = record.details.clinicalSummary;
//             const status = record.status;
//             const final = status.toLowerCase();
//             if (user.hospital_id) {
//               return (
//                 record.healthcareProvider.hospital_id === user.hospital_id &&
//                 record.healthcareProvider.branch_id === user.branch_id &&
//                 final === "to be discharged" &&
//                 !hasClinicalSummary
//               );
//             }
//             if (user.clinic_id) {
//               return (
//                 record.healthcareProvider.clinic_id === user.clinic_id &&
//                 record.healthcareProvider.branch_id === user.branch_id &&
//                 final === "to be discharged" &&
//                 !hasClinicalSummary
//               );
//             }
//             return false;
//           });

//           setMedicalRecords(filteredRecords);
//           console.log(filteredRecords);
//         }
//       });
//     }
//   }, [patient, user]);

//   const handleAddClinicalSummary = async (patientId, recordId) => {
//     const medicalRecord = medicalRecords.find(
//       (record) => record.id === selectedRecordId
//     );

//     setError("")

//     // const providerId =
//     //   medicalRecord.healthcareProvider.hospital_id ||
//     //   medicalRecord.healthcareProvider.clinic_id;

//     if (!medicalRecord) {
//       setError("Please select a medical record first.");
//       return;
//     } else if (!patient || !recordId || !patientId) {
//       console.error("Patient or recordId is missing.");
//       return;
//     } else if (
//       clinicalSummary === null ||
//       clinicalSummary === undefined ||
//       clinicalSummary === "undefined" ||
//       clinicalSummary === ""
//     ) {
//       setError(
//         `Please input the clinical summary for ${recordId}.`
//       );
//       return;
//     }

//     const db = getDatabase();

//     const recordPath = `patients/${patientId}/medicalRecords/${recordId}/details/clinicalSummary`;
//     console.log(recordId);
//     const updates = {};
//     updates[recordPath] = {
//       summary: clinicalSummary,
//       date: new Date().toLocaleDateString(),
//       addedBy: user.firstName + " " + user.lastName,
//       addedByUID: user.uid,
//     };

//     try {
//       await update(ref(db), updates);
//       onConfirm(patient.id, selectedRecordId);
//       console.log("Added clinical summary successfully");
//     } catch (error) {
//       setError("Error adding clinical summary", error);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//       <div className="bg-white rounded-md shadow-lg p-6 w-[600px]">
//         <h2 className="text-lg font-semibold mb-4">Add Clinical Summary</h2>

//         {error && <p className="text-red-500 mb-4">{error}</p>}

//         <h3 className="font-semibold mb-1">Select Medical Record:</h3>
//         <div className="relative flex justify-end mb-4">
//           <select
//             className="border rounded-md p-2 cursor-pointer select-none w-full outline-none"
//             onChange={handleRecordChange}
//             value={selectedRecordId || ""}
//           >
//             <option value="" disabled>
//               Select a medical record
//             </option>
//             {medicalRecords.map((record) => (
//               <option key={record.id} value={record.id}>
//                 {record.id} - Status: {record.status}
//               </option>
//             ))}
//           </select>
//           <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
//             <TiArrowSortedDown size={20} className="text-primary_maroon" />
//           </span>
//         </div>
//         {/* <div className="relative justify-end"></div> */}
//         <p className="p-[6px]">
//           Patient Name:{" "}
//           {patient.generalData?.firstName + " " + patient.generalData?.lastName}
//         </p>
//         <p className="p-[6px]">
//           Philhealth Number: {patient.generalData?.philhealthNumber}
//         </p>
//         <p className="p-[6px]">Date of Birth: {patient.generalData?.birthdate}</p>
//         <p className="p-[6px]">
//           Chief Complaint:{" "}
//           {patient.medicalRecords?.[selectedRecordId]?.details?.chiefComplaint}
//         </p>
//         <p className="p-[6px]">
//           History of Present Illness:{" "}
//           {
//             patient.medicalRecords?.[selectedRecordId]?.details
//               ?.presentIllnessHistory
//           }
//         </p>

//         <div className="p-[6px]">
//           <label className="block font-semibold mb-1">
//             Clinical Summary:
//           </label>
//           <textarea
//             className="w-full border border-gray-300 rounded-md p-2"
//             rows="4"
//             value={clinicalSummary}
//             onChange={handleSummaryChange}
//           ></textarea>
//         </div>

//         <div className="flex justify-end">
//           <button onClick={onClose} className="cancel-button">
//             Cancel
//           </button>
//           <button
//             onClick={() => {
//               handleAddClinicalSummary(patient.id, selectedRecordId);
//             }}
//             className="main-button"
//           >
//             Add
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClinicalSummary;
