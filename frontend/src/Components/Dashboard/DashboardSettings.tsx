import React, { useEffect, useState } from 'react';
import { TextField, Box, Button } from '@mui/material';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { setLayout } from '../../Redux/Action/layoutActions';
import { getLayout, postLayout } from '../../api/MongoAPIInstance';
import { DashboardLayoutOptions } from '../../Redux/Reducer/layoutReducer';
interface DashboardSettingsProps {
    onSettingClicked: (value: boolean) => void;
}

const DashboardSettings: React.FC<DashboardSettingsProps> = ({onSettingClicked}) => {
  const { dashboardId } = useParams();
  const dispatch = useDispatch();
  const [storedLayout, setStoredLayout] = useState<DashboardLayoutOptions>({})

  useEffect(()=> {
    const fetchDashboard = async () => {
      const response = await getLayout(dashboardId)
      setStoredLayout(response.data)
      console.log(response.data)
    }
    fetchDashboard()
  }, [])

  const [limit, setLimit] = useState<number>(storedLayout.limit || 1000); // Default limit

  // Handle change in input field
  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = Number(event.target.value);
    if (!isNaN(newLimit) && newLimit >= 0) {
      // Validate input
      setLimit(newLimit);
    }
  };

  const handleSubmit = async () =>  {
    dispatch(setLayout(dashboardId, {
        ...storedLayout,
        limit: limit
    }));
    await postLayout(dashboardId, {
      ...storedLayout,
      limit: limit
  })
    onSettingClicked(false)
  }

  return (
    <Box
      sx={{
        bgcolor: 'white',
        padding: 2,
        border: '1px solid #ddd',
        borderRadius: 2,
        margin: '0 auto',
        width: '100%',
        height: '100%',
      }}
    >
      <TextField
        type="number"
        value={limit}
        onChange={handleLimitChange}
        InputProps={{ inputProps: { min: 10 } }} // Ensure input is non-negative
        label="Limit"
        variant="outlined"
        fullWidth
        sx={{ marginBottom: 2 }}
      />
      <Button onClick={handleSubmit}>Submit</Button>
    </Box>
  );
};

export default DashboardSettings;
