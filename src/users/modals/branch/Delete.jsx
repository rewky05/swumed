import { ref, remove, getDatabase } from "firebase/database";

const DeleteModal = ({ facilityType, facilityId, branchID, branch, onClose }) => {
  console.log(branchID)

  const handleDelete = async () => {
    const db = getDatabase();
    const branchRef = ref(
      db,
      `${facilityType}/${facilityId}/branch/${branchID}`
    );
    await remove(branchRef);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold py-2">Confirm Delete</h2>
        <p className="p-2">Are you sure you want to delete this branch?</p>
        <div className="flex justify-end py-2">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button onClick={handleDelete} className="main-button">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
