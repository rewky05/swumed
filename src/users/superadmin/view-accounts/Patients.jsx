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
          doctorMap[key] = doctorsData[key].firstName + " " + doctorsData[key].lastName;
        });
        setDoctorNames(doctorMap);
      }
    });
  };

  const filteredPatients = medicalRecords
    .filter((patient) => {
      const patientFirstName = patient.generalData?.firstName?.toLowerCase() || "";
      const patientLastName = patient.generalData?.lastName?.toLowerCase() || "";
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
        patientFirstName.includes(searchLower) ||
        patientLastName.includes(searchLower) ||
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
        <h2 className="text-xl font-semibold p-1">Patients</h2>
      </div>

      <input
        type="text"
        placeholder="Search Patients"
        value={searchTerm}
        onChange={handleSearchChange}
        className="border border-gray-300 rounded-md p-2 w-[32.9%] mb-4 text-sm"
      />

      <div className="overflow-x-auto overflow-y-auto border rounded-xl overflow-hidden">
        <table className="w-full text-left text-[#171A1F] text-sm">
          <thead>
            <tr className="border-b bg-[#FAFAFB] text-[#565E6C] font-medium p-4">
              <th className="p-4">Philhealth #</th>
              <th className="p-4">Patient Name</th>
              <th className="p-4">Date</th>
              <th className="p-4">Doctor Assigned</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
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
                  <tr key={patientId} className="">
                    <td className="p-3 pl-4">{patient.generalData?.philhealthNumber || "N/A"}</td>
                    <td className="p-3">
                      {patient.generalData?.firstName + " " + patient.generalData?.lastName || "N/A"}
                    </td>
                    <td className="p-3">{medicalRecord?.date || "N/A"}</td>
                    <td className="p-3">{doctorName || "To be assigned"}</td>
                    <td className="p-3">
                    <span
                        className={`font-semibold ${
                          medicalRecord?.status.toLowerCase() === "active" &&
                          "text-green-500"
                        } ${
                          medicalRecord?.status.toLowerCase() ===
                            "to be discharged" && "text-yellow-500"
                        } ${
                          medicalRecord?.status.toLowerCase() ===
                            "discharged" && "text-red-500"
                        } `}
                      >
                        {medicalRecord?.status || "N/A"}
                      </span>
                    </td>
                    <td className="p-3 text-center flex justify-center items-center">
                      <button
                        onClick={() => handleViewPatientDetails(patient)}
                        className="action-button"
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
