import './Devices.css';
import { useEffect, useState } from 'react';
import { Device } from '../../types/thingsboardTypes';
import { deleteDevice, getTenantDeviceInfos } from '../../api/deviceApi';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import React from 'react';
import SnackbarContent from '@mui/material/SnackbarContent';
import { useDispatch } from 'react-redux';
import { set_DeviceCount } from '../../Redux/Action/Action';
import { useNavigate } from 'react-router-dom';
import Paginations from '../Pagination/Paginations';
import Loader from '../Loader/Loader';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import CustomSnackBar from '../SnackBar/SnackBar';

const Devices: React.FC = () => {
  const [devices, setDevices] = useState<Device[]>([]);
  const [loadingDevices, setLoadingDevices] = useState<boolean>(false);
  const [open, setOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const deviceCountDispatch = useDispatch();
  const navigate = useNavigate();
  const [pageCount, setPageCount] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [initialLoad, setInitialLoad] = useState(true);

  useEffect(() => {
    fetchDevices(currentPage - 1);
  }, [currentPage]);

  const fetchDevices = async (page: number = 0): Promise<void> => {
    try {
      setLoadingDevices(true);
      setErrorMessage(null);

      const params = {
        pageSize: 10,
        page: page,
        sortProperty: 'createdTime',
        sortOrder: 'DESC',
      };

      const response = await getTenantDeviceInfos(params);
      setPageCount(response.data.totalPages);
      setDevices(response.data.data || []);
      deviceCountDispatch(set_DeviceCount(response.data.totalElements));
    } catch (error) {
      console.error('Failed to fetch devices', error);
      setErrorMessage('Problem fetching devices data');
    } finally {
      setTimeout(() => {
        if (initialLoad) {
          setInitialLoad(false);
        }
        setLoadingDevices(false);
      }, 700);
    }
  };

  const handleDelete = async (id: string = ''): Promise<void> => {
    try {
      await deleteDevice(id);
      handleClick();
      fetchDevices(currentPage - 1);
    } catch (error) {
      console.error('Failed to delete device', error);
      setErrorMessage('Problem deleting device');
    }
  };

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === 'clickaway') {
      event.preventDefault();
      return;
    }
    setOpen(false);
  };

  const goBack = () => {
    navigate(-1);
  };

  return (
    <>
      <div className="menu-data">
        {loadingDevices && initialLoad ? (
          <Loader />
        ) : (
          <>
            <div className="devices">
              <div>
                <h2 className="devicesH2">
                  <KeyboardBackspaceIcon onClick={goBack} />
                  Devices
                </h2>
                {errorMessage ? (
                  <div className="error-message">{errorMessage}</div>
                ) : (
                  <>
                    {devices.length === 0 ? (
                      <div className="no-devices-message">
                        No devices available
                      </div>
                    ) : (
                      <>
                        <ul className="device-ul">
                          {devices.map((device, index) => (
                            <li key={index}>
                              <span
                                className="deviceName"
                                onClick={() =>
                                  navigate(`/device/${device.id?.id}`)
                                }
                              >
                                {device.name}
                              </span>
                              <div>
                                <IconButton
                                  aria-label="edit"
                                  onClick={() =>
                                    navigate(`/device/${device.id?.id}`)
                                  }
                                >
                                  <EditIcon className="edit-icon" />
                                </IconButton>
                                <IconButton
                                  aria-label="delete"
                                  onClick={() => handleDelete(device.id?.id)}
                                >
                                  <DeleteIcon className="delete-icon" />
                                </IconButton>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </>
                    )}
                  </>
                )}
              </div>
              <div className="pagination">
                <Paginations
                  pageCount={pageCount}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          </>
        )}
        {/* <Snackbar
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
            </Snackbar> */}
      </div>
      <CustomSnackBar
        open={open}
        setOpen={setOpen}
        snackbarType={'success'}
        message={"Device deleted successfully"}
      />
    </>
  );
};

export default Devices;
