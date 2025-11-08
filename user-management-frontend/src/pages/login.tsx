import { useState } from "react";
import Loading from "../components/Loading";
import axios from "axios";
import { toast } from "react-toastify";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VisibilityOffOutlinedIcon from "@mui/icons-material/VisibilityOffOutlined";

interface LoginResponse {
  token: string;
  message: string;
}

const Login = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const baseURL = import.meta.env.VITE_BACKEND_URL as string;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !password) {
      toast.warn("Please fill in both fields");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post<LoginResponse>(`${baseURL}/api/v1/login`, { name, password });
      localStorage.setItem("token", response.data.token);
      toast.success(response.data.message || "Login successful!");
    } catch (err) {
      console.error("Login failed:", err);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex justify-center items-center bg-gray-100 relative">
      {loading && (
        <div className="absolute inset-0 bg-white/70 flex justify-center items-center z-10">
          <Loading />
        </div>
      )}
      <div className="w-[650px] h-[400px] bg-white rounded flex shadow-lg overflow-hidden">
        <div className="w-1/2 flex flex-col items-center justify-center gap-6">
          <h1 className="text-3xl font-bold text-gray-900 text-center">Login</h1>
          <form onSubmit={handleLogin} className="flex flex-col items-center gap-4 p-4 w-full">
            <div className="w-full">
              <label htmlFor="name" className="text-sm">Name</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border bg-gray-200 border-none rounded p-2 w-full"
              />
            </div>

            <div className="w-full relative">
              <label htmlFor="password" className="text-sm">Password</label>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border bg-gray-200 border-none rounded p-2 w-full pr-8"
              />
              {showPassword ? (
                <VisibilityOutlinedIcon
                  fontSize="small"
                  className="absolute right-2 top-9 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(false)}
                />
              ) : (
                <VisibilityOffOutlinedIcon
                  fontSize="small"
                  className="absolute right-2 top-9 cursor-pointer text-gray-600"
                  onClick={() => setShowPassword(true)}
                />
              )}
            </div>

            <button
              type="submit"
              className="bg-[#FF464D] px-8 py-2 rounded-full hover:bg-[#fd708f] transition text-gray-50 cursor-pointer"
            >
              Login
            </button>
          </form>
        </div>
        <div className="w-1/2 bg-gradient-to-r from-[#FF464D] to-[#FF4169] text-gray-50 flex flex-col justify-center items-center p-6 rounded-r text-center">
          <h2 className="text-3xl font-bold mb-4 drop-shadow-md">Welcome Back!</h2>
          <p className="mb-4 drop-shadow-md">Please enter your credentials to access your account</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
