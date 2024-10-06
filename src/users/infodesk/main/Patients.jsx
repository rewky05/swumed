import { useState, useEffect } from "react";
import { getDatabase, ref, onValue } from "firebase/database";
import { IoMdAdd } from "react-icons/io";
import PatientDetails from "../../modals/PatientDetails";
import CreatePatient from "../../modals/CreatePatient";
import DischargePatient from "../../modals/DischargePatient";

import { useUserContext } from "../../context/UserContext";
import { usePatientContext } from "../../context/PatientContext";
import { useProviderContext } from "../../context/ProviderContext";

const Patients = () => {
  const { user } = useUserContext(); 
  const { selectedPatient, setSelectedPatient } = usePatientContext(); 
  const { branchId } = useProviderContext(); 

  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [doctors, setDoctors] = useState({});
  const [branchDoctors, setBranchDoctors] = useState([]);
  const [isDataReady, setIsDataReady] = useState(false);
  const [showPatientDetails, setShowPatientDetails] = useState(false);
  const [showCreatePatientModal, setShowCreatePatientModal] = useState(false);
  const [showDischargeModal, setShowDischargeModal] = useState(false);

  useEffect(() => {
    if (!user) {
      console.log("User data not available yet");
      return;
    }

    const db = getDatabase();
    const { branch_id, hospital_id } = user;

    const patientsRef = ref(db, "patients");
    const doctorsRef = ref(db, `hospitals/${hospital_id}/branch/${branch_id}/doctors`);
    const doctorsReference = ref(db, "doctors");

    const fetchDoctors = onValue(doctorsRef, (doctorsSnapshot) => {
      if (doctorsSnapshot.exists()) {
        const branchDoctorsData = doctorsSnapshot.val();
        const branchDoctorKeys = Object.keys(branchDoctorsData);
        setBranchDoctors(branchDoctorKeys);

        onValue(doctorsReference, (globalDoctorsSnapshot) => {
          if (globalDoctorsSnapshot.exists()) {
            const globalDoctorsData = globalDoctorsSnapshot.val();
            setDoctors(globalDoctorsData);

            onValue(patientsRef, (snapshot) => {
              if (snapshot.exists()) {
                const patientsData = snapshot.val();

                const filteredPatients = Object.keys(patientsData)
                  .filter((key) => {
                    const patient = patientsData[key];
                    const latestMedicalRecord =
                      Object.values(patient.medicalRecords || {}).sort(
                        (a, b) => new Date(b.date) - new Date(a.date)
                      )[0] || {};

                    return branchDoctorKeys.includes(
                      latestMedicalRecord?.healthcareProvider?.assignedDoctor
                    );
                  })
                  .map((key) => {
                    const patient = patientsData[key];
                    const latestMedicalRecord =
                      Object.values(patient.medicalRecords || {}).sort(
                        (a, b) => new Date(b.date) - new Date(a.date)
                      )[0] || {};

                    const assignedDoctorUid =
                      latestMedicalRecord.healthcareProvider?.assignedDoctor;

                    const assignedDoctorName = assignedDoctorUid
                      ? globalDoctorsData[assignedDoctorUid]?.name
                      : "N/A";

                    return {
                      patientId: key,
                      philhealthNumber:
                        patient.generalData?.philhealthNumber || "N/A",
                      name: patient.generalData?.name || "Unknown",
                      lastUpdated: latestMedicalRecord.date || "N/A",
                      doctor: assignedDoctorName || "N/A",
                      status: latestMedicalRecord?.status || "Inactive",
                      details: patient,
                    };
                  });

                setPatients(filteredPatients);
                setIsDataReady(true);
              } else {
                setPatients([]);
              }
            });
          }
        });
      }
    });

    return () => fetchDoctors();
  }, [user]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleViewPatient = (patient) => {
    setSelectedPatient(patient);
    setShowPatientDetails(true);
  };

  const handleDischargePatient = (patient) => {
    console.log("Selected Patient:", patient);  
    setSelectedPatient(patient);
    setShowDischargeModal(true);
  };

  const handleAddPatient = () => {
    setShowCreatePatientModal(true);
  };

  const handleConfirmDischarge = (recordId) => {
    console.log("Discharging record:", recordId);
    setShowDischargeModal(false);
  };

  const filteredPatients = patients.filter(
    (patient) =>
      patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.philhealthNumber.toString().includes(searchTerm)
  );

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-semibold p-1">Patient List</h2>
        <button
          className="bg-primary_maroon rounded-md text-white py-2 px-2 flex items-center"
          onClick={handleAddPatient}
        >
          <IoMdAdd size={20} />
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
              filteredPatients.map((patient) => (
                <tr key={patient.philhealthNumber} className="border-b">
                  <td className="p-2">{patient.philhealthNumber}</td>
                  <td className="p-2">{patient.name}</td>
                  <td className="p-2">{patient.lastUpdated}</td>
                  <td className="p-2">{patient.doctor}</td>
                  <td className="p-2">
                    <span
                      className={`${
                        patient.status === "Active"
                          ? "text-green-500"
                          : "text-red-500"
                      } font-semibold`}
                    >
                      {patient.status}
                    </span>
                  </td>
                  <td className="p-2 flex justify-center gap-2">
                    <button
                      className="border border-primary_maroon text-primary_maroon px-2 py-1 rounded hover:bg-red-100 transition-all"
                      onClick={() => handleViewPatient(patient.details)}
                    >
                      View
                    </button>
                    <button
                      className="border border-primary_maroon text-primary_maroon px-2 py-1 rounded hover:bg-red-100 transition-all"
                    >
                      + Summary
                    </button>
                    <button
                      className="border border-primary_maroon text-primary_maroon px-2 py-1 rounded hover:bg-red-100 transition-all"
                      onClick={() => handleDischargePatient(patient.details)}
                    >
                      Discharge
                    </button>
                  </td>
                </tr>
              ))
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

      {/* Patient Details Modal */}
      {showPatientDetails && selectedPatient && (
        <PatientDetails
          patient={selectedPatient}
          onClose={() => setShowPatientDetails(false)}
        />
      )}

      {/* Discharge Patient Modal */}
      {showDischargeModal && selectedPatient && (
        <DischargePatient
          patientId={selectedPatient.patientId} 
          patientName={selectedPatient.generalData.name}
          medicalRecords={selectedPatient.medicalRecords}
          onConfirm={handleConfirmDischarge}
          onClose={() => setShowDischargeModal(false)}
        />
      )}

      {/* Create Patient Modal */}
      {showCreatePatientModal && (
        <CreatePatient onClose={() => setShowCreatePatientModal(false)} />
      )}
    </div>
  );
};

export default Patients;
