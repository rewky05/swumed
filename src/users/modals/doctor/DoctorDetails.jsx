import Loading from "../../Loading";

const DoctorDetails = ({ isOpen, doctor, onClose }) => {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 top-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-[40rem] overflow-y-auto px-6 py-4">
      <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-primary_maroon py-1">
            {doctor.firstName + " " + doctor.lastName}
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-4 p-4">
          <div className="">
            <img
              src={doctor.imageUrl}
              alt={doctor.firstName + " " + doctor.lastName}
              className="w-full h-[15rem] object-top object-cover rounded-lg"
            />
          </div>
          <div>
            <p>
              <strong>Email:</strong> {doctor.account.email}
            </p>
            <p>
              <strong>Consultation Days:</strong> {doctor.consultationDays}
            </p>
            <p>
              <strong>Specialty:</strong> {doctor.specialty}
            </p>
            {/* <p>
              <strong>Healthcare Provider:</strong>{" "}
              {doctor.healthcareProvider.providerType}
            </p>
            <p>
              <strong>Branch ID:</strong> {doctor.healthcareProvider.branch_id}
            </p> */}
          </div>
        </div>
        <div className="flex mt-2">
          <button onClick={onClose} className="main-button">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
