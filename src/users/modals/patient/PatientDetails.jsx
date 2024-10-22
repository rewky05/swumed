import PatientMedicalRecords from "./PatientMedicalRecords";

const PatientDetails = ({ patient, onClose }) => {
  const { generalData, account, medicalRecords } = patient || {};

  return (
    <div className="fixed inset-0 top-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[40rem] h-[36rem] overflow-y-auto px-6 py-4 pt-6">
        <h2 className="text-2xl font-bold text-primary_maroon">
          {generalData?.firstName + " " + generalData?.lastName || "Unknown"}
        </h2>

        <div className="overflow-y-auto p-2">
          <div className="flex items-center">
            <div className="w-full mr-12">
              <p className="mb-2">
                <strong>Email:</strong> {account?.email || "N/A"}
              </p>
              <p className="mb-2">
                <strong>Age:</strong> {generalData?.age || "N/A"}
              </p>
              <p className="mb-2">
                <strong>Contact:</strong> {generalData?.contactNumber || "N/A"}
              </p>
            </div>
            <div className="flex justify-center items-center w-full">
              <img
                src={generalData?.imageUrl || "https://via.placeholder.com/150"}
                alt="Patient"
                className="m-4 w-36 h-36 rounded-full object-cover"
              />
            </div>
          </div>

          <h3 className="text-xl font-semibold mb-2">Medical Records</h3>
          <PatientMedicalRecords medicalRecords={medicalRecords} />
        </div>

        <div className="flex justify-end mt-4">
          <button
            onClick={onClose}
            className="main-button"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientDetails;
