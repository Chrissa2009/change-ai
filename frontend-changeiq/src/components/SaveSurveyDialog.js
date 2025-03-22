// SaveSurveyDialog.js
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Tooltip
} from '@mui/material';

function SaveSurveyDialog({ open, onClose, onSave, savedSurveys, initialName = '', isEditing = false }) {
  const [surveyName, setSurveyName] = useState('');
  const [error, setError] = useState('');
  const [isHovered, setIsHovered] = useState(false);

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

  const isSaveDisabled = (!isEditing && savedSurveys?.map(s => s.name).includes(surveyName)) ||
                         (isEditing && initialName !== surveyName && savedSurveys?.map(s => s.name).includes(surveyName));

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
        <Tooltip 
          title="Cannot overwrite a different existing survey."
          open={isHovered && isSaveDisabled}
        >
          <span
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
          >
            <Button 
              variant="contained"
              onClick={handleSave}
              disabled={isSaveDisabled}
            >
              {isEditing ? 'Update' : 'Save'}
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}

export default SaveSurveyDialog;
