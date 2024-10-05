import LoadingButton from "@mui/lab/LoadingButton";
import { Box, FormControl, TextField } from "@mui/material";
import SaveIcon from '@mui/icons-material/Save';
import { useEffect, useState } from "react";
import Loader from "../Loader/Loader";
import CustomSnackBar from "../SnackBar/SnackBar";
import { RootState } from "../../Redux/Reducer";
import { useSelector } from 'react-redux';
import { refrigerator } from "../../types/thingsboardTypes";
import { AddRefrigerators } from "../../api/refrigeratorAPI";

const AddRefrigerator = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>('success');
    const [message, setMessage] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [addButtonLoader, setAddButtonLoader] = useState<boolean>(false);
    const [formData, setFormdata] = useState<refrigerator>({
        refrigerator_name: '',
        roomId: '',
        make: '',
        capability: '',
        star_rating: '',
        type: '',
        placement: { x: 0, y: 0, z: 0 },
        registered_location: { x: 0, y: 0 },
        userId: '',
        warehouse_id: ''
    });

    const currentUser = useSelector((state: RootState) => state.user.user);

    const handleChange = (event: any) => {
        const { name, value } = event.target;
        setFormdata({
            ...formData,
            [name]: value
        });
    };

    const handleReset = () => {
        setFormdata({
            refrigerator_name: '',
            roomId: '',
            make: '',
            capability: '',
            star_rating: '',
            type: '',
            placement: { x: 0, y: 0, z: 0 },
            registered_location: { x: 0, y: 0 },
            userId: '',
            warehouse_id: ''
        });
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setAddButtonLoader(true);

        const finalData = {
            ...formData,
            userId: currentUser.id?.id,
        };

        try {
            await AddRefrigerators(finalData);
            setTimeout(() => {
                handleReset();
                setAddButtonLoader(false);
                setOpen(true);
                setSnackbarType('success');
                setMessage('Refrigerator Added Successfully');
            }, 1000);
        } catch (error) {
            setTimeout(() => {
                setAddButtonLoader(false);
                setOpen(true);
                setSnackbarType('error');
                setMessage('Failed to Add Refrigerator');
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
                        <div className="form-container">
                            <h3>Add Refrigerator</h3>
                            <form className="form-body" onSubmit={handleSubmit}>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        label="Refrigerator Name"
                                        name="refrigerator_name"
                                        onChange={handleChange}
                                        className="textfieldss"
                                        value={formData.refrigerator_name}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        label="Make"
                                        name="make"
                                        onChange={handleChange}
                                        className="textfieldss"
                                        value={formData.make}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        label="Capability"
                                        name="capability"
                                        onChange={handleChange}
                                        className="textfieldss"
                                        value={formData.capability}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        label="Star Rating"
                                        name="star_rating"
                                        onChange={handleChange}
                                        className="textfieldss"
                                        value={formData.star_rating}
                                    />
                                </FormControl>
                                <FormControl fullWidth margin="normal">
                                    <TextField
                                        label="Type"
                                        name="type"
                                        onChange={handleChange}
                                        className="textfieldss"
                                        value={formData.type}
                                    />
                                </FormControl>
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr 1fr',
                                        gap: '5px',
                                    }}
                                >

                                    <FormControl fullWidth margin="normal">
                                        <TextField
                                            label="Placement X"
                                            name="placement_x"
                                            type="number"
                                            onChange={(e) => setFormdata({
                                                ...formData,
                                                placement: {
                                                    ...formData.placement,
                                                    x: Number(e.target.value)
                                                }
                                            })}
                                            className="textfieldss"
                                            value={formData.placement.x || ""}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth margin="normal">
                                        <TextField
                                            label="Placement Y"
                                            name="placement_y"
                                            type="number"
                                            onChange={(e) => setFormdata({
                                                ...formData,
                                                placement: {
                                                    ...formData.placement,
                                                    y: Number(e.target.value)
                                                }
                                            })}
                                            className="textfieldss"
                                            value={formData.placement.y || ""}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth margin="normal">
                                        <TextField
                                            label="Placement Z"
                                            name="placement_z"
                                            type="number"
                                            onChange={(e) => setFormdata({
                                                ...formData,
                                                placement: {
                                                    ...formData.placement,
                                                    z: Number(e.target.value)
                                                }
                                            })}
                                            className="textfieldss"
                                            value={formData.placement.z || ""}
                                        />
                                    </FormControl>
                                </Box>
                                <Box
                                    sx={{
                                        display: 'grid',
                                        gridTemplateColumns: '1fr 1fr',
                                        gap: '5px',
                                    }}
                                >
                                    <FormControl fullWidth margin="normal">
                                        <TextField
                                            label="Registered Location X"
                                            name="registered_location_x"
                                            type="number"
                                            onChange={(e) => setFormdata({
                                                ...formData,
                                                registered_location: {
                                                    ...formData.registered_location,
                                                    x: Number(e.target.value)
                                                }
                                            })}
                                            className="textfieldss"
                                            value={formData.registered_location.x || ""}
                                        />
                                    </FormControl>
                                    <FormControl fullWidth margin="normal">
                                        <TextField
                                            label="Registered Location Y"
                                            name="registered_location_y"
                                            type="number"
                                            onChange={(e) => setFormdata({
                                                ...formData,
                                                registered_location: {
                                                    ...formData.registered_location,
                                                    y: Number(e.target.value)
                                                }
                                            })}
                                            className="textfieldss"
                                            value={formData.registered_location.y || ""}
                                        />
                                    </FormControl>
                                </Box>

                                <div className="btn-cont">
                                    <LoadingButton
                                        size="small"
                                        type="submit"
                                        color="secondary"
                                        loading={addButtonLoader}
                                        loadingPosition="start"
                                        startIcon={<SaveIcon />}
                                        variant="contained"
                                        disabled={addButtonLoader}
                                        className="btn-all"
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

export default AddRefrigerator;
