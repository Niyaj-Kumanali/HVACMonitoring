import { useEffect, useState } from "react";
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import "./Accountinfo.css";
import { getCurrentUser } from "../../api/loginApi";

const Accountinfo = () => {
    const [username, setUsername] = useState<string>("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getCurrentUser();
                setUsername(userData.email || "");
            } catch (error) {
                console.error('Failed to fetch user data', error);
            }
        };

        fetchUserData();
    }, []);


    const handleClick = () => {
        setLoading(true);

        // Simulate a save operation (e.g., an API call)
        setTimeout(() => {
            console.log("Data saved!");
            setLoading(false);
        }, 2000); // Simulate a 2-second operation
    };

    return (
        <div className="menu-data">
            <div className="accountinfo">
                <header className="accountinfo-header">
                    <div className="accountinfo-email">
                        <p className="accountinfo-profile">Profile</p>
                        <p>{username}</p>
                    </div>
                    <div className="accountinfo-lastlogin">
                        <p>Last Login</p>
                        <p>2024-08-22 17:04:19</p> {/* Consider making this dynamic if possible */}
                    </div>
                </header>
                <main className="accountinfo-main">
                    {['Email', 'First Name', 'Last Name', 'Phone Number', 'Language', 'Home Dashboard'].map((label, index) => (
                        <Box key={index} sx={{ width: '100%', maxWidth: '100%', backgroundColor: "#ebebeb", marginBottom: '10px' }}>
                            <TextField
                                fullWidth
                                label={label}
                                value={label === 'Email' ? username : ''}
                                onChange={(e) => label === 'Email' && setUsername(e.target.value)}
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
