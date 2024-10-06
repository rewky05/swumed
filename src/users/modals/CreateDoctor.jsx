import { useState } from "react";
import { push, ref, set } from "firebase/database";
import { database } from "../../backend/firebase";

const CreateDoctor = ({ showModal, setShowModal }) => {
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    email: "",
    consultationDays: "",
    specialty: "",
    imageUrl: "",
    branch_id: "",
    hospital_id: "",
    providerType: "hospital", 
  });

  const handleNewDoctorChange = (e) => {
    const { name, value } = e.target;
    setNewDoctor((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDoctor = async () => {
    const newDoctorRef = push(ref(database, "doctors"));
    await set(newDoctorRef, {
      name: newDoctor.name,
      account: { email: newDoctor.email },
      consultationDays: newDoctor.consultationDays,
      specialty: newDoctor.specialty,
      imageUrl: newDoctor.imageUrl,
      healthcareProvider: {
        branch_id: newDoctor.branch_id,
        hospital_id: newDoctor.hospital_id,
        providerType: newDoctor.providerType,
      },
    });
    setShowModal(false); 
  };

  return (
    showModal && (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-md shadow-md w-[650px]">
          <h2 className="text-xl mb-4">Add New Doctor</h2>
          <input
            type="text"
            name="name"
            value={newDoctor.name}
            onChange={handleNewDoctorChange}
            placeholder="Doctor's Name"
            className="border p-2 w-full mb-2"
          />
          <input
            type="email"
            name="email"
            value={newDoctor.email}
            onChange={handleNewDoctorChange}
            placeholder="Email"
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            name="consultationDays"
            value={newDoctor.consultationDays}
            onChange={handleNewDoctorChange}
            placeholder="Consultation Days"
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            name="specialty"
            value={newDoctor.specialty}
            onChange={handleNewDoctorChange}
            placeholder="Specialty"
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            name="imageUrl"
            value={newDoctor.imageUrl}
            onChange={handleNewDoctorChange}
            placeholder="Image URL"
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            name="branch_id"
            value={newDoctor.branch_id}
            onChange={handleNewDoctorChange}
            placeholder="Branch ID"
            className="border p-2 w-full mb-2"
          />
          <input
            type="text"
            name="hospital_id"
            value={newDoctor.hospital_id}
            onChange={handleNewDoctorChange}
            placeholder="Hospital ID"
            className="border p-2 w-full mb-4"
          />
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 bg-gray-500 text-white rounded-md"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </button>
            <button
              className="px-4 py-2 bg-primary_maroon text-white rounded-md"
              onClick={handleSaveDoctor}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default CreateDoctor;
