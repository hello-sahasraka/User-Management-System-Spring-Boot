import { useEffect, useState } from "react";
import logo from "../assets/logo.png";
import userIcon from "../assets/user_icon.png";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface User {
  name: string;
  roles: string;
  image?: string;
}

const NavBar = () => {
  const [name, setName] = useState("Empty User");
  const [image, setImage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser) as User;
      setName(parsedUser.name || "");
      setImage(parsedUser.image || "");
    }
  }, []);

  const handleLogOut = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    navigate("/")
  }

  return (
    <nav
      className="h-16 w-full bg-gradient-to-r from-[#FF464D] to-[#FF4169]
      text-gray-50 shadow-md flex items-center justify-between px-6 sm:px-12"
    >
      {/* --- Logo --- */}
      <img src={logo} alt="Logo" className="h-10 sm:h-[50px] shadow-sm" />

      {/* --- User Info (hidden on very small screens) --- */}
      <div className="hidden sm:flex w-auto sm:w-[300px] justify-center items-center gap-2">
        <img
          src={image || userIcon}
          alt="User"
          className="h-8 sm:h-10 rounded-full object-cover"
        />
        <span className="font-semibold text-sm sm:text-base truncate max-w-[120px] sm:max-w-none">
          {name}
        </span>
      </div>

      {/* --- Logout Button --- */}
      <button
        className="bg-gray-50 hover:bg-gray-100 transition duration-200 
        text-[#FF4169] font-semibold py-1.5 sm:py-2 px-3 sm:px-4 
        rounded-md cursor-pointer text-sm sm:text-base"
        onClick={handleLogOut}
      >
        LogOut
      </button>
    </nav>
  );
};

export default NavBar;
