import { useState } from "react";
import { MdPerson } from "react-icons/md";
import { useAuthContext } from "./context/AuthContext"; 
import { useUserContext } from "./context/UserContext";  
import { sendPasswordResetEmail } from "firebase/auth";

const Settings = () => {
  const { currentUser } = useAuthContext(); 
  const { user: userDetails } = useUserContext(); 
  const [verifEmail, setVerifEmail] = useState("");
  const [error, setError] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);

  const handleForgotPassword = async () => {
    if (currentUser?.email === verifEmail) {
      try {
        await sendPasswordResetEmail(currentUser.auth, verifEmail);
        alert("Password reset email sent.");
      } catch (err) {
        setError("Error sending password reset email. Please try again.");
      }
    } else {
      setError("Please enter the email you used for logging in.");
    }
  };

  if (!userDetails) return <p>Loading...</p>;

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-6 w-fit">
        <div className="flex items-center p-4 pl-8">
          <MdPerson className="text-lightgray" size={22} />
          <span className="ml-2 text-xl font-semibold">Personal Details</span>
        </div>
        <div className="flex justify-center items-center p-6">
          <div className="rounded-full bg-primary_maroon text-white p-6">
            <MdPerson size={100} className="" />
          </div>
        </div>
        {error && <p className="text-red-500 text-center p-2">{error}</p>}
        <div>
          <div className="flex justify-between">
            <div className="flex flex-col p-4 px-20 pr-36">
              <h2 className="text-lightgray">Full Name</h2>
              <h2>{userDetails.name || "N/A"}</h2>
            </div>
            <div className="flex flex-col p-4 px-20">
              <h2 className="text-lightgray">Phone Number</h2>
              <h2>{userDetails.number || "N/A"}</h2>
            </div>
          </div>

          <div className="flex flex-col p-4 px-20 pr-36">
            <h2 className="text-lightgray">Email</h2>
            <h2 className="">{currentUser?.email || "N/A"}</h2>
          </div>

          <div className="flex flex-col p-4 px-20 pr-36">
            <h2 className="text-lightgray">Role</h2>
            <h2 className="">{userDetails.role || "N/A"}</h2>
          </div>
        </div>

        <div className="flex justify-end pt-2 pr-8">
          <button
            onClick={() => setForgotPassword(true)}
            className="main-button"
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
