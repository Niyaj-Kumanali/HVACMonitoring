import { Snackbar, SnackbarCloseReason, SnackbarContent } from '@mui/material';
import React from 'react';
import CheckIcon from '@mui/icons-material/Check';
import ErrorIcon from '@mui/icons-material/Error';

interface SnackPropTypes {
    open: boolean;
    setOpen: (value: boolean) => void;
    snackbarType: string;
    message: string;
}

const CustomSnackBar: React.FC<SnackPropTypes> = ({
    open,
    setOpen,
    snackbarType,
    message,
}) => {
    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason
    ) => {
        if (reason === 'clickaway') return;
        event;
        setOpen(false);
    };
    return (
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
                    color: 'white',
                }}
                message={
                    <span style={{ display: 'flex', alignItems: 'center' }}>
                        {snackbarType === 'success' ? (
                            <CheckIcon style={{ marginRight: '8px' }} />
                        ) : (
                            <ErrorIcon style={{ marginRight: '8px' }} />
                        )}
                        {message}
                    </span>
                }
            />
        </Snackbar>
    );
};

export default CustomSnackBar;
