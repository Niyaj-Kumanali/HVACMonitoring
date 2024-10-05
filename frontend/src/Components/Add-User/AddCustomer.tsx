import { Checkbox, FormControl, TextField } from '@mui/material';
import './Adduser.css';
import { ChangeEvent, FormEvent, useState } from 'react';
import LoadingButton from '@mui/lab/LoadingButton';
import SaveIcon from '@mui/icons-material/Save';
import { Customer, User } from '../../types/thingsboardTypes';
import { getCurrentUser } from '../../api/loginApi';
import {
    createOrUpdateCustomer,
    getTenantCustomerByTitle,
} from '../../api/customerAPI';
import { getActivationLink, getUsers, saveUser } from '../../api/userApi';
import { set_usersCount } from '../../Redux/Action/Action';
import { useDispatch } from 'react-redux';
import CustomSnackBar from '../SnackBar/SnackBar';
import { useNavigate } from 'react-router-dom';

const Adduser = () => {
    const [email, setEmail] = useState('');
    const [firstName, setFirstname] = useState('');
    const [lastName, setLastname] = useState('');
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState('');
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
        'success'
    );
    const [title, setTitle] = useState('');
    const [IsSendActivationMail, setIsSendActivationMail] =
        useState<boolean>(false);
    const [activationlink, setActivationlink] = useState('');
    const devicecountdispatch = useDispatch();
    const navigate = useNavigate();
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

    const handleCustomerSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true);

        const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 1000));

        try {
            const cust: Customer = { title: title };
            const currentuser = await getCurrentUser();

            let customer = undefined;
            try {
                const response = await createOrUpdateCustomer(cust);
                customer = response.data;
            } catch (error: any) {
                const response = await getTenantCustomerByTitle(title);
                customer = response.data;
            }

            const newUser: User = {
                authority: 'CUSTOMER_USER',
                email: email,
                firstName: firstName,
                lastName: lastName,
                phone: phone,
                additionalInfo: {},
                customerId: {
                    id: customer.id?.id || '',
                    entityType: 'CUSTOMER',
                },
                tenantId: {
                    id: currentuser.data.id?.id || '',
                    entityType: 'TENANT',
                },
            };

            const user = await saveUser(newUser, IsSendActivationMail);

            const activationlink = await getActivationLink(user.data.id?.id);
            setActivationlink(activationlink.data);

            setMessage('User created successfully!');
            setSnackbarType('success');
            setOpen(true);
            setFirstname('');
            setLastname('');
            setEmail('');
            setPhone('');
            fetchUserData();
            await minLoadingTime;
        } catch (error: any) {
            console.error('Failed to create customer: ' + error.message);
            await minLoadingTime;
            setSnackbarType('error');
            if (error.status === 401) {
                setMessage('Session has expired navigating to login page');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage('Failed to create customer.');
            }
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };

    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };

    return (
        <>
            <div className="menu-data">
                <div className="form-container">
                    <h3>Add Customer</h3>
                    <form onSubmit={handleCustomerSubmit} className='form-body'>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                fullWidth
                                label="Name"
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setTitle(e.target.value)
                                }
                                value={title}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                fullWidth
                                label="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                fullWidth
                                label="First Name"
                                onChange={(e) => setFirstname(e.target.value)}
                                value={firstName}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                fullWidth
                                label="Last Name"
                                onChange={(e) => setLastname(e.target.value)}
                                value={lastName}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                fullWidth
                                label="Phone"
                                onChange={(e) => setPhone(e.target.value)}
                                value={phone}
                                className="textfieldss"
                            />
                        </FormControl>
                        <div className="input-user-checkbox">
                            <Checkbox
                                {...label}
                                checked={IsSendActivationMail}
                                onChange={(e) => setIsSendActivationMail(e.target.checked)}
                            />{' '}
                            Send Activation Mail
                        </div>
                        <div className="btn-cont">
                            <LoadingButton
                                size="small"
                                type="submit"
                                color="secondary"
                                loading={loading}
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                variant="contained"
                                disabled={loading}
                                className="btn-all"
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

export default Adduser;
