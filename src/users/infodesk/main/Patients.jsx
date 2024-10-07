import { useState, useEffect } from "react";
import { IoMdAdd } from "react-icons/io";
import PatientDetailsModal from "../../modals/PatientDetails";
import CreatePatient from "../../modals/CreatePatient";
import DischargePatient from "../../modals/DischargePatient";
import ClinicalSummary from "../../modals/ClinicalSummary";
import { useUserContext } from "../../context/UserContext";
import { useMedicalRecordsContext } from "../../context/MedicalRecordsContext";
import { getDatabase, ref, onValue } from "firebase/database";

const Patients = () => {
  const { user } = useUserContext();
  const { medicalRecords, setMedicalRecords } = useMedicalRecordsContext();
  console.log(medicalRecords, setMedicalRecords);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showCreatePatientModal, setShowCreatePatientModal] = useState(false);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
  const [showSummaryModal, setShowSummaryModal] = useState(false);
  const [showDischargePatientModal, setShowDischargePatientModal] =
    useState(false);
  const [patientToDischarge, setPatientToDischarge] = useState(null);
  const [doctorNames, setDoctorNames] = useState({});

  const fetchMedicalRecords = () => {
    const db = getDatabase();
    const patientsRef = ref(db, "patients");

    onValue(patientsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const patientsList = Object.keys(data).map((key) => ({
          id: key,
          ...data[key],
        }));
        setMedicalRecords(patientsList);
      }
    });
  };

  useEffect(() => {
    fetchMedicalRecords();
    fetchDoctors();
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
        setDoctorNames(doctorMap);
      }
    });
  };

  const handleDischargePatient = (patient, recordId) => {
    setPatientToDischarge({ patient, recordId });
    setShowDischargePatientModal(true);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPatients = medicalRecords
  .filter((record) =>
    Object.values(record.medicalRecords || {}).some(
      (mr) =>
        mr.healthcareProvider?.hospital_id === user.hospital_id &&
        mr.healthcareProvider?.branch_id === user.branch_id
    )
  )
  .filter((patient) => {
    const patientName = patient.generalData?.name?.toLowerCase() || "";
    const philhealthNumber = patient.generalData?.philhealthNumber || "";

    const medicalRecord = Object.values(patient.medicalRecords || {})[0] || {};

    const doctorName = doctorNames[medicalRecord.healthcareProvider?.assignedDoctor]?.toLowerCase() || "unknown doctor";
    const date = medicalRecord?.date?.toLowerCase() || "";
    const status = medicalRecord?.status?.toLowerCase() || "";

    const searchLower = searchTerm.toLowerCase();

    return (
      patientName.includes(searchLower) ||
      philhealthNumber.includes(searchLower) ||
      date.includes(searchLower) ||
      doctorName.includes(searchLower) ||
      status.includes(searchLower)
    );
  });

  const handleViewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetailsModal(true);
  };

  const handleClinicalSummary = (patient, recordId) => {
    setSelectedPatient({ patient, recordId });
    setShowSummaryModal(true);
  };

  // const isEditableRecord = (record) => {
  //   if (!record.medicalRecords) return false;
  //   return Object.values(record.medicalRecords).some(
  //     (mr) =>
  //       mr.healthcareProvider?.hospital_id === user.hospital_id &&
  //       mr.healthcareProvider?.branch_id === user.branch_id &&
  //       mr.status === "Active"
  //   );
  // };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-semibold p-1">Patient Search</h2>
        <button
          onClick={() => setShowCreatePatientModal(true)}
          className="main-button"
        >
          <IoMdAdd size={20} /> <span className="ml-1">Add Patient</span>
        </button>
      </div>

      <input
        type="text"
        placeholder="Search Patients"
        value={searchTerm}
        onChange={handleSearchChange}
        className="border border-gray-300 rounded-md p-2 w-[30%] mb-4"
      />

      <div className="overflow-x-auto">
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
                const patientId = patient.id;
                const medicalRecord = Object.values(
                  patient.medicalRecords || {}
                )[0];
                const recordId = medicalRecord?.id;
                const assignedDoctor =
                  medicalRecord?.healthcareProvider?.assignedDoctor;
                const doctorName =
                  doctorNames[assignedDoctor] || "To be assigned";
                // const isEditable = isEditableRecord(patient);

                return (
                  <tr key={patientId} className="border-b">
                    <td>{patient.generalData?.philhealthNumber || "N/A"}</td>
                    <td className="p-2">
                      {patient.generalData?.name || "N/A"}
                    </td>
                    <td className="p-2">{medicalRecord?.date || "N/A"}</td>
                    <td className="p-2">{doctorName || "To be assigned"}</td>
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
                        className={`action-button ${
                          doctorName === "To be assigned"
                            ? "opacity-50 cursor-not-allowed transition-none hover:bg-white hover:text-primary_maroon"
                            : ""
                        }`}
                        disabled={doctorName === "To be assigned"}
                      >
                        View
                      </button>
                      <button
                        onClick={() =>
                          handleDischargePatient(patient, recordId)
                        }
                        className={`action-button ${
                          doctorName === "To be assigned" || medicalRecord?.status === "Discharged"
                            ? "opacity-50 cursor-not-allowed transition-none hover:bg-white hover:text-primary_maroon"
                            : ""
                        }`}
                        disabled={doctorName === "To be assigned"}
                        // disabled={!isEditable}
                      >
                        Discharge
                      </button>
                      <button
                        className={`action-button ${
                          doctorName === "To be assigned" || medicalRecord?.status === "Discharged"
                            ? "opacity-50 cursor-not-allowed transition-none hover:bg-white hover:text-primary_maroon"
                            : ""
                        }`}
                        disabled={doctorName === "To be assigned"}
                        onClick={() => handleClinicalSummary(patient, recordId)}
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

      {showSummaryModal && (
        <ClinicalSummary
          patient={selectedPatient.patient}
          recordId={selectedPatient.recordId}
          onConfirm={(patientId, recordId) => {
            handleClinicalSummary(patientId, recordId);
            setShowSummaryModal(false);
          }}
          onClose={() => setShowSummaryModal(false)}
        />
      )}

      {showDischargePatientModal && (
        <DischargePatient
          patient={patientToDischarge.patient}
          recordId={patientToDischarge.recordId}
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
