import { getDatabase, ref, get, update } from "firebase/database";
import { useState, useEffect } from "react";
import { FaRegTrashAlt } from "react-icons/fa";

const View = ({ facilityType, facilityId, branch, onClose }) => {
  const [staffDetails, setStaffDetails] = useState([]);
  const [doctorDetails, setDoctorDetails] = useState([]);
  const [patientDetails, setPatientDetails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStaff, setSelectedStaff] = useState([]);

  useEffect(() => {
    const db = getDatabase();

    const fetchStaffDetails = async () => {
      if (branch.staff) {
        const staffPromises = Object.keys(branch.staff).map(async (staffId) => {
          const staffSnapshot = await get(ref(db, `staff/${staffId}`));
          return staffSnapshot.exists()
            ? { ...staffSnapshot.val(), id: staffId }
            : null;
        });
        setStaffDetails(await Promise.all(staffPromises));
      }
    };

    const fetchDoctorDetails = async () => {
      if (branch.doctors) {
        const doctorPromises = Object.keys(branch.doctors).map(
          async (doctorId) => {
            const doctorSnapshot = await get(ref(db, `doctors/${doctorId}`));
            return doctorSnapshot.exists() ? doctorSnapshot.val() : null;
          }
        );
        setDoctorDetails(await Promise.all(doctorPromises));
      }
    };

    const fetchPatientDetails = async () => {
      if (branch.doctors) {
        const patientIds = Object.entries(branch.doctors).flatMap(
          ([doctorId, doctorInfo]) => {
            if (typeof doctorInfo === "object" && doctorInfo.patients) {
              return Object.keys(doctorInfo.patients);
            }
            return [];
          }
        );

        const uniquePatientIds = [...new Set(patientIds)];

        const patientPromises = uniquePatientIds.map(async (patientId) => {
          const patientSnapshot = await get(ref(db, `patients/${patientId}`));
          return patientSnapshot.exists() ? patientSnapshot.val() : null;
        });

        const fetchedPatients = await Promise.all(patientPromises);

        const validPatients = fetchedPatients.filter(
          (patient) => patient !== null
        );
        setPatientDetails(validPatients);
      }
    };

    console.log(patientDetails);

    const fetchData = async () => {
      await Promise.all([
        fetchStaffDetails(),
        fetchDoctorDetails(),
        fetchPatientDetails(),
      ]);
      setLoading(false);
    };

    fetchData();
  }, [branch]);

  const handleSelectStaff = (staffId) => {
    setSelectedStaff((prevSelected) =>
      prevSelected.includes(staffId)
        ? prevSelected.filter((id) => id !== staffId)
        : [...prevSelected, staffId]
    );
  };

  console.log(facilityType, facilityId, branch.id);

  const handleDeleteStaff = async () => {
    const db = getDatabase();
    const updates = {};

    selectedStaff.forEach((staffId) => {
      updates[
        `${facilityType}/${facilityId}/branch/${branch.id}/staff/${staffId}`
      ] = null;

      updates[`staff/${staffId}/hospital_id`] = null;
      updates[`staff/${staffId}/clinic_id`] = null;
      updates[`staff/${staffId}/branch_id`] = null;
    });

    await update(ref(db), updates);
    setSelectedStaff([]);

    setStaffDetails((prev) =>
      prev.filter((staff) => !selectedStaff.includes(staff.id))
    );
  };

  const groupedStaff = staffDetails.reduce((acc, staff) => {
    const role = staff?.role;
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(staff);
    return acc;
  }, {});

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-md w-[750px]">
        <h2 className="text-2xl font-bold p-2 pb-4">Branch Details</h2>
        <div className="p-2 grid grid-cols-2 gap-x-2">
          <p>
            <strong>Branch:</strong> {branch.name}
          </p>
          <p>
            <strong>Address:</strong> {branch.address}
          </p>
        </div>

        <div className="grid grid-cols-2 my-4 gap-x-2 h-[400px] overflow-auto">
          <div className="p-2">
            <p className="flex items-center">
              <strong>Users: {staffDetails.length} </strong>
              {selectedStaff.length > 0 && (
                <button
                  onClick={handleDeleteStaff}
                  className="main-button mx-2"
                >
                  <FaRegTrashAlt />
                </button>
              )}
            </p>
            <ul>
              {Object.entries(groupedStaff).map(([role, staffList]) => (
                <div key={role} className="p-2">
                  <h2 className="font-semibold">
                    {role === "Information Desk Staff"
                      ? "Infodesk Staff"
                      : "Philhealth Staff"}
                  </h2>
                  <ul>
                    {staffList.map((staff, index) => (
                      <div key={staff?.id} className="flex items-center p-2">
                        <input
                          className="w-fit"
                          type="checkbox"
                          checked={selectedStaff.includes(staff?.id)}
                          onChange={() => handleSelectStaff(staff?.id)}
                        />
                        <li className="px-2">
                          {staff?.firstName} {staff?.lastName} (
                          {staff?.account.email})
                        </li>
                      </div>
                    ))}
                  </ul>
                </div>
              ))}
            </ul>
          </div>
          <div className="p-2">
            <p>
              <strong>Patients: {patientDetails.length} </strong>
            </p>
            <ul>
              {patientDetails.map((patient, index) => (
                <div key={index} className="p-2 pt-2 pb-1">
                  <li key={index}>
                    {patient?.generalData?.firstName}{" "}
                    {patient?.generalData?.lastName} ({patient?.account?.email})
                  </li>
                </div>
              ))}
            </ul>
          </div>
          <div className="p-2">
            <p>
              <strong>Doctors: {doctorDetails.length} </strong>
            </p>
            <ul>
              {doctorDetails.map((doctor, index) => (
                <div key={index} className="p-2">
                  {doctor?.specialty && (
                    <h2 className="font-semibold">{doctor?.specialty}</h2>
                  )}
                  <li key={index}>
                    {doctor?.firstName} {doctor?.lastName} (
                    {doctor?.account?.email})
                  </li>
                </div>
              ))}
            </ul>
          </div>
        </div>

        <button onClick={onClose} className="main-button">
          Close
        </button>
      </div>
    </div>
  );
};

export default View;
