import { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { useUserContext } from "../../context/UserContext";
import { useAuthContext } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import { TiArrowSortedDown } from "react-icons/ti";

const CreatePatient = ({ onClose }) => {
  const { user } = useUserContext();
  const auth = getAuth();

  const { hospital_id, clinic_id, branch_id, providerType } = user;
  console.log(hospital_id, clinic_id, branch_id, providerType);

  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [philhealthNumber, setPhilhealthNumber] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [birthdate, setBirthdate] = useState("");
  const [birthplace, setBirthplace] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [maritalStatus, setMaritalStatus] = useState("");
  const [nationality, setNationality] = useState("");

  const { signIn, signOutUser } = useAuthContext();
  const navigate = useNavigate();

  const handleBirthdateChange = (e) => {
    const selectedDate = e.target.value;
    setBirthdate(selectedDate);
    calculateAge(selectedDate);
  };

  const calculateAge = (birthdate) => {
    const birthDateObj = new Date(birthdate);
    const currentDate = new Date();

    let age = currentDate.getFullYear() - birthDateObj.getFullYear();
    const monthDifference = currentDate.getMonth() - birthDateObj.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && currentDate.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    setAge(age);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentPassword = prompt("Please enter your current password:");

    if (email) {
      const db = getDatabase();
      const currentUser = auth.currentUser;
      const originalEmail = currentUser.email;

      try {
        // await signIn(auth, originalEmail, currentPassword);
        // const credential = EmailAuthProvider.credential(
        //   originalEmail,
        //   currentPassword
        // );
        // await reauthenticateWithCredential(currentUser, credential);

        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );

        const user = userCredential.user;

        let i = 1;
        const medicalRecordId = `MR-${i++}`;

        const newPatient = {
          account: { email: user.email },
          generalData: {
            philhealthNumber,
            firstName,
            lastName,
            address,
            age,
            gender,
            birthdate,
            birthplace,
            contactNumber,
            maritalStatus,
            nationality,
          },
          medicalRecords: {
            [medicalRecordId]: {
              date: new Date().toLocaleDateString("en-PH"),
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
          qrCode: "",
        };

        await set(ref(db, `patients/${user.uid}`), newPatient);
        const providerRefPath = `${
          providerType === "clinic" ? "clinics" : "hospitals"
        }/${
          providerType === "clinic" ? clinic_id : hospital_id
        }/branch/${branch_id}/patients/${user.uid}`;
        await set(ref(db, providerRefPath), true);

        await signOutUser();
        await signIn(originalEmail, currentPassword);
        navigate("/infodesk-dashboard");
        console.log(
          "Account created successfully in Authentication and Realtime Database!"
        );
        // onClose();
      } catch (error) {
        console.error("Error creating account:", error);
        alert("Error: " + error.message);
      }
    } else {
      alert("Password input canceled or empty.");
    }
  };

  return (
    <div className="fixed inset-0 top-20 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-6 shadow-md w-[950px] my-8">
        <h2 className="text-2xl font-bold text-primary_maroon mb-4">
          Add Patient
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-x-6 gap-y-4">
            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              <div className="flex flex-col">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="Enter first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="border rounded-md p-2"
                />
              </div>
              <div className="flex flex-col">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Enter last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  className="border rounded-md p-2"
                />
              </div>
              <div className="flex flex-col">
                <label>Philhealth Number</label>
                <input
                  type="text"
                  placeholder="Enter Philhealth number"
                  value={philhealthNumber}
                  onChange={(e) => setPhilhealthNumber(e.target.value)}
                  required
                  className="border rounded-md p-2"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              <div className="flex flex-col">
                <label>Email</label>
                <input
                  type="email"
                  placeholder="Enter email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="border rounded-md p-2"
                />
              </div>

              <div className="flex flex-col">
                <label>Password</label>
                <input
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="border rounded-md p-2"
                />
              </div>
              <div className="flex flex-col">
                <label>Contact Number</label>
                <input
                  type="tel"
                  placeholder="Enter contact number"
                  value={contactNumber}
                  onChange={(e) => setContactNumber(e.target.value)}
                  required
                  className="border rounded-md p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-x-6 gap-y-4">
              <div className="flex flex-col">
                <label>Gender</label>
                <div className="relative justify-end">
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="border rounded-md p-2 cursor-pointer select-none w-full"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    <TiArrowSortedDown
                      size={20}
                      className="text-primary_maroon"
                    />
                  </span>
                </div>
              </div>

              <div className="flex flex-col">
                <label>Birthdate</label>
                <input
                  type="date"
                  value={birthdate}
                  onChange={handleBirthdateChange}
                  required
                  className="border rounded-md p-2"
                />
              </div>

              <div className="flex flex-col">
                <label>Age</label>
                <input
                  type="number"
                  placeholder="Age"
                  value={age}
                  readOnly
                  className="border rounded-md p-2 cursor-default"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col">
                <label>Address</label>
                <input
                  type="text"
                  placeholder="Enter address"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                  className="border rounded-md p-2"
                />
              </div>
              <div className="flex flex-col">
                <label>Birthplace</label>
                <input
                  type="text"
                  placeholder="Enter birthplace"
                  value={birthplace}
                  onChange={(e) => setBirthplace(e.target.value)}
                  required
                  className="border rounded-md p-2"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              <div className="flex flex-col">
                <label>Marital Status</label>
                <div className="relative justify-end">
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    required
                    className="border rounded-md p-2 cursor-pointer select-none w-full"
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                    <TiArrowSortedDown
                      size={20}
                      className="text-primary_maroon"
                    />
                  </span>
                </div>
              </div>
              <div className="flex flex-col">
                <label>Nationality</label>
                <input
                  type="text"
                  placeholder="Enter nationality"
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  required
                  className="border rounded-md p-2"
                />
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button onClick={onClose} className="cancel-button">
              Cancel
            </button>
            <button type="submit" className="main-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePatient;
