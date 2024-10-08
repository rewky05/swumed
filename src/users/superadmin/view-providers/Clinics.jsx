import React, { useEffect, useState } from "react";
import { getDatabase, ref, get } from "firebase/database";

const fetchClinics = async () => {
  const db = getDatabase();
  const clinicsRef = ref(db, "clinics");

  const snapshot = await get(clinicsRef);
  if (!snapshot.exists()) return [];

  return Object.entries(snapshot.val()).map(([key, value]) => ({
    id: key,
    name: value.name,
    branches: value.branch,
  }));
};

const Collapsible = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 border rounded-lg shadow-md">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left font-semibold py-2 px-4 rounded-t-lg transition duration-200 
          ${isOpen ? "" : "bg-primary_maroon text-white hover:bg-highlightpink"}`}
      >
        {title}
      </button>
      {isOpen && <div className="p-4 border-t bg-lightgray">{children}</div>}
    </div>
  );
};

const BranchDetails = ({ branchName, branch, onEditClick }) => {
  return (
    <div className="p-4 bg-white rounded-lg mb-2 shadow hover:shadow-lg transition duration-200 flex flex-col w-fit">
      <h4 className="text-lg font-bold">{branchName}</h4>
      <p>
        <strong>Address:</strong> {branch.address}
      </p>
      <p>
        <strong>Staff:</strong> {branch.staff ? Object.keys(branch.staff).length : 0} members
      </p>
      <p>
        <strong>Patients:</strong> {branch.patients ? Object.keys(branch.patients).length : 0} patients
      </p>
      <p>
        <strong>Doctors:</strong> {branch.doctors ? Object.keys(branch.doctors).length : 0} doctors
      </p>
      <button
        onClick={() => onEditClick(branchName, branch)}
        className="mt-2 bg-primary_maroon text-white py-1 px-3 rounded hover:bg-highlight_pink hover:text-primary_maroon transition duration-200"
      >
        Edit Branch
      </button>
      <button
        onClick={() => alert(`Viewing details for Branch: ${branchName}`)} 
        className="mt-2 bg-primary_maroon text-white py-1 px-3 rounded hover:bg-highlight_pink hover:text-primary_maroon transition duration-200"
      >
        View Details
      </button>
    </div>
  );
};

const Clinics = () => {
  const [loading, setLoading] = useState(true);
  const [clinics, setClinics] = useState([]);

  useEffect(() => {
    const loadClinics = async () => {
      setLoading(true);
      const clinicData = await fetchClinics();
      setClinics(clinicData);
      setLoading(false);
    };

    loadClinics();
  }, []);

  const handleEditClick = (branchName, branch) => {
    console.log(`Editing branch: ${branchName}`, branch);
  };

  if (loading) {
    return <div className="text-center py-4">Loading clinics...</div>; 
  }

  return (
    <div className="p-4 min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Clinics</h2>
      {clinics.length === 0 ? (
        <p>No clinics found.</p>
      ) : (
        clinics.map((clinic) => (
          <div key={clinic.id}>
            <Collapsible title={clinic.name}>
              <div className="flex gap-4">
                {Object.entries(clinic.branches).map(([branchId, branch]) => (
                  <BranchDetails
                    key={branchId}
                    branchName={branch.name} 
                    branch={branch}
                    onEditClick={handleEditClick}
                  />
                ))}
              </div>
            </Collapsible>
          </div>
        ))
      )}
    </div>
  );
};

export default Clinics;
