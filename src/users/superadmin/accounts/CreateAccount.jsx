import { useState, useEffect } from "react";
import { getDatabase, ref as dbRef, set, get } from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import {
  getAuth,
  createUserWithEmailAndPassword,
  // signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext"; 
import { storage } from "../../../backend/firebase";
import { TiArrowSortedDown } from "react-icons/ti";

const CreateAccount = () => {
  const [role, setRole] = useState("patient");
  const [branch, setBranch] = useState("Select Branch");
  const [branches, setBranches] = useState([]);
  const [specialty, setSpecialty] = useState("");
  const [providerType, setProviderType] = useState("");
  const [providers, setProviders] = useState([]);
  const [providerId, setProviderId] = useState("");
  const [name, setName] = useState("");
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
  const [imageFile, setImageFile] = useState(null);
  const [consultationDays, setConsultationDays] = useState("");
  const { signIn, signOutUser } = useAuthContext(); 
  const navigate = useNavigate();

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  useEffect(() => {
    setBranch("Select Branch");
    setSpecialty("");
    setProviderType("");
    setProviderId("");
    setName("");
    setEmail("");
    setPassword("");
    setPhilhealthNumber("");
    setAddress("");
    setAge("");
    setGender("");
    setBirthdate("");
    setBirthplace("");
    setContactNumber("");
    setMaritalStatus("");
    setNationality("");
    setImageFile(null);
    setConsultationDays("");
  }, [role]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRfrnc = storageRef(storage, `doctors/${file.name}`);
      await uploadBytes(storageRfrnc, file);
      const url = await getDownloadURL(storageRfrnc);
      setImageFile(url);
    }
  };

  useEffect(() => {
    const db = getDatabase();
    const fetchProviders = async () => {
      const refPath = providerType === "clinic" ? "clinics" : "hospitals";
      const providersRef = dbRef(db, refPath);
      const snapshot = await get(providersRef);
      if (snapshot.exists()) {
        const data = snapshot.val();
        setProviders(Object.entries(data));
      }
    };

    if (providerType) fetchProviders();
  }, [providerType]);

  useEffect(() => {
    const db = getDatabase();
    const fetchBranches = async () => {
      if (providerId) {
        const branchesRef = dbRef(
          db,
          `${
            providerType === "clinic" ? "clinics" : "hospitals"
          }/${providerId}/branch`
        );
        const snapshot = await get(branchesRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          setBranches(Object.entries(data));
        }
      }
    };

    fetchBranches();
  }, [providerId, providerType]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const db = getDatabase();

    if (!providerId) {
      alert("Please select a provider.");
      return;
    }

    try {
      await signIn(adminEmail, adminPassword);

      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      let dataToSave;
      let i = 1;
      const medicalRecordId = `MR-${i++}`;

      if (role === "patient") {
        dataToSave = {
          account: { email: user.email },
          generalData: {
            philhealthNumber,
            name,
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
              healthcareProvider: {
                hospital_id: providerType === "hospital" ? providerId : null,
                clinic_id: providerType === "clinic" ? providerId : null,
                providerType,
                assignedDoctor: "",
                branch_id: branch,
              },
              status: "active",
              date: new Date().toLocaleDateString("en-PH"),
              isHidden: false,
            },
          },
          qrCode: "",
        };
      } else if (role === "Doctor") {
        dataToSave = {
          account: { email: user.email },
          healthcareProvider: {
            hospital_id: providerType === "hospital" ? providerId : null,
            clinic_id: providerType === "clinic" ? providerId : null,
            providerType,
            branch_id: branch,
          },
          specialty,
          name,
          imageUrl: imageFile,
          consultationDays,
        };
      } else {
        dataToSave = {
          account: { email: user.email },
          hospital_id: providerType === "hospital" ? providerId : null,
          clinic_id: providerType === "clinic" ? providerId : null,
          branch_id: branch,
          name,
          role,
        };
      }

      const rolePath =
        role === "patient"
          ? "patients"
          : role === "Doctor"
          ? "doctors"
          : "staff";
      await set(dbRef(db, `${rolePath}/${user.uid}`), dataToSave);

      const providerRefPath = `${
        providerType === "clinic" ? "clinics" : "hospitals"
      }/${providerId}/branch/${branch}/${rolePath}/${user.uid}`;
      await set(dbRef(db, providerRefPath), true);

      await signOutUser();
      await signInWithEmailAndPassword(auth, adminEmail, adminPassword);

      navigate("/superadmin-dashboard");
      console.log(
        "Account created successfully in Authentication and Realtime Database!"
      );
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="relative flex justify-end mb-6">
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="appearance-none bg-primary_maroon rounded-md text-white py-2 px-5 pr-7 flex items-center"
          >
            <option value="Information Desk Staff">Information Desk Staff</option>
            <option value="Philhealth Staff">Philhealth Staff</option>
            <option value="Doctor">Doctor</option>
            <option value="patient">Patient</option>
          </select>
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
            <TiArrowSortedDown size={20} className="text-white" />
          </span>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {/* Fields for Patient Role */}
            {role === "patient" && (
              <>
                <div className="flex flex-col">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border rounded-md p-2"
                  />
                </div>

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

                <div className="flex flex-col">
                  <label>Age</label>
                  <input
                    type="number"
                    placeholder="Enter age"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    required
                    className="border rounded-md p-2"
                  />
                </div>

                <div className="flex flex-col">
                  <label>Gender</label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    required
                    className="border rounded-md p-2"
                  >
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label>Birthdate</label>
                  <input
                    type="date"
                    value={birthdate}
                    onChange={(e) => setBirthdate(e.target.value)}
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

                <div className="flex flex-col">
                  <label>Marital Status</label>
                  <select
                    value={maritalStatus}
                    onChange={(e) => setMaritalStatus(e.target.value)}
                    required
                    className="border rounded-md p-2"
                  >
                    <option value="">Select Marital Status</option>
                    <option value="Single">Single</option>
                    <option value="Married">Married</option>
                    <option value="Divorced">Divorced</option>
                    <option value="Widowed">Widowed</option>
                  </select>
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
              </>
            )}

            {/* Fields for Doctor Role */}
            {role === "Doctor" && (
              <>
                <div className="flex flex-col">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border rounded-md p-2"
                  />
                </div>

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
                  <label>Provider Type</label>
                  <select
                    value={providerType}
                    onChange={(e) => setProviderType(e.target.value)}
                    className="border rounded-md p-2"
                    required
                  >
                    <option value="">Select Provider Type</option>
                    <option value="hospital">Hospital</option>
                    <option value="clinic">Clinic</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label>Provider</label>
                  <select
                    value={providerId}
                    onChange={(e) => setProviderId(e.target.value)}
                    className="border rounded-md p-2"
                    required
                  >
                    <option value="">Select Provider</option>
                    {providers.map(([id, data]) => (
                      <option key={id} value={id}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label>Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="border rounded-md p-2"
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label>Specialty</label>
                  <input
                    type="text"
                    placeholder="Enter specialty"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    className="border rounded-md p-2"
                    required
                  />
                </div>

                <div className="flex flex-col">
                  <label>Consultation Days</label>
                  <input
                    type="text"
                    placeholder="Enter consultation days"
                    value={consultationDays}
                    onChange={(e) => setConsultationDays(e.target.value)}
                    className="border rounded-md p-2"
                  />
                </div>

                <div className="flex flex-col">
                  <label>Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="border rounded-md p-2"
                  />
                </div>
              </>
            )}

            {/* Fields for Staff Role */}
            {(role === "Information Desk Staff" || role === "Philhealth Staff") && (
              <>
                <div className="flex flex-col">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Enter name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    className="border rounded-md p-2"
                  />
                </div>

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
                  <label>Provider Type</label>
                  <select
                    value={providerType}
                    onChange={(e) => setProviderType(e.target.value)}
                    className="border rounded-md p-2"
                    required
                  >
                    <option value="">Select Provider Type</option>
                    <option value="hospital">Hospital</option>
                    <option value="clinic">Clinic</option>
                  </select>
                </div>

                <div className="flex flex-col">
                  <label>Provider</label>
                  <select
                    value={providerId}
                    onChange={(e) => setProviderId(e.target.value)}
                    className="border rounded-md p-2"
                    required
                  >
                    <option value="">Select Provider</option>
                    {providers.map(([id, data]) => (
                      <option key={id} value={id}>
                        {data.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex flex-col">
                  <label>Branch</label>
                  <select
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="border rounded-md p-2"
                    required
                  >
                    <option value="">Select Branch</option>
                    {branches.map(([id, name]) => (
                      <option key={id} value={id}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </>
            )}

            {/* Common Fields */}
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
          </div>

          <button
            type="submit"
            className="bg-primary_maroon text-white py-2 px-4 rounded-md"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
