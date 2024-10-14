import { useState } from "react";
import { getDatabase, ref, push, set } from "firebase/database";
// import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext";

import { FaRegTrashAlt } from "react-icons/fa";
import { BiAddToQueue } from "react-icons/bi";

const HealthcareProvider = () => {
  const { user } = useUserContext();
  const [providerType, setProviderType] = useState("clinics");
  const [name, setName] = useState("");
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
              <div className="flex items-center gap-x-4">
                <input
                  type="text"
                  value={branch.name}
                  onChange={(e) =>
                    handleBranchChange(index, "name", e.target.value)
                  }
                  placeholder={`Branch ${index + 1} Name`}
                  className="border p-3 w-full rounded-lg"
                  required
                />
                <input
                  type="text"
                  value={branch.address}
                  onChange={(e) =>
                    handleBranchChange(index, "address", e.target.value)
                  }
                  placeholder={`Branch ${index + 1} Address`}
                  className="border p-3 w-full rounded-lg"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleAddBranch(index)}
                  className="main-button"
                >
                  <BiAddToQueue className="text-xl" />
                </button>
                {branches.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleLessBranch(index)}
                    className="main-button"
                  >
                    <FaRegTrashAlt className="text-xl" />
                  </button>
                )}
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
    </div>
  );
};

export default HealthcareProvider;
