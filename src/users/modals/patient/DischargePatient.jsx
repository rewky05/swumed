import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { useUserContext } from "../../context/UserContext";

const DischargePatient = ({ patient, recordId, onConfirm, onClose }) => {
  const { user } = useUserContext();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState(null);

  useEffect(() => {
    if (patient) {
      const db = getDatabase();
      const medicalRecordsRef = ref(
        db,
        `patients/${patient.id}/medicalRecords`
      );

      onValue(medicalRecordsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const recordsList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          const filteredRecords = recordsList.filter((record) => {
            if (user.hospital_id) {
              return (
                record.healthcareProvider.hospital_id === user.hospital_id &&
                record.healthcareProvider.branch_id === user.branch_id &&
                record.status === "Active"
              );
            }
            if (user.clinic_id) {
              return (
                record.healthcareProvider.clinic_id === user.clinic_id &&
                record.healthcareProvider.branch_id === user.branch_id &&
                record.status === "Active"
              );
            }
            return false;
          });

          setMedicalRecords(filteredRecords);
          console.log(filteredRecords);
        }
      });
    }
  }, [patient, user]);

  const handleDischarge = async (patientId, recordId) => {
    const medicalRecord = medicalRecords.find(
      (record) => record.id === selectedRecordId
    );

    if (!medicalRecord) {
      console.error("Medical record not found.");
      return;
    }

    const providerId =
      medicalRecord.healthcareProvider.hospital_id ||
      medicalRecord.healthcareProvider.clinic_id;

    if (!providerId) {
      console.error(
        "Provider ID (either hospital_id or clinic_id) is missing for the medical record."
      );
      return;
    }

    if (!patient || !recordId || !patientId) {
      console.error("Patient or recordId is missing.");
      return null;
    }

    const db = getDatabase();

    const recordPath = `patients/${patientId}/medicalRecords/${recordId}/status`;

    const updates = {};
    updates[recordPath] = "Discharged";

    try {
      await update(ref(db), updates);
      console.log("Medical record successfully updated to Discharged");
    } catch (error) {
      console.error("Error discharging patient:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Discharge Patient</h2>

        <p className="mb-2">Patient Name: {patient.generalData?.name}</p>
        <p className="mb-4">
          Philhealth Number: {patient.generalData?.philhealthNumber}
        </p>

        <h3 className="font-semibold mb-2">Select Medical Record:</h3>
        <select
          className="border border-gray-300 rounded-md p-2 w-full mb-4"
          onChange={(e) => setSelectedRecordId(e.target.value)}
          value={selectedRecordId || ""}
        >
          <option value="" disabled>
            Select a medical record
          </option>
          {medicalRecords.map((record) => (
            <option key={record.id} value={record.id}>
              {record.id} - Status: {record.status}
            </option>
          ))}
        </select>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 rounded-md py-2 px-4 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleDischarge(patient.id, selectedRecordId);
              onConfirm(patient.id, selectedRecordId);
            }}
            className="bg-red-500 text-white py-2 px-4 rounded"
          >
            Confirm Discharge
          </button>
        </div>
      </div>
    </div>
  );
};

export default DischargePatient;
