import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Inputs";
import ProfilePhotoSelector from "../../components/Inputs/profilePhotoSelector";
import { validateEmail } from "../../Utils/helper";
import axiosInstance from "../../Utils/axiosInstance";
import { UserContext } from "../../context/userContext";
import uploadImage from "../../Utils/uploadImage";
import { API_PATH } from "../../Utils/apiPath";

const SignUp = ({ setCurrentPage }) => {
  const [profilePic, setProfilePic] = useState("");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    let profileImageUrl = "";

    if (!fullName) {
      setError("Invalid full name");
      return;
    }

    if (!validateEmail(email)) {
      setError("Invalid email");
      return;
    }

    if (!password) {
      setError("Invalid password");
      return;
    }

    setError("");

    try {
      setLoading(true); // start loader

      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const response = await axiosInstance.post(API_PATH.AUTH.REGISTER, {
        name: fullName,
        email,
        password,
        profileImageUrl,
      });

      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);
        navigate("/dashboard");
      }
    } catch (error) {
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false); // stop loader
    }
  };

  return (
    <div className="w-[90vw] md:w-[50vw] p-2 flex flex-col justify-center mx-auto mt-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-2">Create Account</h3>
      <p className="text-sm text-gray-500 mb-6">Join us to get started</p>

      <form onSubmit={handleSignUp} className="flex flex-col gap-4">
        <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />

        <Input
          value={fullName}
          onChange={setFullName}
          label="Full Name"
          type="text"
          placeholder="Enter your full name"
        />

        <Input
          value={email}
          onChange={setEmail}
          label="Email"
          type="email"
          placeholder="Enter your email"
        />

        <Input
          value={password}
          onChange={setPassword}
          label="Password"
          type="password"
          placeholder="Enter your password"
        />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white font-semibold px-6 py-2.5 rounded-full shadow-lg transition-all duration-300 ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105 hover:shadow-2xl"
          }`}
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 md:h-6 md:w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span className="text-sm md:text-base">Signing up...</span>
            </>
          ) : (
            "Sign Up"
          )}
        </button>

        <p className="text-sm text-gray-500 mt-2 text-center">
          Already have an account?{" "}
          <span
            className="text-purple-600 font-semibold cursor-pointer hover:underline"
            onClick={() => setCurrentPage("login")}
          >
            Login
          </span>
        </p>
      </form>
    </div>
  );
};

export default SignUp;
