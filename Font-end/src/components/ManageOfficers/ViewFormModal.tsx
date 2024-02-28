import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Axios from 'axios';
import { MenuItem } from '@mui/material';

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose }) => {
  const [officerData, setOfficerData] = useState({
    officerId: '',
    name: '',
    email: '',
    divistion: '',
    address: '',
    type: '',
    telNumber: '',
    nic: '',
    password: ''
  });
  const [isTypeSelected, setIsTypeSelected] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'type') {
      let updatedOfficerId = '';
      switch (value) {
        case 'Admin':
          updatedOfficerId = 'A';
          break;
        case 'Beta':
          updatedOfficerId = 'B';
          break;
        case 'Supervisor':
          updatedOfficerId = 'S';
          break;
        default:
          updatedOfficerId = '';
      }
      setOfficerData({ ...officerData, [name]: value, officerId: updatedOfficerId });
      setIsTypeSelected(value !== '');
    } else {
      // Clear officerId when the type is cleared
      if (name === 'officerId' && value === '') {
        setIsTypeSelected(false);
      }
      setOfficerData({ ...officerData, [name]: value });
    }
  };
  

  const handleSubmit = () => {
    if (isTypeSelected && officerData.officerId && officerData.name && officerData.email && officerData.divistion && officerData.address && officerData.type && officerData.telNumber && officerData.nic && officerData.password) {
      // Send POST request with officerData
      Axios.post('http://localhost:3000/officerLogin', officerData)
        .then((response) => {
          console.log('Officer created successfully:', response.data);
          onClose(); // Close the modal after successful creation
        })
        .catch((error) => {
          console.error('Error creating officer:', error);
        });
    } else {
      console.error('Please fill all the required fields and select a type.');
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Create New Officer</DialogTitle>
      <DialogContent>
      <TextField
          select
          label="Select Type"
          name="type"
          value={officerData.type || ''}
          onChange={handleChange}
          fullWidth
          margin="normal"
          SelectProps={{ displayEmpty: true }}
        >
          <MenuItem value="" disabled>
            
          </MenuItem>
          <MenuItem value="Admin">Admin</MenuItem>
          <MenuItem value="Beta">Beta</MenuItem>
          <MenuItem value="Supervisor">Supervisor</MenuItem>
        </TextField>
        {!isTypeSelected && (
        <TextField
          label="Officer ID"
          name="officerId"
          value={officerData.officerId}
          onChange={handleChange}
          fullWidth
          margin="normal"
          disabled={officerData.officerId !== ''}
        />)}
        {isTypeSelected && (
        <TextField
          label="Officer ID"
          name="officerId"
          value={officerData.officerId}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />)}
        <TextField
          label="Name"
          name="name"
          value={officerData.name}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Email"
          name="email"
          value={officerData.email}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Division"
          name="divistion"
          value={officerData.divistion}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Address"
          name="address"
          value={officerData.address}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Telephone Number"
          name="telNumber"
          value={officerData.telNumber}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="NIC"
          name="nic"
          value={officerData.nic}
          onChange={handleChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Password"
          name="password"
          value={officerData.password}
          onChange={handleChange}
          fullWidth
          margin="normal"
          type="password"
        />
      </DialogContent>
      <DialogActions>
      <Button onClick={onClose} style={{ color: '#4CAF50', margin: '10px', marginTop: '1px', borderColor: '#4CAF50' }} variant="outlined" fullWidth>
            Close
          </Button>
      <Button onClick={handleSubmit} style={{ color: 'rgba(255, 255, 255, 1)', margin: '10px', marginTop: '1px', backgroundColor: 'rgba(80, 164, 84, 1)' }} variant='contained' fullWidth>
          Create Officer
          </Button>
          
      </DialogActions>
    </Dialog>
  );
};


export default FormModal;
