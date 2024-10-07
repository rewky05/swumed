import { useState } from "react";
import { getDatabase, ref, set, push } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useUserContext } from "../context/UserContext"; 

const CreatePatient = ({ onClose }) => {
  const { user } = useUserContext(); 
  const { hospital_id, clinic_id, branch_id, providerType } = user; 
  console.log(hospital_id, clinic_id, branch_id, providerType);

  const [generalData, setGeneralData] = useState({
    name: "",
    philhealthNumber: "",
    age: "",
    birthdate: "",
    contactNumber: "",
    gender: "",
    maritalStatus: "",
    address: "",
    nationality: "",
    imageUrl: "",
  });

  const [email, setEmail] = useState("");

  const handleSubmit = async () => {
    const db = getDatabase();
    const newPatientRef = push(ref(db, "patients"));
    const patientId = newPatientRef.key;
    const today = new Date().toLocaleDateString("en-US");

    let i = 1;
    const medicalRecordId = `MR-${i++}`;

    const newPatient = {
      account: {
        email,
      },
      generalData: {
        ...generalData,
      },
      medicalRecords: {
        [medicalRecordId]: {
          date: today,
          healthcareProvider: {
            assignedDoctor: "", 
            branch_id: branch_id, 
            clinic_id: clinic_id ? clinic_id : null, 
            hospital_id: hospital_id ? hospital_id : null, 
            type: clinic_id ? "clinic" : "hospital", 
          },
          isHidden: false,
          status: "Active",
        },
      },
    };

    await set(ref(db, `patients/${patientId}`), newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-content bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary_maroon mb-4">
          Add Patient
        </h2>

        <input
          type="text"
          placeholder="Name"
          value={generalData.name}
          onChange={(e) =>
            setGeneralData({ ...generalData, name: e.target.value })
          }
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        />

        <input
          type="text"
          placeholder="Philhealth Number"
          value={generalData.philhealthNumber}
          onChange={(e) =>
            setGeneralData({ ...generalData, philhealthNumber: e.target.value })
          }
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        />

        <input
          type="number"
          placeholder="Age"
          value={generalData.age}
          onChange={(e) =>
            setGeneralData({ ...generalData, age: e.target.value })
          }
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        />

        <input
          type="date"
          placeholder="Birthdate"
          value={generalData.birthdate}
          onChange={(e) =>
            setGeneralData({ ...generalData, birthdate: e.target.value })
          }
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        />

        <input
          type="text"
          placeholder="Birthplace"
          value={generalData.birthplace}
          onChange={(e) =>
            setGeneralData({ ...generalData, birthplace: e.target.value })
          }
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        />

        <input
          type="text"
          placeholder="Contact Number"
          value={generalData.contactNumber}
          onChange={(e) =>
            setGeneralData({ ...generalData, contactNumber: e.target.value })
          }
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        />

        <select
          value={generalData.gender}
          onChange={(e) =>
            setGeneralData({ ...generalData, gender: e.target.value })
          }
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        >
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>

        <select
          value={generalData.maritalStatus}
          onChange={(e) =>
            setGeneralData({ ...generalData, maritalStatus: e.target.value })
          }
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        >
          <option value="">Select Marital Status</option>
          <option value="Single">Single</option>
          <option value="Married">Married</option>
        </select>

        <input
          type="text"
          placeholder="Address"
          value={generalData.address}
          onChange={(e) =>
            setGeneralData({ ...generalData, address: e.target.value })
          }
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        />

        <input
          type="text"
          placeholder="Nationality"
          value={generalData.nationality}
          onChange={(e) =>
            setGeneralData({ ...generalData, nationality: e.target.value })
          }
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        />

        <input
          type="text"
          placeholder="Image URL"
          value={generalData.imageUrl}
          onChange={(e) =>
            setGeneralData({ ...generalData, imageUrl: e.target.value })
          }
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        />

        <input
          type="email"
          placeholder="Account Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        />

        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="submit-btn bg-primary_maroon text-white py-2 px-4 rounded hover:bg-highlight_pink transition duration-200"
          >
            Add Patient
          </button>
          <button
            onClick={onClose}
            className="cancel-btn bg-gray-300 text-black py-2 px-4 rounded hover:bg-gray-400 transition duration-200"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePatient;
