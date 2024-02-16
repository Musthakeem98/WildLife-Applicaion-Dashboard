import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import MenuItem from '@mui/material/MenuItem';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import axios, { Axios } from 'axios';

interface UpdateStatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  complaints: any;
}

interface TaskResponse {
  success: boolean;
}

const getUserData = () => {
  const userData = sessionStorage.getItem('userData');
  if (userData) {
    return JSON.parse(userData);
  }
  return null;
};

const UpdateStatusModal: React.FC<UpdateStatusModalProps> = ({ isOpen, onClose, complaints }) => {
  const [selectedOfficerId, setSelectedOfficerId] = useState("");
  const [selectedOfficerName, setSelectedOfficerName] = useState("");
  const [assignedOfficers, setAssignedOfficers] = useState<Array<any>>([]);
  const [updateStatusData, setUpdateStatusData] = useState("");
  const [response, setResponce] = useState("");
  const user = getUserData();
  const currentDate = new Date();

  useEffect(() => {
    axios.get('http://localhost:3000/officerLogin/betOfficer')
      .then((response) => {
        setAssignedOfficers(response.data.response);
        console.log("response: ", response.data);
      })
      .catch(error => console.error('Error fetching officers:', error));
  }, []);

  const handleUpdateStatusChange = (field: string, value: string) => {
    setUpdateStatusData(value);
  };

  const handleUpdateStatusChanges = (value: string) => {

    const [officerId, officerName] = value.split(":").map((item) => item.trim());
  
    setSelectedOfficerId((prevOfficerId) => officerId);
  
    const selectedOfficer = assignedOfficers.find((officer) => officer.officerId === officerId);

    setSelectedOfficerName((prevOfficerName) => selectedOfficer ? selectedOfficer.name : "");
    console.log("OfficerId:", officerId, "OfficerName:", officerName);
  };
  

  const handleUpdateStatusSubmit = async () => {
    console.log("Complaine : ", complaints, "ID : ", complaints?._id, "complainId :",complaints?.complaintId )
    axios.get(`http://localhost:3000/changestate/${complaints?.complaintId}`)
    .then((response) => setResponce(response.data))
    .catch((error) => console.error('Error fetching data:', error));

  console.log("post request : ", response);
  window.location.reload()
};

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Update</DialogTitle>
      <DialogContent>
        {/* <TextField
          select
          value={selectedOfficerId || ""}
          onChange={(e) => handleUpdateStatusChanges(e.target.value)}
          fullWidth
          margin="normal"
          SelectProps={{ displayEmpty: true }}
        >
          <MenuItem value="" disabled>
            Select an Officer
          </MenuItem>
          {Array.isArray(assignedOfficers) &&
            assignedOfficers.map((officer, index) => (
              <MenuItem key={officer._id} value={officer.officerId}>
                {officer.name}
              </MenuItem>
            ))}
        </TextField> */}
        <TextField
          label="Note"
          value={updateStatusData}
          onChange={(e) => handleUpdateStatusChange('note', e.target.value)}
          fullWidth
          multiline
          rows={3}
          margin="normal"
        />
      </DialogContent>
      <DialogActions style={{ flexDirection: 'column' }}>
        <Button
          onClick={handleUpdateStatusSubmit}
          variant="contained"
          color="primary"
          fullWidth
          style={{ marginTop: '8px' }}
        >
          Save Changes
        </Button>
        <div className="p-1"></div>
        <Button onClick={onClose} color="primary" variant="outlined" fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UpdateStatusModal;
