import React from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Divider, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Button 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { surveyQuestions } from './surveyQuestions';

function SurveyResults({ survey, onBack, onEdit }) {
  return (
    <Paper elevation={3} sx={{ p: 3, width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Survey Results: {survey.name}</Typography>
        <Button startIcon={<ArrowBackIcon />} onClick={onBack}>
          Back
        </Button>
      </Box>
      <Divider sx={{ mb: 3 }} />

      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Created: {new Date(survey.dateCreated).toLocaleString()}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        Last Modified: {new Date(survey.dateModified).toLocaleString()}
      </Typography>

      {/* Display summary metrics - you can calculate ROI here */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>ROI Summary</Typography>
        {/* Add your ROI calculations and visualizations here */}
      </Box>

      {/* Display all answers */}
      <Typography variant="h6" gutterBottom>Survey Responses</Typography>
      <TableContainer>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell><strong>Question</strong></TableCell>
              <TableCell><strong>Response</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.entries(survey.responses).map(([key, value]) => (
              <TableRow key={key}>
                <TableCell>{getQuestionLabel(key)}</TableCell>
                <TableCell>{Array.isArray(value) ? value.join(', ') : value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Button variant="contained" onClick={onEdit}>
          Edit Survey
        </Button>
      </Box>
    </Paper>
  );
}

// Helper function to get question labels from your survey questions array
function getQuestionLabel(questionId) {
  for (const section of surveyQuestions) {
    for (const question of section.questions) {
      if (question.id === questionId) {
        return question.label;
      }
    }
  }
  return questionId; // Fallback to ID if label not found
}

export default SurveyResults;
