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
import { storage } from "../../../backend/firebase";

import { useUserContext } from "../../context/UserContext";
import { useAuthContext } from "../../context/AuthContext";
import { IoMdCloudUpload } from "react-icons/io";

const CreateDoctor = ({ onClose }) => {
  const { user } = useUserContext();
  const { currentUser } = useAuthContext();
  const { hospital_id, clinic_id, branch_id } = user;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [fileName, setFileName] = useState("No file selected");

  const [doctorData, setDoctorData] = useState({
    firstName: "",
    lastName: "",
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

  const handleFileName = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("No file selected");
    }
  };

  console.log(fileName);

  const handleFileChange = (e) => {
    handleImageUpload(e);
    handleFileName(e);
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
      const today = new Date().toLocaleDateString("en-PH");

      const newDoctor = {
        account: {
          email: secondaryAuth.currentUser.email,
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
        firstName: doctorData.firstName,
        lastName: doctorData.lastName,
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
    <div className="fixed inset-0 top-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-md w-[700px]">
        <h2 className="text-2xl font-bold text-primary_maroon mb-4">
          Add Doctor
        </h2>

        <div className="space-y-6">
          <div className="grid gap-x-6 gap-y-4">
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <input
                type="text"
                placeholder="First Name"
                value={doctorData.firstName}
                onChange={(e) =>
                  setDoctorData({ ...doctorData, firstName: e.target.value })
                }
                className="border rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Last Name"
                value={doctorData.lastName}
                onChange={(e) =>
                  setDoctorData({ ...doctorData, lastName: e.target.value })
                }
                className="border rounded-md p-2"
              />
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-md p-2"
              />

              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded-md p-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <input
                type="text"
                placeholder="Specialty"
                value={doctorData.specialty}
                onChange={(e) =>
                  setDoctorData({ ...doctorData, specialty: e.target.value })
                }
                className="border rounded-md p-2"
              />

              <input
                type="text"
                placeholder="Consultation Days"
                value={doctorData.consultationDays}
                onChange={(e) =>
                  setDoctorData({
                    ...doctorData,
                    consultationDays: e.target.value,
                  })
                }
                className="border rounded-md p-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col">
                <label>Profile Picture</label>
                <div className="flex items-center p-2">
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    id="fileInput"
                    onChange={handleFileChange}
                    className="appearance-none hidden px-14"
                  />
                  <label className="" htmlFor="fileInput">
                    <i className="py-2 text-3xl cursor-pointer">
                      <IoMdCloudUpload />
                    </i>
                  </label>
                  <span className="px-2">{fileName}</span>
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <button onClick={onClose} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleSubmit} className="main-button">
                Add Doctor
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateDoctor;
