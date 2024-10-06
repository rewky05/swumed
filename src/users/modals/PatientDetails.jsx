// PatientDetails.jsx
import PatientMedicalRecords from "./PatientMedicalRecords";

const PatientDetails = ({ patient, onClose }) => {
  const { generalData, account, medicalRecords } = patient || {};

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-content bg-white rounded-lg shadow-lg w-96 h-auto overflow-y-auto p-6">
        <h2 className="modal-title text-2xl font-bold text-primary_maroon mb-4">
          {generalData?.name || "Unknown"}
        </h2>

        <div className="max-h-[70%] overflow-y-auto">
          <p className="mb-2"><strong>Email:</strong> {account?.email || "N/A"}</p>
          <p className="mb-2"><strong>Age:</strong> {generalData?.age || "N/A"}</p>
          <p className="mb-2"><strong>Contact:</strong> {generalData?.contactNumber || "N/A"}</p>

          <img
            src={generalData?.imageUrl || "https://via.placeholder.com/150"}
            alt="Patient"
            className="mb-4 w-36 h-36 rounded-full object-cover"
          />

          <h3 className="text-xl font-semibold mb-2">Medical Records</h3>
          <PatientMedicalRecords medicalRecords={medicalRecords} />
        </div>

        <button 
          onClick={onClose} 
          className="close-btn bg-primary_maroon text-white py-2 px-4 rounded hover:bg-highlight_pink transition duration-200"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PatientDetails;
