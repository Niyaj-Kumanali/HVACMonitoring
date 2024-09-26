import { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import { deleteUser, getUserById, getUsers, saveUser } from '../../api/userApi';
import { Button } from '@mui/material';
import { set_usersCount } from '../../Redux/Action/Action';
import { useDispatch } from 'react-redux';
import { User as UserType } from '../../types/thingsboardTypes';
import { useParams, useNavigate } from 'react-router-dom';
import Loader from '../Loader/Loader';
import CustomSnackBar from '../SnackBar/SnackBar';
import { getCustomerById } from '../../api/customerAPI';

const User = () => {
  const [Organization, setOrganization] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const [firstName, setFirstname] = useState<string>('');
  const [lastName, setLastname] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [authority, setAuthority] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);
  const [loader, setLoader] = useState(true);
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
    'success'
  );
  const devicecountdispatch = useDispatch();
  const { email } = useParams<{ email: string }>();
  const [user, setUser] = useState<UserType | undefined>();
  const [isEdit, setIsEdit] = useState(true);

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
          if (userData.authority === 'CUSTOMER_USER') {
            const response = await getCustomerById(userData.customerId.id);
            setOrganization(response.data?.title);
          }
          setUsername(userData.email || '');
          setFirstname(userData.firstName || '');
          setLastname(userData.lastName || '');
          setPhone(userData.phone || '');
          setAuthority(userData.authority || '');
          setUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user data', error);
      } finally {
        setTimeout(() => {
          setLoader(false);
        }, 700);
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
          setMessage('User Deleted');
          setSnackbarType('success');
          setOpen(true);
          setTimeout(() => {
            setLoadingDelete(false);
            setTimeout(() => {
              setOpen(false);
              navigate('/users');
              fetchUserData();
            }, 500);
          }, 800);
        }
      }
    } catch (error) {
      console.error('Failed to delete user', error);
      setMessage('Failed to delete user');
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
          setMessage('User updated successfully');
          setSnackbarType('success');
          setOpen(true);
          setTimeout(() => {
            setOpen(false);
            setLoading(false);
            setIsEdit(true);
          }, 1000);
        } else {
          throw new Error('Failed to update user');
        }
      } catch (error: any) {
        setSnackbarType('error');
        if (error.status === 401) {
          setMessage('Session has expired navigating to login page');
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          setMessage('Failed to update user');
        }
        setOpen(true);
        setLoading(false);
      }
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
          <div className="accountinfo">
            <header className="accountinfo-header">
              <div className="accountinfo-email">
                <p className="accountinfo-profile">Profile</p>
                <p>{user?.email}</p>
              </div>
              <div className="accountinfo-lastlogin">
                <p>Last Login</p>
                <p>
                  {user?.additionalInfo?.lastLoginTs
                    ? formatDate(user.additionalInfo.lastLoginTs)
                    : 'No Login Found'}
                </p>
              </div>
            </header>
            <main className="accountinfo-main">
              {Organization && (
                <Box
                  sx={{
                    width: '100%',
                    maxWidth: '100%',
                    backgroundColor: '#ebebeb',
                    marginBottom: '10px',
                  }}
                >
                  <TextField
                    fullWidth
                    label="Organization"
                    value={Organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    required
                    disabled={true}
                  />
                </Box>
              )}
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  backgroundColor: '#ebebeb',
                  marginBottom: '10px',
                }}
              >
                <TextField
                  fullWidth
                  label="Email"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  inputProps={{ readOnly: isEdit }}
                />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  backgroundColor: '#ebebeb',
                  marginBottom: '10px',
                }}
              >
                <TextField
                  fullWidth
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstname(e.target.value)}
                  required
                  inputProps={{ readOnly: isEdit }}
                />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  backgroundColor: '#ebebeb',
                  marginBottom: '10px',
                }}
              >
                <TextField
                  fullWidth
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastname(e.target.value)}
                  required
                  inputProps={{ readOnly: isEdit }}
                />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  backgroundColor: '#ebebeb',
                  marginBottom: '10px',
                }}
              >
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  inputProps={{ readOnly: isEdit }}
                />
              </Box>
              <Box
                sx={{
                  width: '100%',
                  maxWidth: '100%',
                  backgroundColor: '#ebebeb',
                  marginBottom: '10px',
                }}
              >
                <TextField
                  fullWidth
                  label="Authority"
                  value={authority}
                  onChange={(e) => setAuthority(e.target.value)}
                  disabled={true}
                />
              </Box>
              <div className="accountinfo-savebtn-delt-btn">
                {isEdit ? (
                  <Button
                    variant="contained"
                    onClick={() => setIsEdit(false)}
                    sx={{ width: '150px', height: '50px' }}
                  >
                    Edit
                  </Button>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </main>
          </div>
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

export default User;
