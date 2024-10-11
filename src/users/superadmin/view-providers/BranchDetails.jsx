import { useState } from "react";
import ViewModal from "../../modals/branch/View";
import UpdateModal from "../../modals/branch/Update";
import DeleteModal from "../../modals/branch/Delete";

const BranchDetails = ({
  branchName,
  branch,
  facilityId,  
  facilityType, 
  onEditClick,
  onViewClick,
  onDeleteClick,
}) => {
  const [currentModal, setCurrentModal] = useState(null);

  const handleView = () => setCurrentModal("view");
  const handleEdit = () => setCurrentModal("edit");
  const handleDelete = () => setCurrentModal("delete");
  const closeModal = () => setCurrentModal(null);

  const countPatients = () => {
    let patientCount = 0;
    if (branch.doctors) {
      for (const doctorId in branch.doctors) {
        if (branch.doctors[doctorId].patients) {
          patientCount += Object.keys(branch.doctors[doctorId].patients).length;
        }
      }
    }
    return patientCount;
  };

  return (
    <div className="p-4 bg-highlight_pink rounded-lg mb-2 shadow hover:shadow-lg transition duration-200 flex flex-col w-[240px]">
      <h4 className="text-lg font-bold">{branchName}</h4>
      <p>
        <strong>Address:</strong> {branch.address}
      </p>
      <p>
        <strong>Staff:</strong>{" "}
        {branch.staff ? Object.keys(branch.staff).length : 0} members
      </p>
      <p>
        <strong>Patients:</strong>{" "}
        {countPatients()} patients
      </p>
      <p>
        <strong>Doctors:</strong>{" "}
        {branch.doctors ? Object.keys(branch.doctors).length : 0} doctors
      </p>
      <button
        onClick={handleView}
        className="mt-2 bg-primary_maroon text-white py-1 px-3 rounded hover:bg-highlight_pink hover:text-primary_maroon transition duration-200"
      >
        View
      </button>

      <button
        onClick={handleEdit}
        className="mt-2 bg-primary_maroon text-white py-1 px-3 rounded hover:bg-highlight_pink hover:text-primary_maroon transition duration-200"
      >
        Edit
      </button>

      <button
        onClick={handleDelete}
        className="mt-2 bg-primary_maroon text-white py-1 px-3 rounded hover:bg-highlight_pink hover:text-primary_maroon transition duration-200"
      >
        Delete
      </button>

      {currentModal === "view" && (
        <ViewModal branch={branch} onClose={closeModal} />
      )}

      {currentModal === "edit" && (
        <UpdateModal
          facilityId={facilityId} 
          facilityType={facilityType} 
          branchId={branch.id} 
          branch={branch}
          onClose={closeModal}
        />
      )}

      {currentModal === "delete" && (
        <DeleteModal
          facilityId={facilityId} 
          facilityType={facilityType} 
          branchId={branch.id} 
          onClose={closeModal}
        />
      )}
    </div>
  );
};

export default BranchDetails;
