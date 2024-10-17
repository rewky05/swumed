import { useState } from "react";
import "ldrs/cardio";

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

  if (!userDetails)
    return (
      <div>
        <l-cardio
          size="50"
          stroke="4"
          speed="2"
          color="maroon"
        ></l-cardio>
      </div>
    );

  return (
    <div className="p-8 mx-auto justify-center items-center place-content-center my-6">
      <div className="max-w-xl bg-white rounded-lg shadow-md p-6 w-fit">
        <div className="flex items-center p-4">
          <MdPerson className="text-lightgray" size={22} />
          <span className="ml-2 text-lg font-semibold">Personal Details</span>
        </div>
        <div className="flex flex-col justify-center items-center p-3">
          <div className="rounded-full bg-primary_maroon text-white p-6">
            <MdPerson size={90} className="" />
          </div>
          <div className="pt-5 text-xl font-semibold">
            {userDetails.role.toUpperCase()}
          </div>
        </div>
        {error && <p className="text-red-500 text-center p-2">{error}</p>}
        <div className="flex m-4 mx-12 gap-x-6">
          <div className="">
            <div className="flex flex-col p-4">
              <h2 className="text-lightgray">Full Name</h2>
              <h2>
                {userDetails.firstName + " " + userDetails.lastName || "N/A"}
              </h2>
            </div>
            <div className="flex flex-col p-4">
              <h2 className="text-lightgray">Phone Number</h2>
              <h2>{userDetails.contactNumber || "N/A"}</h2>
            </div>
          </div>
          <div className="flex flex-col p-4">
            <h2 className="text-lightgray">Email</h2>
            <h2 className="">{currentUser?.email || "N/A"}</h2>
          </div>
        </div>

        <div className="flex justify-end pt-2 ">
          <button
            onClick={() => setForgotPassword(true)}
            className="main-button"
          >
            Change Password
          </button>
        </div>

        {forgotPassword && (
          <div className="mt-6 px-20">
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
              <button onClick={handleForgotPassword} className="main-button">
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
