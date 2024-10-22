import { useState } from "react";
import { getDatabase, ref, push, set } from "firebase/database";
// import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

// import { FaRegTrashAlt } from "react-icons/fa";
// import { BiAddToQueue } from "react-icons/bi";

const HealthcareProvider = () => {
  const { user } = useUserContext();
  const [providerType, setProviderType] = useState("clinics");
  const [name, setName] = useState("");
  const [branchToRemoveIndex, setBranchToRemoveIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [branches, setBranches] = useState([{ id: 1, name: "", address: "" }]);
  const navigate = useNavigate();

  const handleAddBranch = (index) => {
    const newBranch = { id: branches.length + 1, name: "", address: "" };
    const updatedBranches = [...branches];
    updatedBranches.splice(index + 1, 0, newBranch);
    setBranches(updatedBranches);
  };

  const handleLessBranch = (index) => {
    if (branches.length > 1) {
      const updatedBranches = branches.filter((_, i) => i !== index);
      setBranches(updatedBranches);
    }
  };

  const handleShowModal = (index) => {
    setBranchToRemoveIndex(index);
    setShowModal(true);
  };

  const handleBranchChange = (index, field, value) => {
    const updatedBranches = [...branches];
    updatedBranches[index][field] = value;
    setBranches(updatedBranches);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase();

    if (!user) {
      console.error("User not logged in.");
      return;
    }

    try {
      const newProviderRef = push(ref(db, providerType));

      const branchData = {};
      branches.forEach((branch, index) => {
        const branchId = `branch_id_${index + 1}`;
        branchData[branchId] = {
          name: branch.name,
          address: branch.address,
          id: branchId,
        };
      });

      await set(newProviderRef, {
        name,
        branch: branchData,
      });

      console.log("Healthcare provider registered successfully!");
      navigate("/superadmin-dashboard");
    } catch (error) {
      console.error("Error registering healthcare provider:", error);
    }
  };

  return (
    <div className="p-8 w-[1150px] bg-white mx-auto justify-center items-center place-content-center my-8 rounded-lg shadow-md mt-14">
      <h1 className="text-2xl font-semibold mb-6 text-center">
        Register Healthcare Facility
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-x-8">
          <fieldset className="border p-4 rounded-md max-h-[90px]">
            <legend className="font-medium">Facility Type</legend>
            <div className="flex items-center max-h-[90px]">
              <label className="flex items-center mr-4">
                <input
                  type="radio"
                  value="clinics"
                  checked={providerType === "clinics"}
                  onChange={() => setProviderType("clinics")}
                  className="mr-2 accent-primary_maroon"
                />
                Clinic
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="hospitals"
                  checked={providerType === "hospitals"}
                  onChange={() => setProviderType("hospitals")}
                  className="mr-2 accent-primary_maroon"
                />
                Hospital
              </label>
            </div>
          </fieldset>
          <fieldset className="border p-4 rounded-md max-h-[90px] flex items-center ">
            <legend className="font-medium">Name</legend>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter facility name"
              className="p-2 w-full rounded-md outline-none max-h-[90px]"
              required
            />
          </fieldset>
        </div>

        <div>
          <div className="flex justify-between items-center py-2">
            <label className="block font-medium">Branches</label>
          </div>
          {branches.map((branch, index) => (
            <div key={branch.id} className="mb-4 border p-4 rounded-md">
              <div className="flex flex-col gap-y-2">
                <div className="m-1">
                  <input
                    type="text"
                    value={branch.name}
                    onChange={(e) =>
                      handleBranchChange(index, "name", e.target.value)
                    }
                    placeholder={`Branch ${index + 1} Name`}
                    className="border p-3 my-1 w-full rounded-lg"
                    required
                  />
                  <input
                    type="text"
                    value={branch.address}
                    onChange={(e) =>
                      handleBranchChange(index, "address", e.target.value)
                    }
                    placeholder={`Branch ${index + 1} Address`}
                    className="border p-3 my-1 w-full rounded-lg"
                    required
                  />
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => handleAddBranch(index)}
                    className="action-button"
                  >
                    {/* <BiAddToQueue className="text-xl" /> */}
                    Add Branch
                  </button>
                  {branches.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleShowModal(index)}
                      className="discharge-button"
                    >
                      {/* <FaRegTrashAlt className="text-xl" /> */}
                      Remove Branch
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-6">
          <button type="submit" className="main-button">
            Register Facility
          </button>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md shadow-lg p-6 max-w-md">
            <h2 className="text-center text-lg font-semibold mb-4">
              Are you sure you want to remove this branch?
            </h2>
            <div className="flex justify-end pb-[4px]">
              <button
                onClick={() => setShowModal(false)}
                className="cancel-button"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  handleLessBranch(branchToRemoveIndex);
                  setShowModal(false);
                }}
                className="main-button"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthcareProvider;
