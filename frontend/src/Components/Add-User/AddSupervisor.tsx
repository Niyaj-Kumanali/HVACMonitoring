import { Box, Checkbox, TextField } from '@mui/material';
import './Adduser.css';
import { ChangeEvent, FormEvent, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { User } from '../../types/thingsboardTypes';
import { saveUser, getActivationLink, getUsers } from '../../api/userApi';
import { useDispatch } from 'react-redux';
import { set_usersCount } from '../../Redux/Action/Action';
import CustomSnackBar from '../SnackBar/SnackBar';
import { useNavigate, useParams } from 'react-router-dom';

const AddSupervisor = () => {
  const { emailid } = useParams<{ emailid: string }>();
  console.log(emailid)
  const navigate = useNavigate()
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [firstName, setFirstname] = useState('');
  const [lastName, setLastname] = useState('');
  const [phone, setPhone] = useState('');
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
    'success'
  );
  const [isSendActivationMail, setIsSendActivationMail] =
    useState<boolean>(false);
  const devicecountdispatch = useDispatch();
  const [activationlink, setActivationlink] = useState('');

  const fetchUserData = async () => {
    try {
      const params = {
        pageSize: 16,
        page: 0,
      };
      const userData = await getUsers(params);
      devicecountdispatch(set_usersCount(userData.data.totalElements));
    } catch (error) {
      console.error('Failed to fetch user data', error);
    }
  };

  const handleCreateUser = async (event: FormEvent) => {
    event.preventDefault();

    setLoading(true);
    const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 1000));

    try {
      const newUser: User = {
        email: email,
        authority: 'TENANT_ADMIN',
        firstName: firstName,
        lastName: lastName,
        phone: phone,
        additionalInfo: {},
      };

      const user = await saveUser(newUser, isSendActivationMail);
      const activationLink = await getActivationLink(user.data.id?.id);

      setActivationlink(activationLink.data);

      setMessage('User created successfully!');
      setSnackbarType('success');
      setOpen(true);
      fetchUserData();
      setFirstname('');
      setLastname('');
      setEmail('');
      setPhone('');
      await minLoadingTime;
    } catch (error: any) {
      console.error('Failed to create user: ' + error.message);
      await minLoadingTime;
      setSnackbarType('error');
      if (error.status === 401) {
        setMessage('Session has expired navigating to login page');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      } else {
        setMessage('Failed to create user.');
      }
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="menu-data">
        <div className="users">
          <form onSubmit={handleCreateUser}>
            <div className="input-user">
              <label htmlFor="email" className="label">
                Email
              </label>
              <Box className="text-field-box">
                <TextField
                  id="email"
                  fullWidth
                  label="Email"
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    setEmail(e.target.value)
                  }
                  value={email}
                />
              </Box>
            </div>
            <div className="input-user">
              <label htmlFor="" className="label">
                First Name
              </label>
              <Box className="text-field-box">
                <TextField
                  fullWidth
                  label="First Name"
                  onChange={(e) => setFirstname(e.target.value)}
                  value={firstName}
                />
              </Box>
            </div>
            <div className="input-user">
              <label htmlFor="" className="label">
                Last Name
              </label>
              <Box className="text-field-box">
                <TextField
                  fullWidth
                  label="Last Name"
                  onChange={(e) => setLastname(e.target.value)}
                  value={lastName}
                />
              </Box>
            </div>
            <div className="input-user">
              <label htmlFor="" className="label">
                Phone
              </label>
              <Box className="text-field-box">
                <TextField
                  fullWidth
                  label="Phone"
                  onChange={(e) => setPhone(e.target.value)}
                  value={phone}
                />
              </Box>
            </div>
            <div className="input-user-checkbox">
              <Checkbox
                checked={isSendActivationMail}
                onChange={(e) => setIsSendActivationMail(e.target.checked)}
                inputProps={{ 'aria-label': 'Send Activation Mail' }}
              />
              Send Activation Mail
            </div>
            <div>
              <LoadingButton
                size="small"
                type="submit"
                color="secondary"
                loading={loading}
                loadingPosition="start"
                startIcon={<SaveIcon />}
                variant="contained"
                disabled={loading}
                className="btn-save"
              >
                <span>Save</span>
              </LoadingButton>
            </div>
            {activationlink ? (
              <div className="activation-link">
                Activation Link :
                <a
                  href={activationlink}
                  className="activation-links"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Follow
                </a>
              </div>
            ) : (
              <div></div>
            )}
          </form>
        </div>
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

export default AddSupervisor;
