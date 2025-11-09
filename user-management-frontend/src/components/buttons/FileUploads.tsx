import { Button, Stack, Typography } from "@mui/material";
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useRef, useState } from "react";

interface FileUpload {
    label?: string;
    onFileSelect: (file: File | null) => void;
    accept?: string;
}

const FileUploads = ({
    label = "Upload Document",
    onFileSelect,
    accept = ".pdf,.doc,.docx,.jpg,.png",
}: FileUpload) => {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState("");

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;

        if (file) {
            const fname = file.name || "";
            const date = new Date();
            const timeStamp = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_` +
                `${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
            const uniqueSuffix = `_${timeStamp}`;
            const dotIndex = fname.lastIndexOf(".");
            const nameWithoutExt = dotIndex !== -1 ? fname.substring(0, dotIndex) : fname;
            const ext = dotIndex !== -1 ? fname.substring(dotIndex) : "";
            const newFileName = nameWithoutExt + uniqueSuffix + ext;
            const renamedFile = new File([file], newFileName, { type: file.type });
            setFileName(newFileName);
            onFileSelect(renamedFile);
        }
    }

    return (
        <Stack>
            <Typography fontWeight="bold">{label}</Typography>

            <input
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                accept={accept}
                style={{ display: "none" }}
            />

            <Button
                variant="contained"
                onClick={() => inputRef.current?.click()}
                startIcon={<CloudUploadIcon />}
                sx={{
                    backgroundColor: '#FF464D',
                }}
            >
                Choose File
            </Button>

            {fileName && (
                <Typography variant="body2" color="text.secondary">
                    Selected: {fileName}
                </Typography>
            )}
        </Stack>
    )
}

export default FileUploads