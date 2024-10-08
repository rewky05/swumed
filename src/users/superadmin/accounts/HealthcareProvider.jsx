import { useState } from "react";
import { getDatabase, ref, push, set } from "firebase/database";
// import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../context/UserContext"; 

const HealthcareProvider = () => {
  const { user } = useUserContext() 
  const [providerType, setProviderType] = useState("clinics");
  const [name, setName] = useState("");
  const [branches, setBranches] = useState([{ id: 1, name: "", address: "" }]);
  const navigate = useNavigate();

  const handleAddBranch = () => {
    setBranches([...branches, { id: branches.length + 1, name: "", address: "" }]);
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
    <div className="max-w-lg mx-auto p-8 mt-8 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold mb-6 text-center">Register Healthcare Provider</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <fieldset className="border p-4 rounded-md">
          <legend className="font-medium">Provider Type</legend>
          <div className="flex items-center">
            <label className="flex items-center mr-4">
              <input
                type="radio"
                value="clinics"
                checked={providerType === "clinics"}
                onChange={() => setProviderType("clinics")}
                className="mr-2"
              />
              Clinic
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="hospitals"
                checked={providerType === "hospitals"}
                onChange={() => setProviderType("hospitals")}
                className="mr-2"
              />
              Hospital
            </label>
          </div>
        </fieldset>

        <div>
          <label className="block font-medium">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter provider name"
            className="border p-2 w-full rounded-md"
            required
          />
        </div>

        <div>
          <label className="block font-medium">Branches</label>
          {branches.map((branch, index) => (
            <div key={branch.id} className="mb-4 border p-4 rounded-md">
              <input
                type="text"
                value={branch.name}
                onChange={(e) => handleBranchChange(index, "name", e.target.value)}
                placeholder={`Branch ${index + 1} Name`}
                className="border p-2 w-full mb-2 rounded-md"
                required
              />
              <input
                type="text"
                value={branch.address}
                onChange={(e) => handleBranchChange(index, "address", e.target.value)}
                placeholder={`Branch ${index + 1} Address`}
                className="border p-2 w-full rounded-md"
                required
              />
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddBranch}
            className="bg-blue-500 text-white py-2 px-4 rounded-md mb-4"
          >
            Add Branch
          </button>
        </div>

        <button
          type="submit"
          className="bg-primary_maroon text-white py-2 px-4 rounded-md w-full"
        >
          Register Provider
        </button>
      </form>
    </div>
  );
};

export default HealthcareProvider;
