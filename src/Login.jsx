import { useState } from "react";
import { auth, database } from "./backend/firebase";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { ref, set, get } from "firebase/database";
import { sendVerificationEmail } from "./backend/verificationToken";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "./users/context/AuthContext"; 

const Login = () => {
  const { setCurrentUser } = useAuthContext();
  const [email, setEmail] = useState("");
  const [verifEmail, setVerifEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [forgotPassword, setForgotPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        await sendVerificationEmail(user);
        return;
      }
  
      let userRef;
      let userType = "";
      let role = "";
  
      const patientSnapshot = await get(ref(database, "patients/" + user.uid));
      if (patientSnapshot.exists()) {
        userRef = patientSnapshot;
        userType = "patients";
        role = "Patient";
      } else {
        const doctorSnapshot = await get(ref(database, "doctors/" + user.uid));
        if (doctorSnapshot.exists()) {
          userRef = doctorSnapshot;
          userType = "doctors";
          role = "Doctor";
        } else {
          const staffSnapshot = await get(ref(database, "staff/" + user.uid));
          if (staffSnapshot.exists()) {
            userRef = staffSnapshot;
            userType = "staff";
            role = staffSnapshot.val().role;
          } else {
            const superAdminSnapshot = await get(ref(database, "superadmins/" + user.uid));
            if (superAdminSnapshot.exists()) {
              userRef = superAdminSnapshot;
              userType = "superadmins";
              role = "Superadmin";
            }
          }
        }
      }
  
      if (!userRef) {
        setError("User does not exist in the database.");
        return;
      }
  
      const currDate = new Date().toLocaleString();
      const accountRef = ref(database, `${userType}/${user.uid}/account`);
      const accountSnapshot = await get(accountRef);
  
      if (!accountSnapshot.exists()) {
        await set(accountRef, {
          email: user.email,
          emailVerified: user.emailVerified,
          lastLogin: currDate,
        });
        console.log("New user data created.");
      } else {
        await set(accountRef, {
          ...accountSnapshot.val(),
          lastLogin: currDate,
        });
        console.log("Existing user data updated.");
      }
  
      setCurrentUser({ ...user, role, userType }); // Correct context usage
  
      if (role === "Information Desk Staff") {
        navigate("/infodesk-dashboard");
      } else if (role === "Philhealth Staff") {
        navigate("/philhealth-dashboard");
      } else if (role === "Superadmin") {
        navigate("/superadmin-dashboard");
      } else {
        setError("Unauthorized role.");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid login credentials or account doesn't exist.");
    }
  };

  const handleForgotPassword = async () => {
    try {
      await sendPasswordResetEmail(auth, verifEmail);
      alert("Password reset email sent.");
    } catch (err) {
      setError("Error sending password reset email. Please try again.");
    }
  };

  return (
    <div
      className="min-h-screen flex items-center bg-cover bg-center"
      style={{ backgroundImage: `url(${"/login-bg.png"})` }}
    >
      <div className="flex w-full sm:w-1/2 justify-center">
        <div className="max-w-md w-full">
          <div className="flex justify-center mb-10">
            <img src="/swumed-logo.png" alt="Logo" className="h-26" />
          </div>

          <div className="p-8 bg-black bg-opacity-5 shadow-lg rounded-lg max-w-md w-full">
            <h2 className="text-center text-3xl font-bold text-gray-800 mb-6">
              Login
            </h2>

            {error && <p className="text-red-500 text-center pb-2">{error}</p>}

            {/* Login Form */}
            <form onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="ml-2 text-gray-700 font-semibold"
                >
                  Email
                </label>
                <input
                  id="email"
                  className="block mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your Email"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor="password"
                  className="ml-2 text-gray-700 font-semibold"
                >
                  Password
                </label>
                <input
                  id="password"
                  className="block mt-1 w-full px-4 py-2 border border-gray-300 rounded-md"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your Password"
                />
              </div>

              <div className="ml-2 mt-2 text-gray-700 font-semibold">
                <button
                  onClick={() => setForgotPassword(true)}
                  className="underline hover:text-gray-900"
                  type="button"
                >
                  Forgot Password?
                </button>
              </div>

              <div className="mt-6 flex justify-center">
                <button
                  type="submit"
                  className="w-fit py-3 bg-[#8E0B16] hover:bg-red-700 text-white rounded-3xl px-6"
                >
                  Login
                </button>
              </div>
            </form>

            {/* Forgot Password Section */}
            {forgotPassword && (
              <div className="mt-4">
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
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleForgotPassword();
                      }
                    }}
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
      </div>
    </div>
  );
};

export default Login;
