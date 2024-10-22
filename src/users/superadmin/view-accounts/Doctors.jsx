import { useState, useEffect } from "react";
import { ref, onValue } from "firebase/database";
import { database } from "../../../backend/firebase";
import { IoIosSearch } from "react-icons/io";
import DoctorDetailsModal from "../../modals/doctor/DoctorDetails";
import Loading from "../../Loading";

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

  useEffect(() => {
    if (doctors.length > 0) {
      const fetchHealthcareProviderDetails = async () => {
        const updatedDoctors = await Promise.all(
          doctors.map(async (doctor) => {
            const { healthcareProvider } = doctor;
            let providerName = "";
            let branchName = "";

            if (healthcareProvider?.hospital_id) {
              const hospitalRef = ref(
                database,
                `hospitals/${healthcareProvider.hospital_id}`
              );
              const hospitalSnapshot = await new Promise((resolve) =>
                onValue(hospitalRef, resolve, { onlyOnce: true })
              );
              providerName = hospitalSnapshot.val()?.name || "Unknown Hospital";
            } else if (healthcareProvider?.clinic_id) {
              const clinicRef = ref(
                database,
                `clinics/${healthcareProvider.clinic_id}`
              );
              const clinicSnapshot = await new Promise((resolve) =>
                onValue(clinicRef, resolve, { onlyOnce: true })
              );
              providerName = clinicSnapshot.val()?.name || "Unknown Clinic";
            }

            const clinicBranchPath = `clinics/${healthcareProvider.clinic_id}/branch/${healthcareProvider.branch_id}`;
            const hospitalBranchPath = `hospitals/${healthcareProvider.hospital_id}/branch/${healthcareProvider.branch_id}`;

            if (
              healthcareProvider?.hospital_id &&
              healthcareProvider?.branch_id
            ) {
              const branchRef = ref(database, hospitalBranchPath);
              const branchSnapshot = await new Promise((resolve) =>
                onValue(branchRef, resolve, { onlyOnce: true })
              );
              branchName = branchSnapshot.val()?.name || "Unknown Branch";
            } else if (
              healthcareProvider?.clinic_id &&
              healthcareProvider?.branch_id
            ) {
              const branchRef = ref(database, clinicBranchPath);
              const branchSnapshot = await new Promise((resolve) =>
                onValue(branchRef, resolve, { onlyOnce: true })
              );
              branchName = branchSnapshot.val()?.name || "Unknown Branch";
            }

            return {
              ...doctor,
              providerName,
              branchName,
            };
          })
        );
        setDoctors(updatedDoctors);
      };

      fetchHealthcareProviderDetails();
    }
  }, [doctors]);

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
    return <Loading />;
  }

  return (
    <div className="p-8">
      <h2 className="text-xl font-semibold p-1 mb-4">Doctors</h2>
      <div className="flex w-[406px]">
        <div className="relative justify-end w-full">
          <input
            type="text"
            placeholder="Search"
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
              <th className="p-4">Email</th>
              <th className="p-4">Facility</th>
              <th className="p-4">Branch</th>
              <th className="p-4">Status</th>
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
                  <td className="p-3">{doctor.consultationDays || "N/A"}</td>
                  <td className="p-3">{doctor.account.email || "N/A"}</td>
                  <td className="p-3">{doctor.providerName || "N/A"}</td>
                  <td className="p-3">{doctor.branchName || "N/A"}</td>
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
    </div>
  );
};

export default Doctors;
