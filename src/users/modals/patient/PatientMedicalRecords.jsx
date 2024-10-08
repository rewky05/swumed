import { useState } from "react";

const PatientMedicalRecords = ({ medicalRecords }) => {
  const [openRecordId, setOpenRecordId] = useState(null);

  const toggleRecord = (recordId) => {
    if (openRecordId === recordId) {
      setOpenRecordId(null);
    } else {
      setOpenRecordId(recordId);
    }
  };

  return (
    <div className="medical-records-list">
      {Object.keys(medicalRecords).map((recordId) => {
        const record = medicalRecords[recordId];
        const isOpen = openRecordId === recordId;
        return (
          <div key={recordId} className="record-item border-b pb-2 mb-2">
            <div className="flex justify-between items-center">
              <p><strong>MR-ID:</strong> {recordId}</p>
              <button
                className="bg-primary_maroon text-white rounded-md py-1 px-4"
                onClick={() => toggleRecord(recordId)}
              >
                {isOpen ? "-" : "+"}
              </button>
            </div>
            {isOpen && (
              <div className="record-details mt-2 h-[200px] overflow-y-scroll">
                {record.status && <p><strong>Status:</strong> {record.status}</p>}
                {record.healthcareProvider?.assignedDoctor && <p><strong>Doctor:</strong> {record.healthcareProvider.assignedDoctor}</p>}
                {record.date && <p><strong>Date:</strong> {record.date}</p>}
                {record.details && (
                  <>
                    {record.details.chiefComplaint && <p><strong>Chief Complaint:</strong> {record.details.chiefComplaint}</p>}
                    {record.details.diagnosis && <p><strong>Diagnosis:</strong> {record.details.diagnosis}</p>}
                    {record.details.differentialDiagnosis && <p><strong>Differential Diagnosis:</strong> {record.details.differentialDiagnosis}</p>}
                    {record.details.followUp && <p><strong>Follow Up:</strong> {record.details.followUp}</p>}
                    {record.details.laboratoryTests && <p><strong>Laboratory Tests:</strong> {record.details.laboratoryTests}</p>}
                    {record.details.physicalExam && <p><strong>Physical Exam:</strong> {record.details.physicalExam}</p>}
                    {record.details.presentIllnessHistory && <p><strong>Present Illness History:</strong> {record.details.presentIllnessHistory}</p>}
                    {record.details.reviewOfSymptoms && <p><strong>Review of Symptoms:</strong> {record.details.reviewOfSymptoms}</p>}
                    {record.details.soap && (
                      <>
                        {record.details.soap.assessment && <p><strong>SOAP Assessment:</strong> {record.details.soap.assessment}</p>}
                        {record.details.soap.objective && <p><strong>SOAP Objective:</strong> {record.details.soap.objective}</p>}
                        {record.details.soap.plan && <p><strong>SOAP Plan:</strong> {record.details.soap.plan}</p>}
                        {record.details.soap.subjective && <p><strong>SOAP Subjective:</strong> {record.details.soap.subjective}</p>}
                      </>
                    )}
                    {record.details.treatmentPlan && <p><strong>Treatment Plan:</strong> {record.details.treatmentPlan}</p>}
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default PatientMedicalRecords;
