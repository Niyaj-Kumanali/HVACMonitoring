import { Box, Checkbox, Snackbar, SnackbarCloseReason, SnackbarContent, TextField } from "@mui/material";
import "./Adduser.css";
import { ChangeEvent, FormEvent, useState } from "react";
import LoadingButton from "@mui/lab/LoadingButton";
import SaveIcon from '@mui/icons-material/Save';
import { Customer, User } from "../../types/thingsboardTypes";
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';
import { getCurrentUser } from "../../api/loginApi";
import { createOrUpdateCustomer, getTenantCustomerByTitle } from "../../api/customerAPI";
import { getActivationLink, saveUser } from "../../api/userApi";

const Adduser = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const [title, setTitle] = useState("");
    const [IsSendActivationMail, setIsSendActivationMail] = useState<boolean>(false);

    const handleCustomerSubmit = async (event: FormEvent) => {
        event.preventDefault();
        setLoading(true); // Set the loading state to true when the form is submitted

        const minLoadingTime = new Promise((resolve) => setTimeout(resolve, 1000));

        try {
            const cust: Customer = { title: title };
            const currentuser: User = await getCurrentUser();

            let customer = undefined;
            try {
                customer = await createOrUpdateCustomer(cust);
            } catch (error) {
                customer = await getTenantCustomerByTitle(title);
            }

            const newUser: User = {
                authority: 'CUSTOMER_USER',
                email: email,
                firstName: '',
                lastName: '',
                phone: '',
                additionalInfo: {},
                customerId: {
                    id: customer.id?.id || '',
                    entityType: 'CUSTOMER',
                },
                tenantId: {
                    id: currentuser.id?.id || '',
                    entityType: 'TENANT',
                },
            };

            const user: User = await saveUser(newUser, IsSendActivationMail);
            console.log(user);

            const activationlink = await getActivationLink(user.id?.id);
            console.log(activationlink);

            setMessage("User created successfully!");
            setSnackbarType('success');
            setOpen(true);
            await minLoadingTime;
        } catch (error: any) {
            console.error('Failed to create customer: ' + error.message);
            await minLoadingTime;
            setMessage('Failed to create customer.');
            setSnackbarType('error');
            setOpen(true);
        } finally {
            setLoading(false);
        }
    };


    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };



    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') return;
        event
        setOpen(false);
    };

    return (
        <div className="menu-data">
            <div className="users">
                <form onSubmit={handleCustomerSubmit}>
                    <div className="input-user">
                        <label htmlFor="" className="label">Organization Name</label>
                        <Box className="text-field-box">
                            <TextField
                                fullWidth
                                label="Name"
                                onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                    setTitle(e.target.value)
                                }
                                value={title}
                            />
                        </Box>
                    </div>
                    <div className="input-user">
                        <label htmlFor="" className="label">User Email</label>
                        <Box className="text-field-box">
                            <TextField
                                fullWidth
                                label="Email"
                                onChange={(e) => setEmail(e.target.value)}
                                value={email}
                            />
                        </Box>
                    </div>
                    <div className="input-user-checkbox">
                        <Checkbox {...label} checked={IsSendActivationMail}
                            onChange={(e) => setIsSendActivationMail(e.target.checked)} /> Send Activation Mail
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
                </form>
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
};

export default Adduser;
