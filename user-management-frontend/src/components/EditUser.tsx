import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Stack,
    useMediaQuery,
    useTheme,
    MenuItem,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import FileUploads from './buttons/FileUploads';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

interface Person {
    id: number;
    name: string;
    email: string;
    role: string;
    address: string;
    phone: string;
    image?: string;
}

interface EditUserModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
    oldData: Person | null;
}

interface UserFormData {
    name: string;
    email: string;
    role: string;
    address: string;
    phone: string;
    image?: File | null;
}

const EditUser = ({ open, onClose, onSubmit, oldData }: EditUserModalProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const { register, handleSubmit, reset, setValue } = useForm<UserFormData>();

    useEffect(() => {
        if (oldData) {
            reset({
                name: oldData.name,
                email: oldData.email,
                role: oldData.role,
                address: oldData.address,
                phone: oldData.phone,
                image: null,
            });
        }
    }, [oldData, reset]);

    const handleFormSubmit = (data: UserFormData) => {
        if (data.address === "" || data.email === "" || data.name === "") {
            toast.warning("Please fill all required fields.");
            return;
        }
        const newData = { ...data, id: oldData?.id };

        onSubmit(newData);
        reset();
        onClose();
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="sm"
            PaperProps={{
                sx: {
                    py: isMobile ? 1 : 2,                     // Responsive padding
                    px: isMobile ? 1 : 2,
                    outline: '2px solid #ddd',
                    outlineOffset: isMobile ? "-3px" : "-6px", // Smaller outline offset for mobile
                    borderRadius: isMobile ? 1 : 2,            // Softer radius on mobile
                },
            }}
        >
            <DialogTitle
                sx={{
                    fontSize: isMobile ? 22 : 30,   // Responsive title font size
                    textAlign: 'center',
                    pb: isMobile ? 1 : 2,
                }}
            >
                Update User
            </DialogTitle>

            <DialogContent dividers>
                <Stack spacing={isMobile ? 1.5 : 2} mt={1}>
                    <TextField
                        label="Full Name"
                        {...register('name')}
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                    />
                    <TextField
                        label="Email"
                        type="email"
                        {...register('email')}
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                    />
                    <TextField
                        select
                        label="Role"
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                        defaultValue="USER"
                        {...register("role")}
                    >
                        <MenuItem value="">Select Role</MenuItem>
                        <MenuItem value="ADMIN">Admin</MenuItem>
                        <MenuItem value="USER">User</MenuItem>
                    </TextField>


                    <TextField
                        label="Address"
                        {...register('address')}
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                    />
                    <TextField
                        label="Phone"
                        {...register('phone')}
                        fullWidth
                        size={isMobile ? "small" : "medium"}
                    />
                    <FileUploads
                        label="Upload Document"
                        onFileSelect={(file) => setValue("image", file)}
                        accept=".jpg,.png,.jpeg"
                    />
                </Stack>
            </DialogContent>

            <DialogActions
                sx={{
                    flexDirection: isMobile ? "column" : "row",  // Buttons stacked on mobile
                    gap: isMobile ? 1 : 0,
                    px: isMobile ? 1 : 3,
                    pb: isMobile ? 1 : 2,
                }}
            >
                <Button
                    onClick={onClose}
                    color="secondary"
                    fullWidth={isMobile}   
                >
                    Cancel
                </Button>

                <Button
                    onClick={handleSubmit(handleFormSubmit)}
                    variant="contained"
                    color="primary"
                    fullWidth={isMobile}
                    sx={{
                        backgroundColor: '#ff464d',
                        '&:hover': {
                            backgroundColor: '#cc383d',
                        },
                        mr: isMobile ? 0 : 2,
                    }}
                >
                    Update User
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default EditUser;
