import { useState, useEffect } from "react";
import Select from "react-select";
import {
  getDatabase,
  ref as dbRef,
  set,
  get,
  onValue,
} from "firebase/database";
import {
  ref as storageRef,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import { storage } from "../../../backend/firebase";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

import { TiArrowSortedDown } from "react-icons/ti";
import { IoMdCloudUpload } from "react-icons/io";

const CreateAccount = () => {
  // console.log(doctors)
  const [doctors, setDoctors] = useState([]);
  const [assignedDoctor, setAssignedDoctor] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    const db = getDatabase();
    const doctorsRef = dbRef(db, "doctors");

    const unsubscribe = onValue(doctorsRef, (snapshot) => {
      const doctorsData = snapshot.val();
      if (doctorsData) {
        const doctorList = Object.keys(doctorsData).map((doctorId) => ({
          id: doctorId,
          ...doctorsData[doctorId],
        }));
        setDoctors(doctorList);
      } else {
        setDoctors([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const [role, setRole] = useState("Information Desk Staff");
  const [status, setStatus] = useState("");
  const [branch, setBranch] = useState("Select Branch");
  const [branches, setBranches] = useState([]);
  const [specialty, setSpecialty] = useState("");
  const [providerType, setProviderType] = useState("");
  const [providers, setProviders] = useState([]);
  const [providerId, setProviderId] = useState("");
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
  const [imageFile, setImageFile] = useState(null);
  const [consultationDays, setConsultationDays] = useState("");
  const [fileName, setFileName] = useState("No file selected");
  const { signIn, signOutUser } = useAuthContext();
  const navigate = useNavigate();

  const adminEmail = import.meta.env.VITE_ADMIN_EMAIL;
  const adminPassword = import.meta.env.VITE_ADMIN_PASSWORD;

  const handleProviderChange = (selectedOption) => {
    setProviderId(selectedOption.value);
  };

  const handleAssignedDoctorChange = (selectedOption) => {
    setAssignedDoctor(selectedOption.value);
  };

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

  useEffect(() => {
    setBranch("Select Branch");
    setSpecialty("");
    setProviderType("");
    setProviderId("");
    setFirstName("");
    setLastName("");
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
    setStatus("");

    setProviders([]);
    setAssignedDoctor("");

    console.log("Role changed, resetting form...");
    console.log("providerId:", providerId);
    console.log("assignedDoctor:", assignedDoctor);
  }, [role]);

  const handleFileName = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFileName(file.name);
    } else {
      setFileName("No file selected");
    }
  };

  console.log(fileName);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const storageRfrnc = storageRef(storage, `doctors/${file.name}`);
      await uploadBytes(storageRfrnc, file);
      const url = await getDownloadURL(storageRfrnc);
      setImageFile(url);
    }
  };

  const handleFileChange = (e) => {
    handleImageUpload(e);
    handleFileName(e);
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
              healthcareProvider: {
                hospital_id: providerType === "hospital" ? providerId : null,
                clinic_id: providerType === "clinic" ? providerId : null,
                providerType,
                assignedDoctor: assignedDoctor,
                room: room,
                branch_id: branch,
              },
              status: "Admitted",
              dateAdmitted: new Date().toLocaleDateString("en-PH"),
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
            status: status,
          },
          specialty,
          firstName,
          lastName,
          imageUrl: imageFile,
          consultationDays,
          date: new Date().toLocaleDateString("en-PH"),
        };
      } else {
        dataToSave = {
          account: { email: user.email, emailVerified: false },
          hospital_id: providerType === "hospital" ? providerId : null,
          clinic_id: providerType === "clinic" ? providerId : null,
          branch_id: branch,
          firstName,
          lastName,
          role,
          contactNumber,
          date: new Date().toLocaleDateString("en-PH"),
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
      await signIn(adminEmail, adminPassword);

      navigate("/accounts");
      console.log(
        "Account created successfully in Authentication and Realtime Database!"
      );
    } catch (error) {
      console.error("Error creating account:", error);
    }
  };

  return (
    <div className="p-8 w-[1200px] mx-auto justify-center items-center place-content-center my-8">
      <div className="relative flex justify-end mb-6">
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="appearance-none bg-primary_maroon rounded-md text-white py-2 px-5 pr-9 select-none flex items-center cursor-pointer outline-none"
        >
          <option value="Information Desk Staff">InfoDesk Staff</option>
          <option value="Philhealth Staff">Philhealth Staff</option>
          <option value="Doctor">Doctor</option>
          <option value="patient">Patient</option>
        </select>
        <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
          <TiArrowSortedDown size={20} className="text-white" />
        </span>
      </div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div
            className={`grid ${
              role === "patient" ? "grid-cols-5" : "grid-cols-3"
            } gap-x-6 gap-y-4`}
          >
            <div className="flex flex-col">
              <label>Facility Type</label>
              <div className="relative justify-end">
                <select
                  value={providerType}
                  onChange={(e) => setProviderType(e.target.value)}
                  className="border pl-4 rounded-md p-2 cursor-pointer select-none w-full outline-none"
                  required
                >
                  <option value="">Select Facility Type</option>
                  <option value="hospital">Hospital</option>
                  <option value="clinic">Clinic</option>
                </select>
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                  <TiArrowSortedDown
                    size={20}
                    className="text-primary_maroon"
                  />
                </span>
              </div>
            </div>

            {/* <div className="flex flex-col">
              <label>Facility</label>
              <div className="relative justify-end">
                <select
                  value={providerId}
                  onChange={(e) => setProviderId(e.target.value)}
                  className="border rounded-md p-2 cursor-pointer w-full outline-none"
                  required
                >
                  <option value="">Select Facility</option>
                  {providers.map(([id, provider]) => (
                    <option key={id} value={id}>
                      {provider.name}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                  <TiArrowSortedDown
                    size={20}
                    className="text-primary_maroon"
                  />
                </span>
              </div>
            </div> */}

            <div className="flex flex-col">
              <label>Facility</label>
              <div className="relative justify-end">
                <Select
                  value={
                    providerId
                      ? providers.find((option) => option.value === providerId)
                      : null
                  }
                  // isClearable={true}
                  onChange={handleProviderChange}
                  options={providers.map(([id, provider]) => ({
                    value: id,
                    label: provider.name,
                  }))}
                  classNamePrefix="react-select"
                  placeholder="Select Facility"
                  className=""
                  styles={{
                    placeholder: (base) => ({
                      ...base,
                      // padding: "6px"
                    }),
                    control: (base, state) => ({
                      ...base,
                      borderRadius: "6px",
                      outline: "black",
                      border: state.isFocused
                        ? "1px solid #ccc"
                        : "1px solid #ccc",
                      // minHeight: "36px",
                    }),
                    valueContainer: (base) => ({
                      ...base,
                      paddingLeft: "12px",
                      padding: "4.5px",
                    }),
                    option: (base, state) => ({
                      ...base,
                      backgroundColor: state.isSelected
                        ? "#66181E"
                        : state.isFocused
                        ? "#f5eaea"
                        : "white",
                      color: state.isSelected ? "white" : "black",
                      ":active": {
                        backgroundColor: "#e0b3b3",
                      },
                      hover: {
                        cursor: "pointer",
                      },
                    }),
                    indicatorSeparator: () => ({
                      display: "none",
                    }),
                  }}
                />
                <span className="absolute right-[9px] top-1/2 transform -translate-y-1/2 cursor-pointer">
                  <TiArrowSortedDown
                    size={20}
                    className="text-primary_maroon"
                  />
                </span>
              </div>
            </div>

            <div className="flex flex-col">
              <label>Branch</label>
              <div className="relative justify-end">
                <select
                  value={branch}
                  onChange={(e) => setBranch(e.target.value)}
                  className="border pl-4 rounded-md p-2 cursor-pointer w-full outline-none"
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map(([id, branchData]) => (
                    <option key={id} value={id}>
                      {branchData.name}
                    </option>
                  ))}
                </select>
                <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                  <TiArrowSortedDown
                    size={20}
                    className="text-primary_maroon"
                  />
                </span>
              </div>
            </div>

            {role === "patient" && (
              <>
                {/* <div className="flex flex-col">
                  <label>Assigned Doctor</label>
                  <div className="relative justify-end">
                    <select
                      value={assignedDoctor}
                      onChange={(e) => setAssignedDoctor(e.target.value)}
                      className="border rounded-md p-2 cursor-pointer w-full outline-none"
                      required
                    >
                      <option value="">Select Doctor</option>

                      {doctors.map((doctor) => (
                        <option key={doctor.id} value={doctor.id}>
                          {doctor.firstName} {doctor.lastName} {" - "}{" "}
                          {doctor.specialty}
                        </option>
                      ))}
                    </select>
                    <span className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer">
                      <TiArrowSortedDown
                        size={20}
                        className="text-primary_maroon"
                      />
                    </span>
                  </div>
                </div> */}
                <div className="flex flex-col">
                  <label>Assigned Doctor</label>
                  <div className="relative justify-end">
                    <Select
                      value={
                        assignedDoctor
                          ? doctors.find(
                              (doctor) => doctor.id === assignedDoctor.value
                            )
                          : null
                      }
                      onChange={handleAssignedDoctorChange}
                      options={doctors.map((doctor) => ({
                        value: doctor.id,
                        label: `${doctor.firstName} ${doctor.lastName} - ${doctor.specialty}`,
                      }))}
                      classNamePrefix="react-select"
                      placeholder="Select Doctor"
                      styles={{
                        placeholder: (base) => ({
                          ...base,
                          // padding: "6px"
                        }),
                        control: (base, state) => ({
                          ...base,
                          borderRadius: "6px",
                          outline: "black",
                          border: state.isFocused
                            ? "1px solid #ccc"
                            : "1px solid #ccc",
                          // minHeight: "36px",
                        }),
                        valueContainer: (base) => ({
                          ...base,
                          paddingLeft: "12px",
                          padding: "4.5px",
                        }),
                        option: (base, state) => ({
                          ...base,
                          backgroundColor: state.isSelected
                            ? "#66181E"
                            : state.isFocused
                            ? "#f5eaea"
                            : "white",
                          color: state.isSelected ? "white" : "black",
                          ":active": {
                            backgroundColor: "#e0b3b3",
                          },
                          hover: {
                            cursor: "pointer",
                          },
                        }),
                        indicatorSeparator: () => ({
                          display: "none",
                        }),
                      }}
                    />
                    <span className="absolute right-[9px] top-1/2 transform -translate-y-1/2 cursor-pointer">
                      <TiArrowSortedDown
                        size={20}
                        className="text-primary_maroon"
                      />
                    </span>
                  </div>
                </div>

                <div className="flex flex-col">
                  <label>Room No.</label>
                  <input
                    type="text"
                    placeholder="Enter room no."
                    value={room}
                    onChange={(e) => setRoom(e.target.value)}
                    required
                    className="border rounded-md p-2"
                  />
                </div>
              </>
            )}
          </div>
          <div className="grid gap-x-6 gap-y-4">
            {/* Common Fields */}
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

              {role !== "patient" && role !== "Doctor" && (
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
              )}

              {role === "patient" && (
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
              )}

              {role === "Doctor" && (
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
              )}
            </div>

            <div
              className={`grid ${
                role === "patient" ? "grid-cols-3" : "grid-cols-2"
              } gap-x-6 gap-y-4`}
            >
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
              {role === "patient" && (
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
              )}
            </div>

            {role === "patient" && (
              <>
                <div className="grid grid-cols-3 gap-x-6 gap-y-4">
                  <div className="flex flex-col">
                    <label>Gender</label>
                    <div className="relative justify-end">
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        required
                        className="border rounded-md p-2 cursor-pointer select-none w-full outline-none"
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
                      className="border rounded-md p-2 cursor-default outline-none"
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
                        className="border rounded-md p-2 cursor-pointer select-none w-full outline-none"
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
              </>
            )}

            {role === "Doctor" && (
              <div className="grid grid-cols-3 gap-x-6 gap-y-4">
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
                  <label>Status</label>
                  <div className="relative justify-end">
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      required
                      className="border rounded-md p-2 cursor-pointer select-none w-full"
                    >
                      <option value="">Select Status</option>
                      <option value="Active">Active</option>
                      <option value="Visiting">Visiting</option>
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
                  <label>Profile Picture</label>
                  <div className="flex items-center p-2">
                    <input
                      type="file"
                      accept=".jpg, .jpeg, .png"
                      id="fileInput"
                      onChange={handleFileChange}
                      className="appearance-none hidden px-4"
                    />
                    <label className="" htmlFor="fileInput">
                      <i className="py-2 text-2xl cursor-pointer">
                        <IoMdCloudUpload />
                      </i>
                    </label>
                    <span className="px-2">{fileName}</span>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="flex justify-end">
            <button type="submit" className="main-button">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccount;
