import { ref, remove, getDatabase } from "firebase/database";

const DeleteModal = ({ facilityId, branchId, facilityType, onClose }) => {
  const handleDelete = async () => {
    const db = getDatabase();
    const branchRef = ref(db, `${facilityType}/${facilityId}/branch/${branchId}`);
    await remove(branchRef);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold py-2">Confirm Delete</h2>
        <p className="py-4">Are you sure you want to delete this branch?</p>
        <button
          onClick={handleDelete}
          className="bg-primary_maroon text-white py-2 px-4 rounded hover:bg-red-500"
        >
          Delete
        </button>
        <button
          onClick={onClose}
          className="ml-2 bg-gray-200 text-black py-2 px-4 rounded hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default DeleteModal;
