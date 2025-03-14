// SaveSurveyDialog.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button
} from '@mui/material';

function SaveSurveyDialog({ open, onClose, onSave, initialName = '', isEditing = false }) {
  const [surveyName, setSurveyName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setSurveyName(initialName);
      setError('');
    }
  }, [open, initialName]);

  const handleSave = () => {
    if (!surveyName.trim()) {
      setError('Please enter a survey name');
      return;
    }
    onSave(surveyName.trim());
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>
        {isEditing ? 'Update Survey' : 'Save Survey'}
      </DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Survey Name"
          fullWidth
          variant="outlined"
          value={surveyName}
          onChange={(e) => {
            setSurveyName(e.target.value);
            if (e.target.value.trim()) {
              setError('');
            }
          }}
          error={!!error}
          helperText={error}
          sx={{ mt: 2 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>
          {isEditing ? 'Update' : 'Save'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SaveSurveyDialog;
