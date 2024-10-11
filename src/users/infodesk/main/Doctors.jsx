import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import DoctorDetailsModal from "../../modals/doctor/DoctorDetails";
import CreateDoctor from "../../modals/doctor/CreateDoctor";

import { useAuthContext } from "../../context/AuthContext";
import { useUserContext } from "../../context/UserContext";
import { useDoctorContext } from "../../context/DoctorContext";

const Doctors = () => {
  const { currentUser, loading: authLoading } = useAuthContext();
  const { user, loading: userLoading } = useUserContext();
  const { doctors, loading: doctorsLoading } = useDoctorContext();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCreateDoctor, setShowCreateDoctor] = useState(false);

  const handleDoctorClick = (doctor) => {
    console.log("Doctor clicked:", doctor);
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleAddDoctor = () => {
    console.log("Add Doctor button clicked");
    setShowCreateDoctor(true);
  };

  const handleCloseModal = () => {
    console.log("Closing modals");
    setIsModalOpen(false);
    setShowModal(false);
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    console.log("Search term updated:", term);
    setSearchTerm(term);
  };

  const filteredDoctors = doctors.filter(
    (doctor) =>
      doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.consultationDays.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || userLoading || doctorsLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold p-1">Doctors</h2>
        <button className="main-button" onClick={handleAddDoctor}>
          <IoMdAdd size={20} /> <span className="ml-1 text-sm">Add Doctor</span>
        </button>
      </div>

      <input
        type="text"
        placeholder="Search Doctors"
        value={searchTerm}
        onChange={handleSearchChange}
        className="border border-gray-300 rounded-md p-2 w-[30%] mb-4 text-sm"
      />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="flex border border-transparent shadow-md rounded-sm items-center max-h-[300px] w-fit"
          >
            <div className="flex flex-col justify-between">
              <div className="p-4">
                <h1 className="text-lg py-2">{doctor.name}</h1>
                <h2 className="text-lightgray text-sm">{doctor.specialty}</h2>
                <h2 className="text-lightgray text-sm">
                  Available for consultations {doctor.consultationDays}
                </h2>
              </div>
              <div className="p-4 text-sm">
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

      {showCreateDoctor && (
        <CreateDoctor onClose={() => setShowCreateDoctor(false)} />
      )}
    </div>
  );
};

export default Doctors;
