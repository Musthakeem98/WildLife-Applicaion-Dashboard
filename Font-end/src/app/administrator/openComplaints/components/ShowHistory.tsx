// ShowHistoryModal.jsx
import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Typography from '@mui/material/Typography';

interface ShowHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  statusHistory: Array<{ label: string; date: string; status: string }>;
}

const ShowHistoryModal: React.FC<ShowHistoryModalProps> = ({ isOpen, onClose, statusHistory }) => {
  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent>
        <Typography variant="h6" gutterBottom>
          Status History
        </Typography>
        {statusHistory.map((historyItem, index) => (
          <div key={index} style={{ marginBottom: '16px' }}>
            <Typography variant="subtitle1">{historyItem.label}</Typography>
            <Typography variant="body2">{`Date: ${historyItem.date}`}</Typography>
            <Typography variant="body2">{`Status: ${historyItem.status}`}</Typography>
          </div>
        ))}
      </DialogContent>
      <DialogActions style={{ flexDirection: 'column' }}>
        <Button onClick={onClose} color="primary" variant="outlined" fullWidth>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShowHistoryModal;
