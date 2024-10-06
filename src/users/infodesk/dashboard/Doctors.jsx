import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../../backend/firebase";
import { FaEye } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import DoctorDetailsModal from "../../modals/DoctorDetails";
import CreateDoctor from "../../modals/CreateDoctor";

import { useAuthContext } from "../../context/AuthContext";
import { useProviderContext } from "../../context/ProviderContext";

const Doctors = () => {
  const { currentUser, loading } = useAuthContext(); 
  const { providerId, providerType } = useProviderContext(); 

  const [doctors, setDoctors] = useState([]);
  const [healthcareProviderName, setHealthcareProviderName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (loading || !currentUser) return;

    const doctorsRef = ref(database, "doctors");

    if (providerId && providerType) {
      const refPath = providerType === "hospital" ? "hospitals" : "clinics";
      const healthcareProviderRef = ref(database, refPath);

      onValue(healthcareProviderRef, (snapshot) => {
        const providerData = snapshot.val()?.[providerId];
        if (providerData && providerData.name !== healthcareProviderName) {
          setHealthcareProviderName(providerData.name);
        }
      });
    }

    onValue(doctorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data && providerId) {
        const doctorsArray = Object.keys(data)
          .filter((key) => {
            const doctor = data[key];
            return (
              doctor.healthcareProvider &&
              (doctor.healthcareProvider.hospital_id === providerId ||
                doctor.healthcareProvider.clinic_id === providerId)
            );
          })
          .map((key) => ({ id: key, ...data[key] }));

        setDoctors(doctorsArray);
      }
    });
  }, [currentUser, loading, providerId, providerType, healthcareProviderName]);

  const handleDoctorClick = (doctor) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleAddDoctor = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setShowModal(false);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredDoctors = doctors.filter((doctor) =>
    doctor.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-semibold p-1">Doctor Search</h2>
        <button
          className="bg-primary_maroon rounded-md text-white py-2 px-5 flex items-center"
          onClick={handleAddDoctor}
        >
          <IoMdAdd size={20} /> <span className="ml-1">Add Doctor</span>
        </button>
        <Link to="/doctors">
          <button className="bg-primary_maroon rounded-md text-white py-2 px-7 flex items-center">
            <FaEye size={20} /> <span className="ml-1">View All</span>
          </button>
        </Link>
      </div>

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
                  className="p-2 rounded-md border border-primary_maroon hover:bg-highlight_pink transition-all"
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
      <CreateDoctor showModal={showModal} setShowModal={setShowModal} />
    </div>
  );
};

export default Doctors;
