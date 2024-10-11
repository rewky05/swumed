import { useState } from "react";
import { update, ref, getDatabase } from "firebase/database";

const Update = ({ facilityType, facilityId, branchID, branch, onClose }) => {
  const [updatedBranch, setUpdatedBranch] = useState(branch);
  if (!branch) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBranch({ ...updatedBranch, [name]: value });
  };

  const handleSave = async () => {
    if (!branchID) {
      console.error('Branch ID is undefined');
      return;
    }
  
    const db = getDatabase();
    const branchRef = ref(db, `${facilityType}/${facilityId}/branch/${branchID}`);
    
    try {
      await update(branchRef, updatedBranch);
      console.log('Branch updated successfully');
      onClose();
    } catch (error) {
      console.error('Error updating branch:', error);
    }
  };
  

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Edit Branch</h2>
        <input
          type="text"
          name="name"
          value={updatedBranch.name}
          onChange={handleInputChange}
          className="w-full p-2 mb-2 border rounded"
          placeholder="Branch Name"
        />
        <input
          type="text"
          name="address"
          value={updatedBranch.address}
          onChange={handleInputChange}
          className="w-full p-2 mb-2 border rounded"
          placeholder="Address"
        />
        <button
          onClick={handleSave}
          className="bg-primary_maroon text-white py-2 px-4 rounded hover:bg-highlight_pink"
        >
          Save
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

export default Update;
