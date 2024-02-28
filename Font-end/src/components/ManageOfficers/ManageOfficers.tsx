// FormModal.jsx
import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { Box, Typography } from '@mui/material';
import AddNewOfficer from './ViewFormModal'
import Axios from 'axios';
import '@/styles/officer.css'

interface Officer {
  _id: string;
  officerId: string;
  name: string;
  email: string;
  address: string;
  divistion: string; 
  type: string;
  telNumber: string; 
  nic: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}


interface ManageOfficersProps {
  isOpen: boolean;
  onClose: () => void;
}

const ManageOfficers: React.FC<ManageOfficersProps> = ({ isOpen, onClose }) => {
  const [officers, setOfficers] = useState<Officer[]>([]);
  const [selectedOfficer, setSelectedOfficer] = useState<Officer | null>(null);
  const [isAddNewOfficer, setAddNewUser] = useState(false)

  useEffect(() => {
    Axios.get(`http://localhost:3000/officerLogin`)
      .then((response) => setOfficers(response.data))
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleViewDetails = (officer: Officer) => {
    setSelectedOfficer(officer);
  };
  function getOfficerPosition(officerId: string): string {
    if (officerId.startsWith('S')) {
      return 'Supervisor';
    } else if (officerId.startsWith('A')) {
      return 'Administrator';
    } else if (officerId.startsWith('B')) {
      return 'Bete Officer';
    } else {
      return 'Unknown Position';
    }
  }

  const createNewOfficer = () =>{
    setAddNewUser(true)
  }
  const manageOfficerClose =() => {
    onClose()
  }
  return (
    <div>
      <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
        <DialogTitle className='heading'>List of Officers</DialogTitle>
        <DialogContent >
          {officers.map((officer) => (
            <div key={officer._id} className="officer-item">
              <div >
                <div className='officer-details'>
                  {officer.officerId} {getOfficerPosition(officer.officerId)} - {officer.divistion}
                </div>
                <div  className='name'>{officer.name}</div>
              </div>
              <button className='button' onClick={() => handleViewDetails(officer)}>View</button>
            </div>
          ))}
        </DialogContent>


        <DialogActions style={{ flexDirection: 'column' }}>
        <Button onClick={createNewOfficer} style={{ color: 'rgba(255, 255, 255, 1)', margin: '10px', marginTop: '1px', backgroundColor: 'rgba(80, 164, 84, 1)' }} variant='contained' fullWidth>
          Create New Officer
          </Button>
          <Button onClick={onClose} style={{ color: '#4CAF50', margin: '10px', marginTop: '1px', borderColor: '#4CAF50' }} variant="outlined" fullWidth>
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <>
      {isAddNewOfficer && <AddNewOfficer isOpen={isAddNewOfficer} onClose={manageOfficerClose}></AddNewOfficer>}
      </>
    </div>
  );
};

export default ManageOfficers;
