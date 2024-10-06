import { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import PatientDetailsModal from "../../modals/PatientDetails";
import CreatePatient from "../../modals/CreatePatient";
import DischargePatient from "../../modals/DischargePatient";
import { useUserContext } from "../../context/UserContext";
import { useMedicalRecordsContext } from "../../context/MedicalRecordsContext";
import { useProviderContext } from "../../context/ProviderContext";
import { getDatabase, ref, onValue, update } from "firebase/database";

const Patients = () => {
  const { user } = useUserContext();
  const { medicalRecords, setMedicalRecords } = useMedicalRecordsContext(); // Ensure setMedicalRecords is used from context
  const { branchDoctors, setBranchDoctors } = useProviderContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showCreatePatientModal, setShowCreatePatientModal] = useState(false);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const [showDischargePatientModal, setShowDischargePatientModal] =
    useState(false);
  const [patientToDischarge, setPatientToDischarge] = useState(null);
  const [doctorNames, setDoctorNames] = useState({});

  // Moved fetchMedicalRecords function outside of useEffect
  const fetchMedicalRecords = () => {
    const db = getDatabase();
    const patientsRef = ref(db, "patients"); // Correct Firebase path

    onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const patientsList = Object.keys(data).map((key) => ({
          id: key, // Patient UID
          ...data[key],
        }));
        setMedicalRecords(patientsList); // Update medical records in state
      }
    });
  };

  useEffect(() => {
    fetchMedicalRecords(); // Call on component mount
    fetchDoctors(); // Fetch doctors once on mount
  }, []);

  const fetchDoctors = () => {
    const db = getDatabase();
    const doctorsRef = ref(db, "doctors");

    onValue(doctorsRef, (snapshot) => {
      const doctorsData = snapshot.val();
      if (doctorsData) {
        const doctorMap = {};
        Object.keys(doctorsData).forEach((key) => {
          doctorMap[key] = doctorsData[key].name;
        });
        setDoctorNames(doctorMap); // Update doctor names in state
      }
    });
  };

  // const handleDischargePatient = (patient) => {
  //   setPatientToDischarge(patient);
  //   setShowDischargePatientModal(true);
  // };

  // const handleDischargePatient = (patient, recordId) => {
  //   setPatientToDischarge({ patient, recordId });
  //   setShowDischargePatientModal(true);
  // };

  // const handleDischargePatient = (patientId, recordId) => {
  //   const db = getDatabase();
  //   const recordRef = ref(db, `patients/${patientId}/medicalRecords/${recordId}`);

  //   // Update the medical record's status to 'Discharged' or any relevant status
  //   update(recordRef, {
  //     status: 'Discharged',
  //   }).then(() => {
  //     console.log(`Patient ${patientId} with record ${recordId} discharged.`);
  //     // Optionally: Fetch records again to update the UI
  //     fetchMedicalRecords();
  //   }).catch((error) => {
  //     console.error('Discharge failed:', error);
  //   });
  // };

  const handleDischargePatient = (patient, recordId) => {
    setPatientToDischarge({ patient, recordId });
    setShowDischargePatientModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Filter patients based on hospital, branch, and status
  const filteredPatients = medicalRecords.filter((record) =>
    Object.values(record.medicalRecords || {}).some(
      (mr) =>
        mr.healthcareProvider?.hospital_id === user.hospital_id &&
        mr.healthcareProvider?.branch_id === user.branch_id &&
        mr.status === "Active" // Ensure active status filtering
    )
  );

  const handleViewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetailsModal(true);
  };

  // Check if the patient has editable medical records
  // const isEditableRecord = (record) => {
  //   return Object.values(record.medicalRecords || {}).some(
  //     (mr) =>
  //       mr.healthcareProvider?.hospital_id === user.hospital_id &&
  //       mr.healthcareProvider?.branch_id === user.branch_id &&
  //       mr.status === "Active"
  //   );
  // };

  const isEditableRecord = (record) => {
    if (!record.medicalRecords) return false; // Prevent errors if medicalRecords is undefined
    return Object.values(record.medicalRecords).some(
      (mr) =>
        mr.healthcareProvider?.hospital_id === user.hospital_id &&
        mr.healthcareProvider?.branch_id === user.branch_id &&
        mr.status === "Active"
    );
  };  

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-semibold p-1">Patient Search</h2>
        <button
          onClick={() => setShowCreatePatientModal(true)}
          className="bg-primary_maroon rounded-md text-white py-2 px-5 flex items-center"
        >
          <IoMdAdd size={20} /> <span className="ml-1">Add Patient</span>
        </button>
        <Link to="/patients">
          <button className="bg-primary_maroon rounded-md text-white py-2 px-7 flex items-center">
            <FaEye size={20} /> <span className="ml-1">View All</span>
          </button>
        </Link>
      </div>

      <input
        type="text"
        placeholder="Search Patients"
        value={searchTerm}
        onChange={handleSearchChange}
        className="border border-gray-300 rounded-md p-2 w-[30%] mb-4"
      />

      <div className="overflow-x-auto overflow-y-scroll max-h-[250px]">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b">
              <th className="p-2">Philhealth #</th>
              <th className="p-2">Patient Name</th>
              <th className="p-2">Date</th>
              <th className="p-2">Doctor Assigned</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => {
                const patientId = patient.id; // Patient UID
                const medicalRecord = Object.values(
                  patient.medicalRecords || {}
                )[0];
                const recordId = medicalRecord?.id;
                const assignedDoctor =
                  medicalRecord?.healthcareProvider?.assignedDoctor;
                const doctorName =
                  doctorNames[assignedDoctor] || "Unknown Doctor";
                const isEditable = isEditableRecord(patient);

                return (
                  <tr key={patientId} className="border-b">
                    <td>{patient.generalData?.philhealthNumber || "N/A"}</td>
                    <td className="p-2">
                      {patient.generalData?.name || "N/A"}
                    </td>
                    <td className="p-2">{medicalRecord?.date || "N/A"}</td>
                    <td className="p-2">{doctorName || "Unknown Doctor"}</td>
                    <td className="p-2">
                      <span
                        className={`${
                          medicalRecord?.status === "Active"
                            ? "text-green-500"
                            : "text-red-500"
                        } font-semibold`}
                      >
                        {medicalRecord?.status || "N/A"}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleViewPatientDetails(patient)}
                        className="text-blue-500 hover:underline"
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          handleDischargePatient(patient, recordId)
                        }
                        className="text-red-500 hover:underline ml-2"
                        disabled={!isEditable}
                      >
                        Discharge
                      </button>
                      <button
                        className="text-green-500 hover:underline ml-2"
                        onClick={() => {
                          // handleAddSummary(patient);
                        }}
                      >
                        +Summary
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-4">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showCreatePatientModal && (
        <CreatePatient onClose={() => setShowCreatePatientModal(false)} />
      )}

      {showPatientDetailsModal && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setShowPatientDetailsModal(false)}
        />
      )}

      {/* {showDischargePatientModal && (
        <DischargePatient
          patient={patientToDischarge}
          onConfirm={(patientId, recordId) => {
            handleDischargePatient(patientId, recordId);
            setShowDischargePatientModal(false);
          }}
          onClose={() => setShowDischargePatientModal(false)}
        />
      )} */}

      {showDischargePatientModal && (
        <DischargePatient
          patient={patientToDischarge.patient}
          recordId={patientToDischarge.recordId} // Pass the specific recordId
          onConfirm={(patientId, recordId) => {
            handleDischargePatient(patientId, recordId);
            setShowDischargePatientModal(false);
          }}
          onClose={() => setShowDischargePatientModal(false)}
        />
      )}
    </div>
  );
};

export default Patients;
