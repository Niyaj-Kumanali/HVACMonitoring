import "./Devices.css";
import { useEffect, useState } from 'react';
import { Device, PageData } from '../../types/thingsboardTypes';
import { deleteDevice, getTenantDeviceInfos } from '../../api/deviceApi';
import Loader from "../Loader/Loader";
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import React from "react";
import SnackbarContent from '@mui/material/SnackbarContent';
import { useDispatch } from "react-redux";
import { set_DeviceCount } from "../../Redux/Action/Action";
import { useNavigate } from "react-router-dom";
// import { getDeviceProfileNames } from "../../api/deviceProfileAPIs";

const Devices: React.FC = () => {
    const [devices, setDevices] = useState<Device[]>([]);
    const [loadingDevices, setLoadingDevices] = useState<boolean>(false);
    const [open, setOpen] = React.useState(false);
    const deviceCountDispatch = useDispatch();

    const navigate = useNavigate()

    const fetchDevices = async (page: number): Promise<void> => {
        try {
            setLoadingDevices(true);

            const params = {
                pageSize: 10,
                page: page,
                type: 'default',
                textSearch: '',
                sortProperty: 'name',
                sortOrder: 'ASC',
            };

            const response: PageData<Device> = await getTenantDeviceInfos(params);
            setDevices(response.data || []);

            deviceCountDispatch(set_DeviceCount(response.totalElements || 0));

            setTimeout(() => {
                setLoadingDevices(false);
            }, 1000);

        } catch (error) {
            console.error('Failed to fetch devices', error);
            setLoadingDevices(false); 
        }
    };

    const handleDelete = async(id: string = ''): Promise<void> =>{
        await deleteDevice(id);
        handleClick();
        fetchDevices(0);

    }

    const handleClick = () => {
        setOpen(true);
    };


    const handleClose = (
        event: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            event
            return;
        }

        setOpen(false);
    };

    // const [deviceProfileNames, setDeviceProfileNames] = useState<any[]>([]);

    // const fetchDeviceProfileNames = async () => {
    //     try {
    //         const names = await getDeviceProfileNames(true);
    //         setDeviceProfileNames(names);
    //         console.log(names)
    //     } catch (error) {
    //         console.error('Failed to load device profile names');
    //     }
    // };




    useEffect(() => {
        fetchDevices(0);
        // fetchDeviceProfileNames();
    }, []);

    useEffect(() => {
        deviceCountDispatch(set_DeviceCount(devices.length));
    }, [devices]);

    return (
        <div className="menu-data">
            <div className="devices">
                {
                    loadingDevices ?
                        (
                            <Loader />
                        ) :
                        (
                            <>
                                <h2>Devices</h2>
                                <ul>
                                    {
                                        devices.map((device, index) => (
                                            <li key={index}>
                                                <span className="deviceName" onClick={()=> navigate(`/device/${device.id?.id}`)}>{device.name}</span>
                                                <div>
                                                    <IconButton aria-label="edit" onClick={()=> navigate(`/device/${device.id?.id}`)}>
                                                        <EditIcon className="edit-icon" />
                                                    </IconButton>
                                                    <IconButton
                                                        aria-label="delete"
                                                        onClick={() => handleDelete(device.id?.id)}>
                                                        <DeleteIcon className="delete-icon" />
                                                    </IconButton>
                                                </div>
                                            </li>
                                        ))
                                    }
                                </ul>
                            </>
                        )
                }
            </div>
            <Snackbar
                open={open}
                autoHideDuration={2000}
                onClose={handleClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                style={{ marginTop: '64px' }} 
            >
                <SnackbarContent
                    style={{ backgroundColor: 'green', color: 'white' }}
                    message={
                        <span style={{ display: 'flex', alignItems: 'center' }}>
                            <CheckIcon style={{ marginRight: '8px' }} />
                            Device deleted successfully
                        </span>
                    }
                />
            </Snackbar>
        </div>
    )
}

export default Devices;
