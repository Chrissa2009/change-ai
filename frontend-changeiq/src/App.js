import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  CssBaseline,
  ThemeProvider, 
  createTheme 
} from '@mui/material';
import SurveyForm from './components/SurveyForm';

// Create a theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
    background: {
      default: '#f5f5f5',
    }
  },
});

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (surveyData) => {
    console.log('Survey submitted:', surveyData);
    setIsSubmitted(true);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Container maxWidth="xl" sx={{ py: 4 }}>
        {!isSubmitted ? (
          <>
            <Typography variant="h4" component="h1" align="center" gutterBottom>
              Technology Adoption Assessment Survey
            </Typography>
            <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
              Complete this survey to evaluate the ROI of your technology investment.
            </Typography>
            <Box 
              sx={{ 
                mt: 2,
                width: '100%',  // Ensure box uses full container width
                mx: 'auto'     // Center the box
              }}
            >
              <SurveyForm onSubmit={handleSubmit} />
            </Box>
          </>
        ) : (
          <Box 
            sx={{ 
              textAlign: 'center', 
              py: 8, 
              px: 2,
              backgroundColor: 'background.paper',
              borderRadius: 2 
            }}
          >
            {/* <Typography variant="h4" gutterBottom>
              Thank You!
            </Typography> */}
            <Typography variant="body1">
              Your feedback has been submitted successfully. We appreciate your time.
            </Typography>
          </Box>
        )}
      </Container>
    </ThemeProvider>
  );
}

export default App;
