import { useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import { Button, Stack } from '@mui/material';

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

const AdminTable = ({
    data,
    onEdit,
    onDelete,
}: {
    data: Person[];
    onEdit: (person: Person) => void;
    onDelete: (id: number) => void;
}) => {

    function capitalizeFirstLetter(str: string): string {
        if (!str) return ''; 
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }

    // Define columns (memoized)
    const columns = useMemo<MRT_ColumnDef<Person>[]>(
        () => [
            {
                accessorKey: 'name',
                header: 'Full Name',
                size: 150,
            },
            {
                accessorKey: 'email',
                header: 'Email',
                size: 150,
            },
            {
                accessorKey: 'address',
                header: 'Address',
                size: 250,
            },
            {
                accessorKey: 'phone',
                header: 'Phone',
                size: 150,
            },
            {
                accessorKey: 'role',
                header: 'Role',
                size: 150,
                Cell({ row }) {
                    const person = row.original;
                    return capitalizeFirstLetter(person.role);
                },
            },
            {
                header: 'Actions',
                id: 'actions',
                size: 100,
                Cell: ({ row }) => {
                    const person = row.original;
                    return (
                        <Stack direction="row" spacing={1}>
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => onEdit(person)}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => onDelete(person.id)}
                            >
                                Delete
                            </Button>
                        </Stack>
                    );
                },
            },
        ],
        [onEdit, onDelete],
    );

    const table = useMaterialReactTable({
        columns,
        data,
    });

    return <MaterialReactTable table={table} />;
};

export default AdminTable;
