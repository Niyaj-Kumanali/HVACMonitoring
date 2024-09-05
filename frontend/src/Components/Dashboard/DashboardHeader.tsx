import React from 'react';
import { AppBar, Toolbar, Button, IconButton, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import SettingsIcon from '@mui/icons-material/Settings';

interface DashboardHeaderProps {
  onToggleEdit: () => void;
  onAddWidget: () => void;
  isEditable: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  onToggleEdit,
  onAddWidget,
  isEditable,
}) => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display="flex" alignItems="center">
          {/* States button */}
          <Button color="inherit" sx={{ mr: 2 }}>
            States
          </Button>
          {/* Layouts button */}
          <Button color="inherit" sx={{ mr: 2 }}>
            Layouts
          </Button>
        </Box>

        <Box display="flex" alignItems="center">
          {/* Add Widget Button */}
          <IconButton color="inherit" onClick={onAddWidget}>
            <AddIcon />
          </IconButton>

          {/* Toggle Edit/Save Button */}
          <Button
            color="inherit"
            startIcon={isEditable ? <SaveIcon /> : <EditIcon />}
            onClick={onToggleEdit}
            sx={{ mr: 2 }}
          >
            {isEditable ? 'Save' : 'Edit'}
          </Button>

          {/* Placeholder icons for other controls */}
          <IconButton color="inherit">
            <SettingsIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
