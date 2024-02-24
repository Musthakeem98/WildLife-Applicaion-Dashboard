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


interface FormModalProps {
  isOpen: boolean;
  onClose: () => void;
}

  const FormModal: React.FC<FormModalProps> = ({ isOpen, onClose }) => {
  
  const handleSubmit = () => {
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Your profile changes were saved successfully! </DialogTitle>
      <DialogActions>
        <Button onClick={onClose} style = { {color: '#4CAF50',margin: '10px',marginTop:"1px", borderColor: '#4CAF50'}} variant="outlined" fullWidth>
          Close
        </Button>
      </DialogActions>

    </Dialog>
  );
};

export default FormModal;