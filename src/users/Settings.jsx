import { useEffect, useState } from "react";
import { MdPerson } from "react-icons/md";
// import { getAuth } from "firebase/auth";
import { getDatabase, ref, get } from "firebase/database";
import { sendPasswordResetEmail } from "firebase/auth";
import { useUserContext } from "./context/UserContext"; 

const Settings = () => {
  const { user } = useUserContext(); 
  const [verifEmail, setVerifEmail] = useState("");
  const [error, setError] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);

  const handleForgotPassword = async () => {
    if (user?.email === verifEmail) {
      try {
        await sendPasswordResetEmail(user.auth, verifEmail);
        alert("Password reset email sent.");
      } catch (err) {
        setError("Error sending password reset email. Please try again.");
      }
    } else {
      setError("Please enter the email you used for logging in.");
    }
  };

  const [userDetails, setUserDetails] = useState({
    fullName: "",
    phoneNumber: "",
    email: "",
    role: "",
  });

  useEffect(() => {
    const db = getDatabase();
    const userId = user?.uid; 

    if (userId) {
      const superadminRef = ref(db, `superadmins/${userId}`);
      const staffRef = ref(db, `staff/${userId}`);

      get(superadminRef).then((snapshot) => {
        if (snapshot.exists()) {
          const userData = snapshot.val();
          setUserDetails({
            fullName: userData.name || "N/A",
            phoneNumber: userData.number || "N/A",
            email: user.email, 
            role: userData.role || "N/A",
          });
        } else {
          get(staffRef).then((snapshot) => {
            if (snapshot.exists()) {
              const userData = snapshot.val();
              setUserDetails({
                fullName: userData.name || "N/A",
                phoneNumber: userData.number || "N/A",
                email: user.email, 
                role: userData.role || "N/A",
              });
            } else {
              console.log("No user data found.");
            }
          });
        }
      });
    }
  }, [user]); 

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 w-fit">
        <div className="flex items-center p-4 pl-8">
          <MdPerson className="text-lightgray" size={22} />
          <span className="ml-2 text-xl font-semibold">Personal Details</span>
        </div>
        <div className="flex justify-center items-center p-6">
          <div className="rounded-full bg-primary_maroon text-white p-6">
            <MdPerson size={100} />
          </div>
        </div>
        {error && <p className="text-red-500 text-center p-2">{error}</p>}
        <div>
          <div className="flex justify-between">
            <div className="flex flex-col p-4 px-20 pr-36">
              <h2 className="text-lightgray">Full Name</h2>
              <h2>{userDetails.fullName}</h2>
            </div>
            <div className="flex flex-col p-4 px-20">
              <h2 className="text-lightgray">Phone Number</h2>
              <h2>{userDetails.phoneNumber}</h2>
            </div>
          </div>

          <div className="flex flex-col p-4 px-20 pr-36">
            <h2 className="text-lightgray">Email</h2>
            <h2>{userDetails.email}</h2>
          </div>

          <div className="flex flex-col p-4 px-20 pr-36">
            <h2 className="text-lightgray">Role</h2>
            <h2>{userDetails.role}</h2>
          </div>
        </div>

        <div className="flex justify-end pt-2 pr-8">
          <button
            onClick={() => setForgotPassword(true)}
            className="flex items-center py-2 px-4 bg-primary_maroon text-white rounded-lg hover:bg-red-700"
          >
            Change Password
          </button>
        </div>

        {forgotPassword && (
          <div className="mt-4 px-20">
            <p className="text-center">
              Enter your email to receive a reset link:
            </p>
            <div className="mt-4">
              <input
                id="forgot-email"
                className="block w-full px-4 py-2 border border-gray-300 rounded-md"
                type="email"
                value={verifEmail}
                onChange={(e) => setVerifEmail(e.target.value)}
                placeholder="Enter your Email"
              />
            </div>
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleForgotPassword}
                className="w-fit py-3 bg-blue-500 hover:bg-blue-700 text-white rounded-3xl px-6"
              >
                Send Reset Link
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
