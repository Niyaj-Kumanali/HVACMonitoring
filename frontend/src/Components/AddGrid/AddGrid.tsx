import LoadingButton from '@mui/lab/LoadingButton';
import { FormControl, TextField } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import { useEffect, useState } from 'react';
import Loader from '../Loader/Loader';
import CustomSnackBar from '../SnackBar/SnackBar';
import { addGRID } from '../../api/gridAPIs';
import { RootState } from '../../Redux/Reducer';
import { useSelector } from 'react-redux';
import { grid } from '../../types/thingsboardTypes';

const AddGrid = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
        'success'
    );
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [addbuttonloader, setAddButtonLoader] = useState<boolean>(false);
    const [formData, setFormdata] = useState<grid>({
        grid_name: '',
        max_output_current: 0,
        output_connector_type: '',
        output_voltage: 0,
        userId: '',
        warehouse_id: '',
    });

    const currentUser = useSelector((state: RootState) => state.user.user);

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        if (name) {
            setFormdata({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleReset = () => {
        setFormdata({
            grid_name: '',
            output_voltage: 0,
            max_output_current: 0,
            output_connector_type: '',
            userId: '',
            warehouse_id: '',
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAddButtonLoader(true);

        const finalData = {
            ...formData,
            output_voltage: Number(formData.output_voltage),
            max_output_current: Number(formData.max_output_current),
            userId: currentUser.id?.id,
        };

        try {
            await addGRID(finalData);
            setTimeout(() => {
                handleReset();
                setAddButtonLoader(false);
                setOpen(true);
                setSnackbarType('success');
                setMessage('Grid Added Successfully');
            }, 1000);
        } catch (error) {
            setTimeout(() => {
                setAddButtonLoader(false);
                setOpen(true);
                setSnackbarType('error');
                setMessage('Failed to Add Grid');
                console.error('Error submitting form:', error);
            }, 1000);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setLoading(false);
        }, 700);

        return () => clearTimeout(timer);
    }, []);

    return (
        <>
            {loading ? (
                <div className="menu-data">
                    <Loader />
                </div>
            ) : (
                <div className="menu-data">
                    <div className="form-container">
                        <h3>Add Grid</h3>
                        <form className="form-body" onSubmit={handleSubmit}>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Name"
                                    name="grid_name"
                                    onChange={handleChange}
                                    className="textfieldss"
                                    value={formData.grid_name}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Output Voltage"
                                    name="output_voltage"
                                    type="number"
                                    onChange={handleChange}
                                    className="textfieldss"
                                    value={formData.output_voltage}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Max Output Current"
                                    name="max_output_current"
                                    type="number"
                                    onChange={handleChange}
                                    className="textfieldss"
                                    value={formData.max_output_current}
                                />
                            </FormControl>
                            <FormControl fullWidth margin="normal">
                                <TextField
                                    label="Connector Type"
                                    name="output_connector_type"
                                    onChange={handleChange}
                                    className="textfieldss"
                                    value={formData.output_connector_type}
                                />
                            </FormControl>
                            <div className="btn-cont">
                                <LoadingButton
                                    size="small"
                                    type="submit"
                                    color="secondary"
                                    loading={addbuttonloader}
                                    loadingPosition="start"
                                    startIcon={<SaveIcon />}
                                    variant="contained"
                                    disabled={addbuttonloader}
                                    className="btn-all"
                                >
                                    <span>Save</span>
                                </LoadingButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <CustomSnackBar
                open={open}
                setOpen={setOpen}
                snackbarType={snackbarType}
                message={message}
            />
        </>
    );
};

export default AddGrid;
