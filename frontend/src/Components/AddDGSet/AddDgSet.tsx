import LoadingButton from "@mui/lab/LoadingButton"
import { FormControl, TextField } from "@mui/material"
import SaveIcon from '@mui/icons-material/Save';
import CustomSnackBar from "../SnackBar/SnackBar";
import { useState } from "react";

const AddDgSet = () => {

    const [open, setOpen] = useState(false);
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const [message, setMessage] = useState('');
    
    return (
        <>
            <div className="menu-data">
                <div className="warehouse">
                    <h3>Add DG Set</h3>
                    <form className="warehouse-form">
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Vehicle Number"
                                name="vehicle_number"
                                // value={formData.vehicle_number}
                                // onChange={handleChange}
                                // disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Vehicle Name"
                                name="vehicle_name"
                                // value={formData.vehicle_name}
                                // onChange={handleChange}
                                // disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Length"
                                name="vehicle_dimensions.length"
                                type="number"
                                // value={formData.vehicle_dimensions.length}
                                // onChange={handleChange}
                                // disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Width"
                                name="vehicle_dimensions.width"
                                type="number"
                                // value={formData.vehicle_dimensions.width}
                                // onChange={handleChange}
                                // disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Height"
                                name="vehicle_dimensions.height"
                                type="number"
                                // value={formData.vehicle_dimensions.height}
                                // onChange={handleChange}
                                // disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Driver Name"
                                name="driver_details.driver_name"
                                // value={formData.Driver_details.driver_name}
                                // onChange={handleChange}
                                // disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Driver Contact No"
                                name="driver_details.driver_contact_no"
                                type="number"
                                // value={formData.Driver_details.driver_contact_no}
                                // onChange={handleChange}
                                // disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Licence ID"
                                name="driver_details.licence_id"
                                // value={formData.Driver_details.licence_id}
                                // onChange={handleChange}
                                // disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Cooling Units"
                                name="cooling_units"
                                type="number"
                                // value={formData.cooling_units ?? ''}
                                // onChange={handleChange}
                                // disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>
                        <FormControl fullWidth margin="normal">
                            <TextField
                                label="Sensors"
                                name="sensors"
                                type="number"
                                // value={formData.sensors ?? ''}
                                // onChange={handleChange}
                                // disabled={submitted}
                                className="textfieldss"
                            />
                        </FormControl>
                        <div className="sub-btn">
                            <LoadingButton
                                size="small"
                                type="submit"
                                color="secondary"
                                // loading={loading}
                                loadingPosition="start"
                                startIcon={<SaveIcon />}
                                variant="contained"
                                // disabled={loading}
                                className="btn-save"
                            >
                                <span>Save</span>
                            </LoadingButton>
                        </div>
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
    )
}

export default AddDgSet