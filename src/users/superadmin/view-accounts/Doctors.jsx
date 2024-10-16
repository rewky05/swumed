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
      doctor.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.consultationDays
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase())
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
      <h2 className="text-xl font-semibold p-1 mb-4">Doctors</h2>
      <input
        type="text"
        placeholder="Search Doctors"
        value={searchTerm}
        onChange={handleSearchChange}
        className="border border-gray-300 rounded-md text-sm p-2 w-[30%] mb-4"
      />

      <div className="overflow-x-auto overflow-y-auto border rounded-xl overflow-hidden shadow-md">
        <table className="w-full text-left text-[#171A1F] text-sm">
          <thead>
            <tr className="border-b bg-[#FAFAFB] text-[#565E6C] font-medium p-4">
              <th className="p-4">Doctor Name</th>
              <th className="p-4">Specialty</th>
              <th className="p-4">Consultation Days</th>
              <th className="p-4">Email</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map((doctor) => (
                <tr key={doctor.id} className="border-b">
                  <td className="p-3 pl-4">
                    {doctor.firstName + " " + doctor.lastName || "N/A"}
                  </td>
                  <td className="p-3">{doctor.specialty || "N/A"}</td>
                  <td className="p-3">
                    {doctor.consultationDays || "N/A"}
                  </td>
                  <td className="p-3">
                  {doctor.account.email || "N/A"}

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
    </div>
  );
};

export default Doctors;
