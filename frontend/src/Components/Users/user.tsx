import { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import { useLocation, useNavigate } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteUser } from "../../api/userApi";
import { Snackbar, SnackbarCloseReason, SnackbarContent } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import { getUsers } from "../../api/userApi";
import { set_usersCount } from "../../Redux/Action/Action";
import { useDispatch } from "react-redux";

const User = () => {
    const [username, setUsername] = useState<string>("");
    const [firstName, setFirstname] = useState<string>("");
    const [lastName, setLastname] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const [authority, setAuthority] = useState<string>("");
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const devicecountdispatch = useDispatch();

    const userinfo = useLocation();
    const user = userinfo.state;

    const fetchUserData = async () => {
        try {
            const params = {
                pageSize: 16,
                page: 0
            };
            const userData = await getUsers(params);
            devicecountdispatch(set_usersCount(userData.data.length));
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };

    const handleDeleteUser = async () => {
        setLoadingDelete(true);
        try {
            const out = await deleteUser(user.id.id);
            if (out.status === 200) {
                setMessage("User Deleted");
                setSnackbarType('success');
                setOpen(true);
                setTimeout(() => {
                    setLoadingDelete(false);
                    setTimeout(() => {
                        setOpen(false);
                        navigate("/users");
                        fetchUserData();
                    }, 500);
                }, 800);
            }
        } catch (error) {
            console.error('Failed to delete user', error);
            setMessage("Failed to delete user");
            setSnackbarType('error');
            setOpen(true);
            setLoadingDelete(false);
            setTimeout(() => setOpen(false), 2000); // Hide the error message after 2 seconds
        }
    };

    const handleClick = () => {
        setLoading(true);
        setTimeout(() => {
            console.log("Data saved!");
            setLoading(false);
        }, 2000);
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            event.preventDefault();
            return;
        }
        setOpen(false);
    };

    return (
        <div className="menu-data">
            <div className="accountinfo">
                <header className="accountinfo-header">
                    <div className="accountinfo-email">
                        <p className="accountinfo-profile">Profile</p>
                        <p>{user.email}</p>
                    </div>
                    <div className="accountinfo-lastlogin">
                        <p>Last Login</p>
                        <p>{formatDate(user.additionalInfo.lastLoginTs)}</p>
                    </div>
                </header>
                <main className="accountinfo-main">
                    {['Email', 'First Name', 'Last Name', 'Phone Number', 'Authority'].map((label, index) => (
                        <Box key={index} sx={{ width: '100%', maxWidth: '100%', backgroundColor: "#ebebeb", marginBottom: '10px' }}>
                            <TextField
                                fullWidth
                                label={label}
                                value={
                                    label === 'Email' ? user.email :
                                        label === 'First Name' ? user.firstName :
                                            label === 'Last Name' ? user.lastName :
                                                label === 'Phone Number' ? user.phone :
                                                    label === 'Authority' ? user.authority :
                                                        ''
                                }
                                onChange={(e) => {
                                    if (label === 'Email') setUsername(e.target.value);
                                    if (label === 'First Name') setFirstname(e.target.value);
                                    if (label === 'Last Name') setLastname(e.target.value);
                                    if (label === 'Phone Number') setPhone(e.target.value);
                                    if (label === 'Authority') setAuthority(e.target.value);
                                }}
                            />
                        </Box>
                    ))}
                    <div className="accountinfo-savebtn-delt-btn">
                        <LoadingButton
                            size="small"
                            color="secondary"
                            onClick={handleClick}
                            loading={loading}
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            variant="contained"
                            disabled={loadingDelete} // Disable Update button if Delete button is loading
                            sx={{ width: '150px', height: '50px' }}
                        >
                            <span>Update</span>
                        </LoadingButton>
                        <LoadingButton
                            size="small"
                            color="error"
                            onClick={handleDeleteUser}
                            loading={loadingDelete}
                            loadingPosition="start"
                            startIcon={<DeleteIcon />}
                            variant="contained"
                            disabled={loading} // Disable Delete button if Update button is loading
                            sx={{ width: '150px', height: '50px' }}
                        >
                            <span>Delete</span>
                        </LoadingButton>
                    </div>
                </main>
            </div>
            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                style={{ marginTop: '64px' }}
            >
                <SnackbarContent
                    style={{
                        backgroundColor: snackbarType === 'success' ? 'green' : 'red',
                        color: 'white'
                    }}
                    message={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            {snackbarType === 'success' ? <CheckIcon style={{ marginRight: '8px' }} /> : <ErrorIcon style={{ marginRight: '8px' }} />}
                            {message}
                        </span>
                    }
                />
            </Snackbar>
        </div>
    );
}

export default User;
