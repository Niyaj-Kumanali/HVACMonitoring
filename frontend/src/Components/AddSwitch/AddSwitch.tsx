import LoadingButton from "@mui/lab/LoadingButton";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import CustomSnackBar from "../SnackBar/SnackBar";
import { addGRID, getAllGRID } from "../../api/gridAPIs";
import { mongoAPI } from "../../api/MongoAPIInstance";
import { addAllDGSET } from "../../api/dgsetAPIs";

interface FormData {
    powerSource_status: String,
}

const AddSwitch = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [addbuttonloader, setAddButtonLoader] = useState<boolean>(false);
    const [formData, setFormdata] = useState<FormData>({
        powerSource_status: '',

    });

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        if (name) {
            setFormdata({
                ...formData,
                [name]: value
            });
        }
    };

    const getAllGrids = async () => {
        console.log("hi")
        const responce = await getAllGRID()
        console.log(responce.data.grids)
    }

    const getAllDGSet = async () => {
        const responce = addAllDGSET();
        console.log(responce)
    }

    useEffect(()=>{
        getAllGrids(),
        getAllDGSet()
    },[formData])

    const handleReset = () => {
        setFormdata({
            powerSource_status: ''
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // setAddButtonLoader(true);

        


        // try {
        //     const response = await addGRID(finalData);
        //     console.log(response.data);
        //     setTimeout(() => {
        //         handleReset();
        //         setAddButtonLoader(false);
        //         setOpen(true);
        //         setSnackbarType('success');
        //         setMessage('Grid Added Successfully');
        //     }, 1000);
        // } catch (error) {
        //     setTimeout(() => {
        //         setAddButtonLoader(false);
        //         setOpen(true);
        //         setSnackbarType('error');
        //         setMessage('Failed to Add Grid');
        //         console.error('Error submitting form:', error);
        //     }, 1000);
        // }
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
                            <h3>Add Switch</h3>
                            <form className="warehouse-form" onSubmit={handleSubmit}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel className="input-label-select" id="warehouse-label">Switch Status</InputLabel>
                                    <Select
                                        labelId="warehouse-label"
                                        id="warehouse-select"
                                            name="powerSource_status"
                                        onChange={handleChange}
                                        className="textfieldss"
                                        label={"Switch Status"}
                                        // value={formData.motor_type}
                                    >
                                        <MenuItem value={"on"}>ON</MenuItem>
                                        <MenuItem value={"off"}>OFF</MenuItem>
                                    </Select>
                                </FormControl>
                                {/* <FormControl fullWidth margin="normal">
                                    <InputLabel className="input-label-select" id="warehouse-label">Switch Status</InputLabel>
                                    <Select
                                        labelId="warehouse-label"
                                        id="warehouse-select"
                                        name="motor_type"
                                        onChange={handleChange}
                                        className="textfieldss"
                                        label={"Switch Status"}
                                    // value={formData.motor_type}
                                    >
                                        <MenuItem value={"on"}>ON</MenuItem>
                                        <MenuItem value={"off)"}>OFF</MenuItem>
                                    </Select>
                                </FormControl> */}
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
}

export default AddSwitch

