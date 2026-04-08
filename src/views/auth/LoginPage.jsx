import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import axios from "../../services/axiosInstance";
import { Api } from "../../services/api";
import temple from "../../assets/images/temple2.png";
import StatusModal from "../../conponents/ui/StatusModal";
import { APP_VERSION } from "../../config/version";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loginError, setLoginError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [statusPopup, setStatusPopup] = useState({
    show: false,
    message: "",
    type: "error",
  });

  const [version, setVersion] = useState("");

  useEffect(() => {
    fetchVersion();
  }, []);

  const fetchVersion = async () => {
    try {
      const res = await axios.post(Api.version);

      setVersion(res.data.version);
    } catch (error) {
      console.error("Error fetching version:", error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (password.length < 6) {
      setStatusPopup({
        show: true,
        message: "Password should be at least 6 characters.",
        type: "error",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(Api.userlogin, {
        loginId: email,
        password: password,
      });

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("currentUser", JSON.stringify(response.data.user));

      // ✅ Pass state to dashboard so it knows to show the success modal
      navigate("/dashboard", { state: { loginSuccess: true } });
    } catch (error) {
      const msg =
        error.response?.data?.message || "Unable to connect to server.";
      setStatusPopup({ show: true, message: msg, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 via-gray-500 to-gray-900 p-4">
      <StatusModal
        isOpen={statusPopup.show}
        message={statusPopup.message}
        type={statusPopup.type}
        onClose={() => setStatusPopup({ ...statusPopup, show: false })}
      />

      <div className="w-full max-w-6xl flex items-center justify-between gap-12">
        {/* Login Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-10">
          <h2 className="text-4xl font-bold text-gray-800 text-center mb-8">
            Login
          </h2>

          {loginError && (
            <p className="text-red-500 text-sm mb-4">{loginError}</p>
          )}

          <form className="space-y-5" onSubmit={handleLogin}>
            {/* Username */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={20} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-14 pl-12 pr-4 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-orange-500"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock size={20} className="text-gray-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 pl-12 pr-12 rounded-lg bg-gray-50 border border-gray-300 focus:ring-2 focus:ring-orange-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {passwordError && (
                <p className="text-red-500 text-xs mt-1">{passwordError}</p>
              )}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-14 rounded-lg bg-orange-500 text-white text-lg font-semibold hover:bg-orange-600 transition shadow-lg cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
            <div className="text-md text-gray-500 px-4 py-3 text-center">
              (Version {version || APP_VERSION})
            </div>
          </form>
        </div>

        {/* Temple Image */}
        <div className="hidden lg:flex flex-1 items-center justify-center">
          <img
            src={temple}
            alt="Temple"
            className="max-w-full max-h-[500px] object-contain drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
