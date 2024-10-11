import { useEffect, useState } from "react";
import { getDatabase, ref, onValue, update } from "firebase/database";
import { useUserContext } from "../context/UserContext";

const ClinicalSummary = ({ patient, recordId, onConfirm, onClose }) => {
  const { user } = useUserContext();
  const [medicalRecords, setMedicalRecords] = useState([]);
  const [selectedRecordId, setSelectedRecordId] = useState(null);
  const [clinicalSummary, setClinicalSummary] = useState("");


  console.log(user)
  const handleSummaryChange = (e) => {
    setClinicalSummary(e.target.value);
  };

  useEffect(() => {
    if (patient) {
      const db = getDatabase();
      const medicalRecordsRef = ref(
        db,
        `patients/${patient.id}/medicalRecords`
      );

      onValue(medicalRecordsRef, (snapshot) => {
        const data = snapshot.val();
        console.log(data)
        if (data) {
          const recordsList = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
          }));

          const filteredRecords = recordsList.filter((record) => {
            const hasClinicalSummary = record.details.clinicalSummary;
            const status = record.status
            const final = status.toLowerCase()
            if (user.hospital_id) {
              return (
                record.healthcareProvider.hospital_id === user.hospital_id &&
                record.healthcareProvider.branch_id === user.branch_id &&
                final === "to be discharged" && !hasClinicalSummary
              );
            }
            if (user.clinic_id) {
              return (
                record.healthcareProvider.clinic_id === user.clinic_id &&
                record.healthcareProvider.branch_id === user.branch_id &&
                final === "to be discharged" && !hasClinicalSummary
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

  const handleAddClinicalSummary = async (patientId, recordId) => {
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

    const recordPath = `patients/${patientId}/medicalRecords/${recordId}/details/clinicalSummary`;
    console.log(recordId);
    const updates = {};
    updates[recordPath] = {
      summary: clinicalSummary,
      date: new Date().toLocaleDateString(),
      addedBy: user.name,
    };

    try {
      await update(ref(db), updates);
      console.log("Added clinical summary successfully");
    } catch (error) {
      console.error("Error adding clinical summary", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-md shadow-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-semibold mb-4">Add Clinical Summary</h2>

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

        <p className="mb-2">Patient Name: {patient.generalData?.name}</p>
        <p className="mb-4">
          Philhealth Number: {patient.generalData?.philhealthNumber}
        </p>
        <p className="mb-2">Date of Birth: {patient.generalData?.birthdate}</p>
        <p className="mb-2">
          Chief Complaint:{" "}
          {patient.medicalRecords?.[selectedRecordId]?.details?.chiefComplaint}
        </p>
        <p className="mb-2">
          History of Present Illness:{" "}
          {
            patient.medicalRecords?.[selectedRecordId]?.details
              ?.presentIllnessHistory
          }
        </p>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">
            Clinical Summary:
          </label>
          <textarea
            className="w-full border border-gray-300 rounded-md p-2"
            rows="4"
            value={clinicalSummary}
            onChange={handleSummaryChange}
          ></textarea>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 rounded-md py-2 px-4 mr-2"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              handleAddClinicalSummary(patient.id, selectedRecordId);
              onConfirm(patient.id, selectedRecordId);
            }}
            className="bg-primary_maroon text-white py-2 px-4 rounded"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
};

export default ClinicalSummary;
