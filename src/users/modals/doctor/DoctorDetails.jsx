const DoctorDetails = ({ isOpen, doctor, onClose }) => {
  if (!isOpen || !doctor) return null;

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg w-3/4 md:w-1/2 p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{doctor.name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            Close
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <img 
              src={doctor.imageUrl} 
              alt={doctor.name} 
              className="w-full h-auto object-cover rounded-lg" 
            />
          </div>
          <div>
            <p><strong>Email:</strong> {doctor.account.email}</p>
            <p><strong>Consultation Days:</strong> {doctor.consultationDays}</p>
            <p><strong>Specialty:</strong> {doctor.specialty}</p>
            <p><strong>Healthcare Provider:</strong> {doctor.healthcareProvider.providerType}</p>
            <p><strong>Branch ID:</strong> {doctor.healthcareProvider.branch_id}</p>
          </div>
        </div>
        <div className="mt-4">
          <button 
            onClick={onClose} 
            className="bg-primary_maroon text-white py-2 px-4 rounded-md"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default DoctorDetails;
