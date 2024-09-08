import React, { useState } from 'react';
import { TextField, Box, Button } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { RootState } from '../../Redux/Reducer';
import { setLayout } from '../../Redux/Action/layoutActions';
interface DashboardSettingsProps {
    onSettingClicked: (value: boolean) => void;
}

const DashboardSettings: React.FC<DashboardSettingsProps> = ({onSettingClicked}) => {
  const { dashboardId } = useParams();
  const dispatch = useDispatch();
  const storedLayout = useSelector(
    (state: RootState) =>
      state.dashboardLayout[dashboardId || ''] || { layout: [], dateRange: {} }
  );
  const [limit, setLimit] = useState<number>(storedLayout.limit || 1000); // Default limit

  // Handle change in input field
  const handleLimitChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newLimit = Number(event.target.value);
    if (!isNaN(newLimit) && newLimit >= 0) {
      // Validate input
      setLimit(newLimit);
    }
  };

  const handleSubmit = () =>  {
    dispatch(setLayout(dashboardId, {
        ...storedLayout,
        limit: limit
    }));
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
