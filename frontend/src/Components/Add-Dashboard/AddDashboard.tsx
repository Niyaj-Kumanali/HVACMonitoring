import React, { useEffect, useState } from 'react';
import {
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import { getCustomerUsers } from '../../api/userApi';
import { useSelector } from 'react-redux';

const AddDashboard: React.FC = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedCustomer, setAssignedCustomer] = useState('');
  const [customers, setCustomers] = useState([]);
  const user = useSelector((state: any)=> state.user.user)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log({
      title,
      description,
      assignedCustomer,
    });
  };

  useEffect(()=> {
    const getCustomers = async()=> {
        const params = {
            pageSize: 1000,
            page:0
        }
        const response = await getCustomerUsers(user.customerId.id, params)
        setCustomers(response.data)
    }

  }, [])

  return (
    <Box
      className="menu-data"
      component="form"
      onSubmit={handleSubmit}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: 'auto',
        mt: 4,
        padding: 2,
        boxShadow: 3,
        borderRadius: 2,
        backgroundColor: '#f5f5f5',
      }}
    >
      <TextField
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      />

      <TextField
        label="Description"
        multiline
        minRows={4}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      <FormControl fullWidth required>
        <InputLabel id="assignedCustomer-label">Assigned Customer</InputLabel>
        <Select
          labelId="assignedCustomer-label"
          id="assignedCustomer"
          value={assignedCustomer}
          label="Assigned Customer"
          onChange={(e) => setAssignedCustomer(e.target.value)}
        >
          <MenuItem value="">
            <em>None</em>
          </MenuItem>
          {customers.map((customer) => (
            <MenuItem key={customer} value={customer.email}>
              {customer}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button type="submit" variant="contained" color="primary">
        Add Dashboard
      </Button>
    </Box>
  );
};

export default AddDashboard;
