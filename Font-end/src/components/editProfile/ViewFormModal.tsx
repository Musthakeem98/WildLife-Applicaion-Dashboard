// FormModal.jsx
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box } from '@mui/material';
import axios from 'axios';
import Success from './sucessMsg'

interface User {
  name: string,
  email: string,
  telNumber:string,
  address: string,
  password: string
  nic: string,
  officerId: string
}

interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
  userData : User;
}

  const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose , userData}) => {
  const [name, setName] = useState(userData.name);
  const [email, setEmail] = useState(userData.email);
  const [telNumber, setTelNumber] = useState(userData.telNumber);
  const [address, setAddress] = useState(userData.address);
  const [isSuccess, setSuccess] = useState(false)
  const [isDataChanged, setDataChanged] = useState(false); // Track if data has changed

  useEffect(() => {
    // Check if any data has changed
    const hasDataChanged = name !== userData.name || email !== userData.email || telNumber !== userData.telNumber || address !== userData.address;
    setDataChanged(hasDataChanged);
  }, [name, email, telNumber, address, userData]);

  const exampleStatusHistory = [
    { label: 'Label1', date: '2022-01-01', status: 'Opened' },
    { label: 'Label2', date: '2022-01-02', status: 'Closed' },
    // Add more history items as needed
  ];
  const openUpdateStatusModal = async () => {
    const response = await axios.post('http://localhost:3000/officerLogin/update', {
      officerId: userData.officerId,
      name: name,
      email: email,
      telNumber: telNumber,
      address: address,
    });
    console.log("post request : ", response);
    if (response.statusText == "OK"){
      setSuccess(true)
    }
  };
  const handleNameChange = (event: any) => {
    setName(event.target.value);
  };

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handleTelNumberChange = (event: any) => {
    setTelNumber(event.target.value);
  };

  const handleAddressChange = (event: any) => {
    setAddress(event.target.value);
  };
  const closeMsg =() =>{
    setSuccess(false)
    onClose()
    window.location.reload()
  }

  const handleSubmit = () => {
    onClose();

  };

  return (
    <div>
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Edit Profile Info</DialogTitle>
      <DialogContent>
        <TextField
          label="Name"
          value={name}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: false }}
          onChange={handleNameChange}
        />
        <TextField
          label="Email"
          value={email}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: false }}
          onChange={handleEmailChange}
        />
        <TextField
          label="Phone Number"
          value={telNumber}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: false }}
          onChange={handleTelNumberChange}
        />
        <TextField
          label="Address"
          value={address}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: false }}
          onChange={handleAddressChange}
        />
        <TextField
          label="NIC"
          value={userData.nic}
          fullWidth
          margin="normal"
          InputProps={{ readOnly: true }}
        />
      </DialogContent>
      <DialogActions style={{ flexDirection: 'column' }}>
      <Button
        onClick={openUpdateStatusModal}
        variant="contained"
        fullWidth
        style={{
          margin: '10px',
          backgroundColor: isDataChanged ? '#4CAF50' : '#CCCCCC',
        }}
        disabled={!isDataChanged} 
      >
        Update Status
      </Button>
        <Button onClick={onClose} style = { {color: '#4CAF50',margin: '10px',marginTop:"1px", borderColor: '#4CAF50'}} variant="outlined" fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
    {isSuccess && <Success isOpen={isSuccess} onClose={closeMsg}/>}
    </div>
  );
};

export default FormModal;