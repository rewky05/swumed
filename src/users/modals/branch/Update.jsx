import { useState } from "react";
import { update, ref, getDatabase } from "firebase/database";

const Update = ({ facilityType, facilityId, branchID, branch, onClose }) => {
  const [updatedBranch, setUpdatedBranch] = useState(branch);
  // const [updatedFacilityName, setUpdatedFacilityName] = useState(facilityName);

  if (!branch) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedBranch({ ...updatedBranch, [name]: value });
  };

  // const handleFacilityNameChange = (e) => {
  //   setUpdatedFacilityName(e.target.value);
  // };

  console.log(branch)
  const handleSave = async () => {
    if (!branch.id) {
      console.error("Branch ID is undefined");
      return;
    }

    const db = getDatabase();

    const branchRef = ref(
      db,
      `${facilityType}/${facilityId}/branch/${branchID}`
    );

    // const facilityRef = ref(db, `${facilityType}/${facilityId}`);

    try {
      await update(branchRef, updatedBranch);

      // await update(facilityRef, { name: updatedFacilityName });

      console.log("Branch and facility updated successfully");
      onClose();
    } catch (error) {
      console.error("Error updating branch or facility:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full">
        <h2 className="text-2xl font-bold mb-4">Edit Branch</h2>
        <label className="p-2">Branch Name</label>
        <input
          type="text"
          name="name"
          value={updatedBranch.name}
          onChange={handleInputChange}
          className="w-full p-2 m-2 border rounded"
          placeholder="Branch Name"
        />

        <label className="p-2">Branch Address</label>
        <input
          type="text"
          name="address"
          value={updatedBranch.address}
          onChange={handleInputChange}
          className="w-full p-2 m-2 border rounded"
          placeholder="Address"
        />

        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="cancel-button">
            Cancel
          </button>
          <button onClick={handleSave} className="main-button">
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Update;
