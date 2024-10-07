import { useState } from "react";
import { getDatabase, ref as dbRef, set } from "firebase/database";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { storage } from "../../backend/firebase";

import { useUserContext } from "../context/UserContext";
import { useAuthContext } from "../context/AuthContext";

const CreateDoctor = ({ onClose }) => {
  const { user } = useUserContext();
  const { currentUser } = useAuthContext();
  const { hospital_id, clinic_id, branch_id } = user;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);


  const [doctorData, setDoctorData] = useState({
    name: "",
    specialty: "",
    consultationDays: "",
    imageUrl: imageFile,
  });

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRfrnc = storageRef(storage, `doctors/${file.name}`);
      await uploadBytes(storageRfrnc, file);
      const url = await getDownloadURL(storageRfrnc);
      setImageFile(url);
    }
  };

  const handleSubmit = async () => {
    const db = getDatabase();
    const auth = getAuth();

    try {
      const currentEmail = currentUser.email;
      const currentPassword = prompt(
        "Please enter your password for re-authentication"
      );

      const secondaryAuth = getAuth();
      await createUserWithEmailAndPassword(secondaryAuth, email, password);

      const doctorId = secondaryAuth.currentUser.uid;
      const today = new Date().toLocaleDateString("en-US");

      const newDoctor = {
        account: {
          email,
        },
        consultationDays: doctorData.consultationDays,
        date: today,
        healthcareProvider: {
          branch_id,
          clinic_id: clinic_id || null,
          hospital_id: hospital_id || null,
          providerType: clinic_id ? "clinic" : "hospital",
        },
        imageUrl: imageFile,
        name: doctorData.name,
        specialty: doctorData.specialty,
      };

      await set(dbRef(db, `doctors/${doctorId}`), newDoctor);
      console.log("Doctor created:", newDoctor);

      const doctorPath = `${clinic_id ? "clinics" : "hospitals"}/${
        clinic_id ? clinic_id : hospital_id
      }/branch/${branch_id}/doctors/${doctorId}`;
      await set(dbRef(db, doctorPath), true);

      await signOut(secondaryAuth);

      await signInWithEmailAndPassword(auth, currentEmail, currentPassword);

      // onClose();
    } catch (error) {
      console.error("Error creating doctor:", error);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="modal-content bg-white rounded-lg p-6 shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-primary_maroon mb-4">
          Add Doctor
        </h2>

        <input
          type="text"
          placeholder="Doctor's Name"
          value={doctorData.name}
          onChange={(e) =>
            setDoctorData({ ...doctorData, name: e.target.value })
          }
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        />

        <input
          type="text"
          placeholder="Specialty"
          value={doctorData.specialty}
          onChange={(e) =>
            setDoctorData({ ...doctorData, specialty: e.target.value })
          }
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        />

        <input
          type="text"
          placeholder="Consultation Days"
          value={doctorData.consultationDays}
          onChange={(e) =>
            setDoctorData({ ...doctorData, consultationDays: e.target.value })
          }
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        />

        {/* <input
          type="text"
          placeholder="Image URL"
          value={doctorData.imageUrl}
          onChange={(e) =>
            setDoctorData({ ...doctorData, imageUrl: e.target.value })
          }
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        /> */}

        <div className="flex flex-col">
          <label>Profile Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="border rounded-md p-2"
          />
        </div>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input-field mb-3 p-2 border border-gray-300 rounded focus:outline-none focus:ring focus:ring-highlight_pink"
        />

        <div className="flex justify-between">
          <button
            onClick={handleSubmit}
            className="submit-btn bg-primary_maroon text-white py-2 px-4 rounded hover:bg-highlight_pink transition duration-200"
          >
            Add Doctor
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

export default CreateDoctor;
