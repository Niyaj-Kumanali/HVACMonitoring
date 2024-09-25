import { useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import "./Accountinfo.css";
import { saveUser } from "../../api/userApi";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Reducer";

const Accountinfo = () => {
    const currentUser = useSelector((state: RootState)=> state.user.user)
    const [username, setUsername] = useState<string>(currentUser.email || "");
    const [firstName, setFirstname] = useState<string>(currentUser.firstName || "");
    const [lastName, setLastname] = useState<string>(currentUser.lastName || "");
    const [phone, setPhone] = useState<string>(currentUser.phone || "");
    const [loading, setLoading] = useState<boolean>(false);
    const [authority, setAuthority] = useState<string>(currentUser.authority || "");


    const handleClick = async () => {
        setLoading(true);

        const updateUser = {
            ...currentUser,
            email: username,
            firstName: firstName,
            lastName: lastName,
            phone: phone,
        };

        await saveUser(updateUser, false);
        alert('User updated successfully');

        setTimeout(() => {
            setLoading(false);
        }, 2000);
    };

    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp);
        return date.toLocaleString();
    };

    return (
        <div className="menu-data">
            <div className="accountinfo">
                <header className="accountinfo-header">
                    <div className="accountinfo-email">
                        <p className="accountinfo-profile">Profile</p>
                        {/* <p>{username}</p> */}
                    </div>
                    <div className="accountinfo-lastlogin">
                        <p>Last Login</p>
                        <p>{formatDate(currentUser?.additionalInfo?.lastLoginTs || Date.now())}</p>
                    </div>
                </header>
                <main className="accountinfo-main">
                    {['Email', 'First Name', 'Last Name', 'Phone Number', 'Authority'].map((label, index) => (
                        <Box key={index} sx={{ width: '100%', maxWidth: '100%', backgroundColor: "#ebebeb", marginBottom: '10px' }}>
                            <TextField
                                fullWidth
                                label={label}
                                value={
                                    label === 'Email' ? username :
                                        label === 'First Name' ? firstName :
                                            label === 'Last Name' ? lastName :
                                                label === 'Phone Number' ? phone :
                                                    label === 'Authority' ? authority :
                                                        ''
                                }
                                onChange={(e) => {
                                    if (label === 'Email') setUsername(e.target.value);
                                    if (label === 'First Name') setFirstname(e.target.value);
                                    if (label === 'Last Name') setLastname(e.target.value);
                                    if (label === 'Phone Number') setPhone(e.target.value);
                                    if (label === 'Authority') setAuthority(e.target.value);
                                }}
                                InputProps={{
                                    readOnly: label === 'Authority',
                                }}
                            />
                        </Box>
                    ))}
                    <div className="accountinfo-savebtn">
                        <LoadingButton
                            size="small"
                            color="secondary"
                            onClick={handleClick}
                            loading={loading}
                            loadingPosition="start"
                            startIcon={<SaveIcon />}
                            variant="contained"
                            disabled={loading}
                            sx={{ width: '150px', height: '50px' }}
                        >
                            <span>Save</span>
                        </LoadingButton>
                    </div>
                </main>
            </div>
        </div>
    );
}

export default Accountinfo;
