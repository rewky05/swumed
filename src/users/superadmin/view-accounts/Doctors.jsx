import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../../backend/firebase";
import DoctorDetailsModal from "../../modals/doctor/DoctorDetails";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const doctorsRef = ref(database, "doctors");

    const unsubscribe = onValue(doctorsRef, (snapshot) => {
      const doctorsData = snapshot.val();
      if (doctorsData) {
        const doctorList = Object.keys(doctorsData).map((doctorId) => ({
          id: doctorId,
          ...doctorsData[doctorId],
        }));
        setDoctors(doctorList);
      } else {
        setDoctors([]);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.consultationDays.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold p-1 mb-4">Doctors</h2>
      <input
        type="text"
        placeholder="Search Doctors"
        value={searchTerm}
        onChange={handleSearchChange}
        className="border border-gray-300 rounded-md p-2 w-[30%] mb-4"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="flex border border-transparent shadow-md rounded-sm items-center max-h-[300px] w-fit"
          >
            <div className="flex flex-col justify-between">
              <div className="p-4">
                <h1 className="text-xl py-2">{doctor.name}</h1>
                <h2 className="text-lightgray">{doctor.specialty}</h2>
                <h2 className="text-lightgray">
                  Available for consultations {doctor.consultationDays}
                </h2>
              </div>
              <div className="p-4">
                <button
                  className="action-button"
                  onClick={() => handleDoctorClick(doctor)}
                >
                  Details
                </button>
              </div>
            </div>
            <div className="py-2 px-4">
              <img
                src={doctor.imageUrl}
                alt={`${doctor.name}`}
                className="w-[150px] h-[200px] object-cover object-center"
              />
            </div>
          </div>
        ))}
      </div>

      <DoctorDetailsModal
        isOpen={isModalOpen}
        doctor={selectedDoctor}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default Doctors;
