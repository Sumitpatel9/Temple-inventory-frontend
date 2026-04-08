import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import axios from "../../../services/axiosInstance";
import { Api } from "../../../services/api";
import StatusModal from "../../../conponents/ui/StatusModal";
import { APP_VERSION } from "../../../config/version";
import temple from "../../../assets/images/temple2.png";

const MobileLoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
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

      navigate("/dashboard-m", { state: { loginSuccess: true } });
    } catch (error) {
      const msg =
        error.response?.data?.message || "Unable to connect to server.";
      setStatusPopup({ show: true, message: msg, type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 px-4">
      <StatusModal
        isOpen={statusPopup.show}
        message={statusPopup.message}
        type={statusPopup.type}
        onClose={() => setStatusPopup({ ...statusPopup, show: false })}
      />

      <div className="w-full max-w-sm">
        {/* Temple Logo on Top */}
        <div className="flex justify-center mb-6">
          <img
            src={temple}
            alt="Temple"
            className="w-100 h-auto object-contain drop-shadow-xl -mt-20"
          />
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-1">Login</h2>
          <p className="text-xs text-gray-500 mb-6">
            Please enter your login details.
          </p>

          <form className="space-y-4" onSubmit={handleLogin}>
            {/* Username */}
            <div className="relative">
              <User
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-11 pl-10 pr-3 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition"
                required
              />
            </div>

            {/* Password */}
            <div className="relative">
              <Lock
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-11 pl-10 pr-10 rounded-lg border border-gray-200 bg-gray-50 text-sm focus:ring-2 focus:ring-orange-500 outline-none transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-orange-500 text-white rounded-lg font-semibold text-sm hover:bg-orange-600 transition disabled:bg-gray-400 mt-2"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            {/* Version */}
            <p className="text-center text-xs text-gray-400 mt-2">
              Version {version || APP_VERSION}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MobileLoginPage;
