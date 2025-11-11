import { useEffect, useState } from "react";
import AdminTable from "../../components/AdminTable"
import NavBar from "../../components/NavBar"
import axios from "axios";
import { toast } from "react-toastify";
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import AddUser from "../../components/AddUser";
import Loading from "../../components/Loading";
import { Tooltip } from "@mui/material";
import EditUser from "../../components/EditUser";
import ConfirmationBox from "../../components/ConfirmationBox";

const baseURL = import.meta.env.VITE_BACKEND_URL as string;


interface Person {
  id: number;
  name: string;
  email: string;
  role: string;
  address: string;
  phone: string;
  image?: string;
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
  const [openEditModal, setOpenEditModal] = useState(false);
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<Person | null>(null);
  const [state, setState] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

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
  }, [state]);

  const handleAddUser = async (data: NewUser) => {
    const { image, ...userData } = data;

    const formData = new FormData();

    formData.append(
      "user", new Blob([JSON.stringify(userData)], { type: "application/json" })
    );

    if (image) {
      formData.append("image", image);
    }

    const createPromise = axios.post<Person>(`${baseURL}/api/v1/admin/createuser`, formData, {
      headers: {
        "Authorization": "Bearer " + localStorage.getItem("token"),
        "Content-Type": "multipart/form-data"
      },
    });

    try {
      const response = await toast.promise(createPromise, {
        pending: "Saving user...",
        success: "Data saved successfully!",
        error: "Something went wrong!",
      });
      console.log(response);
      setOpenAddModal(false);
      setState((s) => !s);
    } catch (err) {
      console.error("Error adding user:", err);
    }
  }

  const handleDeleteUser = async (id: number) => {
    try {
      await axios.delete(`${baseURL}/api/v1/admin/deleteuser/${id}`, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });
      toast.success("User deleted successfully!");
      setState((s) => !s);
    } catch (error) {
      toast.error("Failed to delete user.");
      console.error("Error deleting user:", error);
    }
  };

  const handleEditUser = (person: Person) => {
    setOpenEditModal(true);
    setSelectedUser(person);
  }

  const handleUpdateUser = async (data: Person) => {
    console.log(data);
    try {
      await axios.put(`${baseURL}/api/v1/admin/updateuser`, data, {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      });
      toast.success("User updated successfully!");
      setState((s) => !s);
    } catch (error) {
      toast.error("Failed to update user.");
      console.error("Error updating user:", error);
    }
  };

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <NavBar />
          <AdminTable
            data={userList}
            onEdit={(person) => handleEditUser(person)}
            onDelete={(id) => {
              setSelectedUserId(id);
              setOpenDeleteModal(true);
            }}
          />
          <div>
            <Tooltip title="Add User" placement="left-end">
              <button
                className="h-[60px] w-[60px] fixed bottom-8 right-8 bg-[#FF4169] hover:bg-[#FF464D] hover:scale-110
          text-white p-4 rounded-full shadow-lg flex items-center justify-center 
          transition duration-300 cursor-pointer z-100"
                onClick={() => setOpenAddModal(true)}
              >
                <ControlPointOutlinedIcon fontSize="large" />
              </button>
            </Tooltip>
          </div>

          <AddUser
            open={openAddModal}
            onClose={() => setOpenAddModal(false)}
            onSubmit={handleAddUser}
          />
          <EditUser
            open={openEditModal}
            onClose={() => setOpenEditModal(false)}
            onSubmit={handleUpdateUser}
            oldData={selectedUser}
          />
          <ConfirmationBox
            openDeleteModal={openDeleteModal}
            setOpenDeleteModal={setOpenDeleteModal}
            handleDeleteUser={() => {
              if (selectedUserId !== null) {
                handleDeleteUser(selectedUserId);
              } else {
                toast.error("No user selected for deletion.");
              }
            }}
          />
        </div>
      )}
    </div>
  )
}

export default Admin