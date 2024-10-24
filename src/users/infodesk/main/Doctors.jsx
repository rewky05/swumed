import { useState } from "react";
import { IoMdAdd, IoIosSearch } from "react-icons/io";
import DoctorDetailsModal from "../../modals/doctor/DoctorDetails";
import CreateDoctor from "../../modals/doctor/CreateDoctor";

import { useAuthContext } from "../../context/AuthContext";
import { useUserContext } from "../../context/UserContext";
import { useDoctorContext } from "../../context/DoctorContext";
import Loading from "../../Loading";

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
      doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.healthcareProvider?.status
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      doctor.consultationDays
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (authLoading || userLoading || doctorsLoading) {
    return <Loading />;
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-xl font-semibold p-1">Doctors</h2>
        <button className="main-button" onClick={handleAddDoctor}>
          <IoMdAdd size={20} /> <span className="ml-1 text-sm">Add Doctor</span>
        </button>
      </div>

      <div className="flex w-[406px]">
        <div className="relative justify-end w-full">
          <input
            type="text"
            placeholder="Search Doctors"
            value={searchTerm}
            onChange={handleSearchChange}
            className="border border-gray-300 w-full rounded-md p-2 mb-4 text-sm"
          />
          <span className="absolute right-3 top-[35%] transform -translate-y-1/2">
            <IoIosSearch size={20} className="text-gray-400" />
          </span>
        </div>
      </div>

      <div className="overflow-x-auto overflow-y-auto border rounded-xl overflow-hidden shadow-md">
        <table className="w-full text-left text-[#171A1F] text-sm">
          <thead>
            <tr className="border-b bg-[#FAFAFB] text-[#565E6C] font-medium p-4">
              <th className="p-4">Doctor Name</th>
              <th className="p-4">Specialty</th>
              <th className="p-4">Consultation Days</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="">
                  <td className="p-3 pl-4">
                    {doctor.firstName + " " + doctor.lastName}
                  </td>
                  <td className="p-3">{doctor.specialty}</td>
                  <td className="p-3">{doctor.consultationDays}</td>
                  <td
                    className={`p-3 font-semibold ${
                      doctor.healthcareProvider?.status.toLowerCase() ===
                      "active"
                        ? "text-green-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {doctor.healthcareProvider?.status}
                  </td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => handleDoctorClick(doctor)}
                      className="action-button"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-4">
                  No doctors found
                </td>
              </tr>
            )}
          </tbody>
        </table>
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
