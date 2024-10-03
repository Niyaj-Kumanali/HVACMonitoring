import LoadingButton from "@mui/lab/LoadingButton";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { memo, useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import { addDGSET } from "../../api/dgsetAPIs";
import CustomSnackBar from "../SnackBar/SnackBar";
import { useSelector } from "react-redux";
import { RootState } from "../../Redux/Reducer";
import { dgset } from "../../types/thingsboardTypes";


const AddDgSet: React.FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [addbuttonloader, setAddButtonLoader] = useState<boolean>(false);
    const [formData, setFormdata] = useState<dgset>({
        dgset_name: '',
        output_voltage: 0,
        max_output_current: 0,
        fuel_type: '',
        fuel_capacity: '',
        output_connector_type: '',
        motor_type: '',
        userId: '',
    });

    const currentUser = useSelector((state: RootState) => state.user.user);

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        if (name) {
            setFormdata({
                ...formData,
                [name]: value
            });
        }
    };

    const handleReset = () => {
        setFormdata({
            dgset_name: '',
            output_voltage: 0,
            max_output_current: 0,
            fuel_type: '',
            fuel_capacity: '',
            output_connector_type: '',
            motor_type: '',
            userId: '',
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAddButtonLoader(true);

        const finalData = {
            ...formData,
            max_output_current: Number(formData.max_output_current),
            userId : currentUser.id?.id,
        };

        

        try {
            const response = await addDGSET(finalData);
            console.log(response.data);
            setTimeout(() => {
                handleReset();
                setAddButtonLoader(false);
                setOpen(true);
                setSnackbarType('success');
                setMessage('DG-Set Added Successfully');
            }, 1000);
        } catch (error) {
            setTimeout(() => {
                setAddButtonLoader(false);
                setOpen(true);
                setSnackbarType('error');
                setMessage('Failed to Add DG-Set');
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
            {
                loading ? (
                    <div className="menu-data">
                        <Loader />
                    </div>
                ) : (
                    <div className="menu-data">
                        <div className="warehouse">
                            <h3>Add DG Set</h3>
                            <form className="warehouse-form" onSubmit={handleSubmit}>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        label="Name"
                                        name="dgset_name"
                                        onChange={handleChange}
                                        className="textfieldss"
                                        value={formData.dgset_name}
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
                                        label="Fuel Type"
                                        name="fuel_type"
                                        onChange={handleChange}
                                        className="textfieldss"
                                        value={formData.fuel_type}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        label="Fuel Capacity"
                                        name="fuel_capacity"
                                        onChange={handleChange}
                                        className="textfieldss"
                                        value={formData.fuel_capacity}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        label="Output Connector Type"
                                        name="output_connector_type"
                                        onChange={handleChange}
                                        className="textfieldss"
                                        value={formData.output_connector_type}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel className="input-label-select" id="warehouse-label">Select Motor Type</InputLabel>
                                    <Select
                                        labelId="warehouse-label"
                                        id="warehouse-select"
                                        name="motor_type"
                                        onChange={handleChange}
                                        className="textfieldss"
                                        label={"Select Motor Type"}
                                        value={formData.motor_type}
                                    >
                                        <MenuItem value={"BLDC (Brushless DC) Motors"}>BLDC (Brushless DC) Motors</MenuItem>
                                        <MenuItem value={"SRM (Switched Reluctance Motors)"}>SRM (Switched Reluctance Motors)</MenuItem>
                                        <MenuItem value={"PMSM (Permanent Magnet Synchronous Motors)"}>PMSM (Permanent Magnet Synchronous Motors)</MenuItem>
                                    </Select>
                                </FormControl>
                                <div className="sub-btn">
                                    <LoadingButton
                                        size="small"
                                        type="submit"
                                        color="secondary"
                                        loading={addbuttonloader}
                                        loadingPosition="start"
                                        startIcon={<SaveIcon />}
                                        variant="contained"
                                        disabled={addbuttonloader}
                                        className="btn-save"
                                    >
                                        <span>Save</span>
                                    </LoadingButton>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }
            <CustomSnackBar
                open={open}
                setOpen={setOpen}
                snackbarType={snackbarType}
                message={message}
            />
        </>
    );
};

export default memo(AddDgSet);
