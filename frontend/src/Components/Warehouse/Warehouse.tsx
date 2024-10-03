import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { WarehouseData } from '../../types/thingsboardTypes';
import Loader from '../Loader/Loader';
import CustomSnackBar from '../SnackBar/SnackBar';
import { getLocationByLatsAndLongs } from '../../api/MongoAPIInstance';
import { deleteWarehouseByWarehouseId, getAllWarehouseByUserId, getWarehouseByWarehouseId } from '../../api/warehouseAPIs';
import LoadingButton from '@mui/lab/LoadingButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../Redux/Reducer';
import { set_warehouse_count } from '../../Redux/Action/Action';


const Warehouse: React.FC = () => {
    const { warehouseid } = useParams();
    // const currentUser = useSelector((state: RootState) => state.user.user);
    const [formData, setFormData] = useState<WarehouseData>({
        warehouse_name: '',
        latitude: '',
        longitude: '',
        warehouse_dimensions: {
            length: '0',
            width: '0',
            height: '0',
        },
        energy_resource: '',
        cooling_units: '',
        sensors: '',
        userId: '',
        email: '',
        rooms: [],
        dgset: [],
        grid: [],
        powerSource: false,
    });

    const [open, setOpen] = useState(false);
    const [loader, setLoader] = useState(true);
    const [locationInfo, setLocationInfo] = useState<any>({});
    const [loadingg, setLoadingg] = useState(false);
    const warehousecountDispatch = useDispatch();
    
    useEffect(() => {
        const fetchWarehouseById = async () => {
            try {
                const response = await getWarehouseByWarehouseId(warehouseid);

                setFormData({
                    ...response.data,
                });
            } catch (err) {
                console.error('Failed to fetch warehouse', err);
            } finally {
                setTimeout(() => {
                    setLoader(false);
                }, 700);
            }
        };
        fetchWarehouseById();
    }, [warehouseid]);



    useEffect(() => {
        const fetchLocationInfo = async (
            latitude: string,
            longitude: string,
            warehouseId: string
        ) => {
            try {
                const response = await getLocationByLatsAndLongs(
                    latitude,
                    longitude
                );
                if (!response.ok) {
                    throw new Error('Failed to fetch location data');
                }

                const data: Location = await response.json();
                setLocationInfo({ [warehouseId]: data });
            } catch (err) {
                console.error(
                    `Error fetching location for warehouse ${warehouseId}:`,
                    err
                );
            }
        };

        if (formData.latitude && formData.longitude) {
            fetchLocationInfo(
                formData.latitude,
                formData.longitude,
                warehouseid || ''
            );
        }
    }, [formData, warehouseid]);

    const [snackbarType, setSnackbarType] = useState<'success' | 'error'>(
        'success'
    );
    const [message, setMessage] = useState('');
    const currentUser = useSelector((state: RootState) => state.user.user);
    
    const fetchAllWarehouses = async () => {
        try {
            const response = await getAllWarehouseByUserId(
                currentUser.id?.id,
                undefined
            );
            warehousecountDispatch(
                set_warehouse_count(response.data.totalElements)
            );
        } catch (error) {
            console.error('Failed to fetch warehouses:', error);
        }
    };

    const navigate = useNavigate();

    const handleDeleteWarehouse = async () => {
        setLoadingg(true);

        setTimeout(async () => {
            try {
                await deleteWarehouseByWarehouseId(warehouseid);
                fetchAllWarehouses();
                setSnackbarType('success');
                setMessage('Warehouse Deleted Successfully');
            } catch (error) {
                console.error('Error deleting warehouse:', error);
                setSnackbarType('error');
                setMessage('Failed to Delete Warehouse');
            } finally {
                setOpen(true);
                setTimeout(() => {
                    setLoadingg(false);
                    navigate('/warehouses');
                }, 700);
            }
        }, 1000);
    };

    return (
        <>

            <div className="menu-data">
                {loader ? (
                    <Loader />
                ) : (
                    <div className="cont">
                        <div
                            className={'warehouse-widgets'}
                        >
                            <div className="warehouse-widgets-info">
                                <div className="warehouse-widgets-info-data">
                                    <div>
                                        <h3>
                                            Name
                                            <p>
                                                {' '}
                                                : {formData.warehouse_name}
                                            </p>
                                        </h3>
                                        <h3>
                                            Sensors
                                            <p>
                                                {' '}
                                                : {formData.sensors ?? ''}
                                            </p>
                                        </h3>
                                        <h3>
                                            Location
                                            <p>
                                                :
                                                {locationInfo[
                                                    warehouseid || ''
                                                ]?.display_name ||
                                                    'Loading location...'}
                                            </p>
                                        </h3>
                                    </div>
                                    <div>
                                        <Link to={`/Editwarehouse/${warehouseid}`}>
                                            <LoadingButton
                                                variant="contained"
                                                size="small"
                                                color="primary"
                                                loading={loadingg}
                                                loadingPosition="start"
                                                startIcon={<EditIcon />}
                                                className="btn-save"
                                            >
                                                EDIT
                                            </LoadingButton>
                                        </Link>
                                        <LoadingButton
                                            size="small"
                                            color="error"
                                            loading={loadingg}
                                            loadingPosition="start"
                                            startIcon={<DeleteIcon />}
                                            variant="contained"
                                            className="btn-save"
                                            onClick={handleDeleteWarehouse}
                                        >
                                            <span>Delete</span>
                                        </LoadingButton>
                                    </div>
                                </div>
                                <div className="warehouse-widgets-info-data">
                                    <h3>Energy Consumed : {3}</h3>
                                </div>
                                <div className="warehouse-widgets-info-data">
                                    <h3>Occupancy : {5}</h3>
                                </div>
                            </div>

                            <div>
                                <div className="warehouse-widgets-info">
                                    <div className="warehouse-widgets-info-data">
                                        <h3>Current Temp : {42}</h3>
                                    </div>
                                    <div className="warehouse-widgets-info-data">
                                        <h3>No of Violation : {10}</h3>
                                    </div>
                                    <div className="warehouse-widgets-info-data">
                                        <p>
                                            No of Times Doors opened : {19}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                <CustomSnackBar
                    open={open}
                    setOpen={setOpen}
                    snackbarType={snackbarType}
                    message={message}
                />
            </div>

        </>
    );
};

export default Warehouse;
