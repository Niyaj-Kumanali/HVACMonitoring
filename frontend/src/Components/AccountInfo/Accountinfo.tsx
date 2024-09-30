import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import './Accountinfo.css';
import { saveUser } from '../../api/userApi';
import { getCurrentUser } from '../../api/loginApi';
import Loader from '../Loader/Loader';
import { User } from '../../types/thingsboardTypes';
import CustomSnackBar from '../SnackBar/SnackBar';
import { useNavigate } from 'react-router-dom';
import React from 'react';

const Accountinfo = () => {
  const [currentUser, setCurrentUser] = useState<User>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [loader, setLoader] = useState<boolean>(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const navigate = useNavigate();
  console.log("accountinfo")
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await getCurrentUser();
        setCurrentUser(response.data);
      } catch (err:any) {
        console.log('Failed to load user', err);
        setSnackbarType('error');
        if (err.status === 401) {
          setMessage('Session has expired navigating to login page');
          setOpen(true);
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } 
      } finally {
        setTimeout(() => {
          setLoader(false);
        }, 700);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleClick = async () => {
    setLoading(true);

    try {
      await saveUser(currentUser, false);
      setMessage('User updated successfully');
      setSnackbarType('success');
      setOpen(true);
    } catch (error:any) {
      setSnackbarType('error');
      if (error.status === 401) {
        setMessage('Session has expired navigating to login page');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        console.log(error);
        setMessage('Error updating user');
      }
    } finally {
      setTimeout(() => {
        setLoading(false);
        setOpen(true);
      }, 500);
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  return (
    <>
      <div className="menu-data">
        {loader ? (
          <Loader />
        ) : (
          <>
            <div className="accountinfo">
              <header className="accountinfo-header">
                <div className="accountinfo-email">
                  <p className="accountinfo-profile">Profile</p>
                </div>
                <div className="accountinfo-lastlogin">
                  <p>Last Login</p>
                  <p>
                    {formatDate(
                      currentUser?.additionalInfo?.lastLoginTs || Date.now()
                    )}
                  </p>
                </div>
              </header>
              <main className="accountinfo-main">
                {[
                  'Email',
                  'First Name',
                  'Last Name',
                  'Phone Number',
                  'Authority',
                ].map((label, index) => (
                  <Box
                    key={index}
                    sx={{
                      width: '100%',
                      maxWidth: '100%',
                      backgroundColor: '#ebebeb',
                      marginBottom: '10px',
                    }}
                  >
                    <TextField
                      fullWidth
                      label={label}
                      value={
                        label === 'Email'
                          ? currentUser.email
                          : label === 'First Name'
                          ? currentUser.firstName
                          : label === 'Last Name'
                          ? currentUser.lastName
                          : label === 'Phone Number'
                          ? currentUser.phone
                          : label === 'Authority'
                          ? currentUser.authority
                          : ''
                      }
                      onChange={(e) => {
                        if (label === 'Email')
                          setCurrentUser((prev) => ({
                            ...prev,
                            email: e.target.value,
                          }));
                        if (label === 'First Name')
                          setCurrentUser((prev) => ({
                            ...prev,
                            firstName: e.target.value,
                          }));
                        if (label === 'Last Name')
                          setCurrentUser((prev) => ({
                            ...prev,
                            lastName: e.target.value,
                          }));
                        if (label === 'Phone Number')
                          setCurrentUser((prev) => ({
                            ...prev,
                            phone: e.target.value,
                          }));
                      }}
                      disabled={label === 'Authority'}
                      sx={{
                        '& .MuiInputBase-input.Mui-disabled': {
                          cursor:
                            label === 'Authority' ? 'not-allowed' : 'auto',
                        },
                        '&:hover .MuiInputBase-input.Mui-disabled': {
                          cursor:
                            label === 'Authority' ? 'not-allowed' : 'auto',
                        },
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
          </>
        )}
      </div>

      <CustomSnackBar
        open={open}
        setOpen={setOpen}
        snackbarType={snackbarType}
        message={message}
      />
    </>
  );
};

export default React.memo(Accountinfo);
