import { useEffect, useState } from "react";
import AdminTable from "../../components/AdminTable"
import NavBar from "../../components/NavBar"
import axios from "axios";
import { toast } from "react-toastify";
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import AddUser from "../../components/AddUser";
import Loading from "../../components/Loading";

const baseURL = import.meta.env.VITE_BACKEND_URL as string;


interface Person {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
  phone: string;
  image?: string;
  roles: string;
}

interface NewUser {
  name: string;
  email: string;
  role: string;
  address: string;
  phone: string;
  image?: File | null;
}


const Admin = () => {
  const [userList, setUserList] = useState<Person[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [openAddModal, setOpenAddModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get<Person[]>(`${baseURL}/api/v1/getusers`);
        console.log(response);
        setUserList(response.data);
      } catch (error) {
        toast.error("Failed to fetch user data.");
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddUser = async (data: NewUser) => {
    console.log("Adding user:", data);
  }

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <NavBar />
          <AdminTable
            data={userList}
            onEdit={(person) => console.log('Edit:', person)}
            onDelete={(id) => console.log('Delete ID:', id)}
          />
          <div>
            <button
              className="fixed bottom-8 right-8 bg-[#FF4169] hover:bg-[#FF464D] hover:scale-110
          text-white p-4 rounded-full shadow-lg flex items-center justify-center 
          transition duration-300 cursor-pointer"
              onClick={() => setOpenAddModal(true)}
            >
              <ControlPointOutlinedIcon fontSize="large" />
            </button>
          </div>

          <AddUser
            open={openAddModal}
            onClose={() => setOpenAddModal(false)}
            onSubmit={handleAddUser}
          />
        </div>
      )}
    </div>
  )
}

export default Admin