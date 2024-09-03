import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteUser, getUserById, getUsers, saveUser } from "../../api/userApi";
import { Snackbar, SnackbarCloseReason, SnackbarContent } from "@mui/material";
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import { set_usersCount } from "../../Redux/Action/Action";
import { useDispatch } from "react-redux";
import { User as UserType } from "../../types/thingsboardTypes";
import { useParams, useNavigate } from "react-router-dom";

const User = () => {
    const [username, setUsername] = useState<string>("");
    const [firstName, setFirstname] = useState<string>("");
    const [lastName, setLastname] = useState<string>("");
    const [phone, setPhone] = useState<string>("");
    const [authority, setAuthority] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
    const navigate = useNavigate();
    const [open, setOpen] = useState<boolean>(false);
    const [message, setMessage] = useState<string>("");
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const devicecountdispatch = useDispatch();
    const { email } = useParams<{ email: string }>();
    const [user, setUser] = useState<UserType | undefined>();

    const fetchUserData = async () => {
        try {
            const params = { pageSize: 16, page: 0 };
            const userData = await getUsers(params);
            devicecountdispatch(set_usersCount(userData.data.data.length));
        } catch (error) {
            console.error('Failed to fetch user data', error);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                if (email) {
                    const response = await getUserById(email);
                    const userData = response.data;
                    setUsername(userData.email || "");
                    setFirstname(userData.firstName || "");
                    setLastname(userData.lastName || "");
                    setPhone(userData.phone || "");
                    setAuthority(userData.authority || "");
                    setUser(userData);
                }
            } catch (error) {
                console.error('Failed to fetch user data', error);
            }
        };

        fetchUserData();
    }, [email]);

    const handleDeleteUser = async () => {
        setLoadingDelete(true);
        try {
            if (user && user.id && user.id.id) {
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
            }
        } catch (error) {
            console.error('Failed to delete user', error);
            setMessage("Failed to delete user");
            setSnackbarType('error');
            setOpen(true);
            setLoadingDelete(false);
            setTimeout(() => setOpen(false), 2000);
        }
    };

    const handleClick = async () => {
        setLoading(true);
        if (user) {
            const updateUser: UserType = {
                ...user,
                email: username,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
            };

            try {
                const response = await saveUser(updateUser, false);
                if (response.status === 200) {
                    setMessage("User updated successfully");
                    setSnackbarType('success');
                    setOpen(true);
                    setTimeout(() => {
                        setLoading(false);
                        setOpen(false);
                    }, 1000);
                } else {
                    throw new Error('Failed to update user');
                }
            } catch (error) {
                console.error('Failed to update user', error);
                setMessage("Failed to update user");
                setSnackbarType('error');
                setOpen(true);
                setLoading(false);
                setTimeout(() => setOpen(false), 1000);
            }
        }
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    const handleClose = (event: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
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
                        <p>{user?.email}</p>
                    </div>
                    <div className="accountinfo-lastlogin">
                        <p>Last Login</p>
                        <p>{user?.additionalInfo?.lastLoginTs ? formatDate(user.additionalInfo.lastLoginTs) : 'N/A'}</p>
                    </div>
                </header>
                <main className="accountinfo-main">
                    <Box sx={{ width: '100%', maxWidth: '100%', backgroundColor: "#ebebeb", marginBottom: '10px' }}>
                        <TextField
                            fullWidth
                            label="Email"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ width: '100%', maxWidth: '100%', backgroundColor: "#ebebeb", marginBottom: '10px' }}>
                        <TextField
                            fullWidth
                            label="First Name"
                            value={firstName}
                            onChange={(e) => setFirstname(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ width: '100%', maxWidth: '100%', backgroundColor: "#ebebeb", marginBottom: '10px' }}>
                        <TextField
                            fullWidth
                            label="Last Name"
                            value={lastName}
                            onChange={(e) => setLastname(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ width: '100%', maxWidth: '100%', backgroundColor: "#ebebeb", marginBottom: '10px' }}>
                        <TextField
                            fullWidth
                            label="Phone Number"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                        />
                    </Box>
                    <Box sx={{ width: '100%', maxWidth: '100%', backgroundColor: "#ebebeb", marginBottom: '10px' }}>
                        <TextField
                            fullWidth
                            label="Authority"
                            value={authority}
                            onChange={(e) => setAuthority(e.target.value)}
                            disabled={true}
                        />
                    </Box>
                    <div className="accountinfo-savebtn-delt-btn">
                        <LoadingButton
                            size="small"
                            color="secondary"
                            onClick={handleClick}
                            loading={loading}
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            variant="contained"
                            disabled={loadingDelete}
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
                            disabled={loading}
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
