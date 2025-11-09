import { Route, Routes } from "react-router-dom"
import Login from "./pages/login"
import Admin from "./pages/admin/Admin"
import User from "./pages/user/User"


function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/user" element={<User />} />
      </Routes>
    </div>
  )
}

export default App
