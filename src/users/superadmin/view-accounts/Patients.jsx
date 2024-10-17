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

  const fetchHospitalAndBranchNames = async (hospitalId, clinicId, branchId) => {
    try {
      const db = getDatabase();
      
      let facilityRef, branchRef;
      
      if (hospitalId) {
        // Set references for hospitals
        facilityRef = ref(db, `hospitals/${hospitalId}/name`);
        branchRef = ref(db, `hospitals/${hospitalId}/branch/${branchId}/name`);
      } else if (clinicId) {
        // Set references for clinics
        facilityRef = ref(db, `clinics/${clinicId}/name`);
        branchRef = ref(db, `clinics/${clinicId}/branch/${branchId}/name`);
      } else {
        // No hospital or clinic ID provided
        return { hospitalName: "Unknown Facility", branchName: "Unknown Branch" };
      }
      
      // Fetch facility (hospital/clinic) name
      const facilityName = await new Promise((resolve) => {
        onValue(facilityRef, (snapshot) => {
          resolve(snapshot.val() || "Unknown Facility");
        });
      });
      
      // Fetch branch name
      const branchName = await new Promise((resolve) => {
        onValue(branchRef, (snapshot) => {
          resolve(snapshot.val() || "Unknown Branch");
        });
      });
  
      return { hospitalName: facilityName, branchName };
      
    } catch (error) {
      console.error("Error fetching facility and branch names:", error);
      return { hospitalName: "Error", branchName: "Error" };
    }
  };  

  const fetchMedicalRecords = () => {
    const db = getDatabase();
    const patientsRef = ref(db, "patients");
  
    onValue(patientsRef, async (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const patientsList = await Promise.all(
          Object.keys(data)
            .filter((key) => data[key])
            .map(async (key) => {
              // Assume the first medical record is used here
              const medicalRecord = Object.values(data[key].medicalRecords || {})[0];
              const { hospital_id, clinic_id, branch_id } = medicalRecord?.healthcareProvider || {};
  
              // Fetch facility and branch names
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
          doctorMap[key] =
            doctorsData[key].firstName + " " + doctorsData[key].lastName;
        });
        setDoctorNames(doctorMap);
      }
    });
  };

  const filteredPatients = medicalRecords.filter((patient) => {
    const patientFirstName =
      patient.generalData?.firstName?.toLowerCase() || "";
    const patientLastName = patient.generalData?.lastName?.toLowerCase() || "";
    const philhealthNumber = patient.generalData?.philhealthNumber || "";
    const branchName = patient.branchName?.toLowerCase() || "";
    const facilityName = patient.hospitalName?.toLowerCase() || "";

    const medicalRecord = Object.values(patient.medicalRecords || {})[0] || {};

    const doctorName =
      doctorNames[
        medicalRecord.healthcareProvider?.assignedDoctor
      ]?.toLowerCase() || "unknown doctor";
    const dateAdmitted = medicalRecord?.dateAdmitted?.toLowerCase() || "";
    const dateDischarged = medicalRecord?.dateDischarged?.toLowerCase() || "";
    const status = medicalRecord?.status?.toLowerCase() || "";

    const searchLower = searchTerm.toLowerCase();

    return (
      patientFirstName.includes(searchLower) ||
      patientLastName.includes(searchLower) ||
      philhealthNumber.includes(searchLower) ||
      dateAdmitted.includes(searchLower) ||
      dateDischarged.includes(searchLower) ||
      doctorName.includes(searchLower) ||
      status.includes(searchLower) ||
      branchName.includes(searchLower) ||
      facilityName.includes(searchLower)
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
              <th className="p-4">Date Admitted</th>
              <th className="p-4">Date Discharged</th>
              <th className="p-4">Facility</th>
              <th className="p-4">Branch</th>
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
                    <td className="p-3 pl-4">
                      {patient.generalData?.philhealthNumber || "N/A"}
                    </td>
                    <td className="p-3">
                      {patient.generalData?.firstName +
                        " " +
                        patient.generalData?.lastName || "N/A"}
                    </td>
                    <td className="p-3">
                      {medicalRecord?.dateAdmitted || "N/A"}
                    </td>
                    <td className="p-3">
                      {medicalRecord?.dateDischarged || "N/A"}
                    </td>
                    <td className="p-3">
                      {patient?.hospitalName || "N/A"}
                    </td>
                    <td className="p-3">
                      {patient?.branchName || "N/A"}
                    </td>
                    <td className="p-3">{doctorName || "To be assigned"}</td>
                    <td className="p-3">
                      <span
                        className={`font-semibold ${
                          medicalRecord?.status.toLowerCase() === "admitted" &&
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
