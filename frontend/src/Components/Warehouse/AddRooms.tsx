import React, { useState } from 'react';
import '../Add-Warehouse/Addwarehouse.css';
import {
    FormControl,
    Snackbar,
    SnackbarCloseReason,
    SnackbarContent,
    TextField,
} from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import ErrorIcon from '@mui/icons-material/Error';
import SaveIcon from '@mui/icons-material/Save';
import CheckIcon from '@mui/icons-material/Check';
import { addRoom } from '../../api/roomAPIs';
import { useSelector } from 'react-redux';
import { RootState } from '../../Redux/Reducer';
import { RoomType } from '../../types/thingsboardTypes';


const AddRooms: React.FC = () => {
    const [formData, setFormData] = useState<RoomType>({
        room_no: '',
        room_name: '',
        racks: 0,
        power_point: '',
        slot: 0,
        level_slots: {},
        userId: '',
    });

    const currentUser = useSelector((state: RootState) => state.user.user);

    const [submitted, setSubmitted] = useState<boolean>(false);
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const [message, setMessage] = useState('');

    const handleReset = () => {
        setFormData({
            room_no: '',
            room_name: '',
            racks: 0,
            power_point: '',
            slot: 0,
            level_slots: {},
            userId: '',
        });
        setSubmitted(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const convertedData = {
            ...formData,
            racks: Number(formData.racks),
            power_point: Number(formData.power_point),
            slot: Number(formData.slot),
            level_slots: Array.from({ length: Number(formData.racks), }, (_, i) => i + 1)
                .reduce((acc: any, rack: any) => {
                    acc[rack] = Array.from({ length: Number(formData.slot), }, (_, j) => j + 1);
                    return acc;
                }, {}),
            userId: currentUser.id?.id || "",

        };

        try {
            const response = await addRoom(convertedData);

            console.log('Warehouse added:', response.data);

            setTimeout(() => {
                handleReset();
                setLoading(false);
                setOpen(true);
                setSnackbarType('success');
                setMessage('Room Added Successfully');
            }, 1000);
        } catch (error) {
            setTimeout(() => {
                setLoading(false);
                setOpen(true);
                setSnackbarType('error');
                setMessage('Failed to Add Room');
                console.error('Error submitting form:', error);
            }, 1000);
        }
    };


    const handleClose = (
        _event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason
    ) => {
        if (reason === 'clickaway') return;
        setOpen(false);
    };

    return (
        <div className="menu-data">
            <div className="warehouse">
                <h3>Add Rooms</h3>
                <form className="warehouse-form" onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Room Number"
                            name="room_no"
                            value={formData.room_no}
                            onChange={handleChange}
                            disabled={submitted}
                            className="textfieldss"
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Room Name"
                            name="room_name"
                            value={formData.room_name}
                            onChange={handleChange}
                            disabled={submitted}
                            className="textfieldss"
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Racks"
                            name="racks"
                            type="number"
                            value={formData.racks || ''}
                            onChange={handleChange}
                            disabled={submitted}
                            className="textfieldss"
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Power Points"
                            name="power_point"
                            type="number"
                            value={formData.power_point}
                            onChange={handleChange}
                            disabled={submitted}
                            className="textfieldss"
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Slots"
                            name="slot"
                            type="number"
                            value={formData.slot || ''}
                            onChange={handleChange}
                            disabled={submitted}
                            className="textfieldss"
                        />
                    </FormControl>

                    <div className="sub-btn">
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
        </div>
    );
};

export default AddRooms;
