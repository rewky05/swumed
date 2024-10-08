import { useState, useEffect } from "react";
import PatientDetailsModal from "../../modals/patient/PatientDetails";
import { useUserContext } from "../../context/UserContext";
import { useMedicalRecordsContext } from "../../context/MedicalRecordsContext";
import { getDatabase, ref, onValue } from "firebase/database";

const Patients = () => {
  const { user } = useUserContext();
  const { medicalRecords, setMedicalRecords } = useMedicalRecordsContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [showPatientDetailsModal, setShowPatientDetailsModal] = useState(false);
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

  const filteredPatients = medicalRecords
    //   .filter((record) =>
    //     Object.values(record.medicalRecords || {}).some(
    //       (mr) =>
    //         mr.healthcareProvider?.hospital_id === user.hospital_id &&
    //         mr.healthcareProvider?.branch_id === user.branch_id
    //     )
    //   )
    .filter((patient) => {
      const patientName = patient.generalData?.name?.toLowerCase() || "";
      const philhealthNumber = patient.generalData?.philhealthNumber || "";

      const medicalRecord =
        Object.values(patient.medicalRecords || {})[0] || {};

      const doctorName =
        doctorNames[
          medicalRecord.healthcareProvider?.assignedDoctor
        ]?.toLowerCase() || "unknown doctor";
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

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewPatientDetails = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetailsModal(true);
  };

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-semibold p-1">Patients</h2>
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
                          medicalRecord?.status === "active"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {medicalRecord?.status || "N/A"}
                      </span>
                    </td>
                    <td className="p-2 text-center">
                      <button
                        onClick={() => handleViewPatientDetails(patient)}
                        className="text-blue-500 underline"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" className="text-center p-2">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showPatientDetailsModal && (
        <PatientDetailsModal
          patient={selectedPatient}
          onClose={() => setShowPatientDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default Patients;
