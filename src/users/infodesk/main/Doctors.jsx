import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { TiArrowSortedDown } from "react-icons/ti";
import { IoMdAdd } from "react-icons/io";
import { database } from "../../../backend/firebase";
import DoctorDetailsModal from "../../modals/DoctorDetails";
import CreateDoctorModal from "../../modals/CreateDoctor";

import { useUserContext } from "../../../users/context/UserContext";
import { useProviderContext } from "../../../users/context/ProviderContext";

const Doctors = () => {
  const { user } = useUserContext(); 
  const { healthcareProviderName, setHealthcareProviderName } = useProviderContext();
  const [doctors, setDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialties, setSpecialties] = useState([]);
  const [consultationDays, setConsultationDays] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("");
  const [selectedConsultationDay, setSelectedConsultationDay] = useState("");
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false); // State for create doctor modal

  useEffect(() => {
    if (!user) return; // If no user, exit

    const doctorsRef = ref(database, "doctors");
    const hospitalsRef = ref(database, "hospitals");

    if (user?.hospital_id) {
      onValue(hospitalsRef, (snapshot) => {
        const hospitalsData = snapshot.val();
        const hospitalData = hospitalsData?.[user.hospital_id];
        if (hospitalData && hospitalData.name !== healthcareProviderName) {
          setHealthcareProviderName(hospitalData.name);
        }
      });
    } else if (user?.clinic_id) {
      const clinicsRef = ref(database, "clinics");
      onValue(clinicsRef, (snapshot) => {
        const clinicsData = snapshot.val();
        const clinicData = clinicsData?.[user.clinic_id];
        if (clinicData && clinicData.name !== healthcareProviderName) {
          setHealthcareProviderName(clinicData.name);
        }
      });
    }

    onValue(doctorsRef, (snapshot) => {
      const data = snapshot.val();
      const userHealthcareProviderId = user?.hospital_id || user?.clinic_id;

      if (data && userHealthcareProviderId) {
        const doctorsArray = Object.keys(data)
          .filter((key) => {
            const doctor = data[key];
            return (
              doctor.healthcareProvider &&
              (doctor.healthcareProvider.hospital_id === userHealthcareProviderId ||
                doctor.healthcareProvider.clinic_id === userHealthcareProviderId)
            );
          })
          .map((key) => ({ id: key, ...data[key] }));

        setDoctors(doctorsArray);

        const uniqueSpecialties = [...new Set(doctorsArray.map((doc) => doc.specialty))];
        const uniqueConsultationDays = [
          ...new Set(doctorsArray.flatMap((doc) => doc.consultationDays || [])),
        ];

        setSpecialties(uniqueSpecialties);
        setConsultationDays(uniqueConsultationDays);
      }
    });
  }, [user, healthcareProviderName]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSpecialtyChange = (e) => {
    setSelectedSpecialty(e.target.value);
  };

  const handleConsultationDayChange = (e) => {
    setSelectedConsultationDay(e.target.value);
  };

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

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearchTerm = doctor.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesSpecialty = selectedSpecialty ? doctor.specialty === selectedSpecialty : true;
    const matchesConsultationDay = selectedConsultationDay
      ? (doctor.consultationDays || []).includes(selectedConsultationDay)
      : true;

    return matchesSearchTerm && matchesSpecialty && matchesConsultationDay;
  });

  return (
    <div className="p-8">
      <div className="flex items-center gap-4 mb-4">
        <h2 className="text-2xl font-semibold p-1">Doctor List</h2>
        <button
          className="bg-primary_maroon rounded-md text-white py-2 px-2 flex items-center"
          onClick={handleAddDoctor}
        >
          <IoMdAdd size={20} />
        </button>
      </div>

      <div className="flex items-center mb-4">
        <input
          type="text"
          placeholder="Search Doctors"
          value={searchTerm}
          onChange={handleSearchChange}
          className="border border-gray-300 rounded-md p-2 w-[30%] mr-4"
        />
        <div className="relative">
          <select
            className="appearance-none bg-primary_maroon rounded-md text-white py-2 mx-2 px-5 pr-7 flex items-center"
            value={selectedSpecialty}
            onChange={handleSpecialtyChange}
          >
            <option value="">Specialty</option>
            {specialties.map((specialty) => (
              <option key={specialty} value={specialty}>
                {specialty}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <TiArrowSortedDown size={20} className="text-white" />
          </span>
        </div>
        <div className="relative">
          <select
            className="appearance-none bg-primary_maroon rounded-md text-white py-2 mx-2 px-5 pr-7 flex items-center"
            value={selectedConsultationDay}
            onChange={handleConsultationDayChange}
          >
            <option value="">Consultation Day</option>
            {consultationDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <TiArrowSortedDown size={20} className="text-white" />
          </span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {filteredDoctors.map((doctor) => (
          <div
            key={doctor.id}
            className="flex border border-transparent shadow-md rounded-sm items-center max-h-[300px] w-fit"
          >
            <div className="flex flex-col justify-between">
              <div className="p-4">
                <h1 className="text-xl py-2">{doctor.name}</h1>
                <h2 className="text-lightgray">
                  {doctor.specialty} at {healthcareProviderName}
                </h2>
                <h2 className="text-lightgray">Available for consultations</h2>
                <h2 className="text-lightgray">{doctor.consultationDays}</h2>
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
                alt={doctor.name}
                className="w-[150px] h-[200px] object-cover rounded-md"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <DoctorDetailsModal
        isOpen={isModalOpen}
        doctor={selectedDoctor}
        onClose={handleCloseModal}
      />
      <CreateDoctorModal showModal={showModal} setShowModal={handleCloseModal} />
    </div>
  );
};

export default Doctors;
