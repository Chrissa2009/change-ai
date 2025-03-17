import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Drawer, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemIcon, 
  Divider, 
  AppBar, 
  Toolbar, 
  IconButton, 
  Button,
  useMediaQuery,
  useTheme,
  createTheme,
  ThemeProvider,
  Snackbar,
  Alert
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SurveyForm from './components/SurveyForm';
import SaveSurveyDialog from './components/SaveSurveyDialog';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';
import Footer from './components/Footer';
import InsightsIcon from '@mui/icons-material/Insights';
import '@fontsource/space-grotesk';

const theme = createTheme({
  // typography: {
  //   fontFamily: '"Space Grotesk", "Roboto", "Helvetica", "Arial", sans-serif',
  // },
  components: {
    MuiContainer: {
      styleOverrides: {
        maxWidthXl: {
          maxWidth: '1600px !important',
        },
      },
    },
  },
});

const drawerWidth = 280;

function App() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [currentResponses, setCurrentResponses] = useState({});
  const [savedSurveys, setSavedSurveys] = useState([]);
  const [currentSurvey, setCurrentSurvey] = useState(null);
  const [openSaveDialog, setOpenSaveDialog] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [createNew, setCreateNew] = useState(true);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ open: false, surveyId: null, surveyName: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const appTheme = useTheme();
  const isMobile = useMediaQuery(appTheme.breakpoints.down('md'));

  useEffect(() => {
    const savedData = localStorage.getItem('roiSurveys');
    if (savedData) {
      setSavedSurveys(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    if (savedSurveys.length) {
      localStorage.setItem('roiSurveys', JSON.stringify(savedSurveys));
    } else {
      localStorage.removeItem('roiSurveys');
    }
    console.log('savedSurveys:', savedSurveys)
  }, [savedSurveys]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasUnsavedChanges]);

  const handleFormChange = (newResponses) => {
    const currentJSON = JSON.stringify(currentResponses);
    const newJSON = JSON.stringify(newResponses);
    
    if (currentJSON !== newJSON) {
      setHasUnsavedChanges(true);
    } else {
      setHasUnsavedChanges(false);
    }
  };

  const handleSubmit = (formData) => {
    setCurrentResponses(formData);
    setOpenSaveDialog(true);
  };

  const handleSaveSurvey = (surveyName) => {
    const newSurvey = {
      id: currentSurvey ? currentSurvey.id : Date.now(),
      name: surveyName,
      responses: currentResponses,
      dateCreated: currentSurvey ? currentSurvey.dateCreated : new Date().toISOString(),
      dateModified: new Date().toISOString()
    };

    if (currentSurvey) {
      setSavedSurveys(savedSurveys.map(survey => 
        survey.id === currentSurvey.id ? newSurvey : survey
      ));
      setSnackbar({
        open: true,
        message: 'Survey updated successfully!',
        severity: 'success'
      });
    } else {
      setSavedSurveys([...savedSurveys, newSurvey]);
      setSnackbar({
        open: true,
        message: 'New survey created!',
        severity: 'success'
      });
    }
    
    setOpenSaveDialog(false);
    setIsSubmitted(true);
    setCurrentSurvey(newSurvey);
    setHasUnsavedChanges(false);
  };

  const handleLoadSurvey = (survey) => {
    if (hasUnsavedChanges) {
      if (!window.confirm('You have unsaved changes. Do you want to discard them and load another survey?')) {
        return;
      }
    }

    setCurrentSurvey(survey);
    setCurrentResponses(survey.responses);
    setCreateNew(false);
    setIsSubmitted(false);
    setHasUnsavedChanges(false);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleDeleteSurvey = (surveyId) => {
    const survey = savedSurveys.find(s => s.id === surveyId);
    setDeleteDialog({
      open: true,
      surveyId: surveyId,
      surveyName: survey?.name || 'this survey'
    });
  };

  const confirmDelete = () => {
    setSavedSurveys(savedSurveys.filter(survey => survey.id !== deleteDialog.surveyId));
    
    if (currentSurvey && currentSurvey.id === deleteDialog.surveyId) {
      startNew();
    }
    
    setDeleteDialog({ open: false, surveyId: null, surveyName: '' });
    
    setSnackbar({
      open: true,
      message: 'Survey deleted',
      severity: 'info'
    });
  };

  const handleDuplicateSurvey = (survey) => {
    const newSurvey = {
      id: Date.now(),
      name: `${survey.name} (Copy)`,
      responses: { ...survey.responses },
      dateCreated: new Date().toISOString(),
      dateModified: new Date().toISOString()
    };
    
    setSavedSurveys([...savedSurveys, newSurvey]);
    
    setSnackbar({
      open: true,
      message: 'Survey duplicated',
      severity: 'success'
    });
  };

  const invokeTestRequestAsync = async () => {
    try {
      fetch('/api/surveys', {method: 'GET'});
    } catch (error) {
      console.error('Failed to submit:', error);
    }
  }

  const startNew = async () => {
    // TODO: Temporary test invoking Azure Function, remove once we confirm this works.
    invokeTestRequestAsync();

    if (hasUnsavedChanges) {
      if (!window.confirm('You have unsaved changes. Do you want to discard them and start a new survey?')) {
        return;
      }
    }

    setCurrentSurvey(null);
    setCurrentResponses({});
    setCreateNew(true);
    setIsSubmitted(false);
    setHasUnsavedChanges(false);
    
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const drawer = (
    <Box sx={{ 
      width: drawerWidth, 
      height: '100%',  // Make sure the Box takes full height
      display: 'flex', 
      flexDirection: 'column'  // Set flex direction to column
    }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography variant="h4" noWrap component="div" sx={{ display: 'flex', alignItems: 'center', fontFamily: '"Space Grotesk", sans-serif' }}>
          ChangeIQ
          <InsightsIcon sx={{ ml: 1.5, fontSize: 36, color: 'primary.main' }} />
        </Typography>
      </Toolbar>     
      <Divider />
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Your Surveys
        </Typography>
      </Toolbar>
  
      <Divider />
      
      {/* This flex-grow box will push the button to the bottom */}
      <Box sx={{ 
        flex: 1,  // This is critical - it will take all available space
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'  // Hide overflow
      }}>
        <List sx={{ 
          overflowY: 'auto', 
          flex: 1  // Take all available space in the flex container
        }}>
          {savedSurveys.length === 0 ? (
            <ListItem>
              <ListItemText primary="No saved surveys" secondary="Create your first survey to get started" />
            </ListItem>
          ) : (
            savedSurveys
              .sort((a, b) => new Date(b.dateModified) - new Date(a.dateModified))
              .map((survey) => (
                <ListItem 
                  key={survey.id}
                  sx={{ 
                    backgroundColor: currentSurvey && currentSurvey.id === survey.id ? 
                      'rgba(0, 0, 0, 0.08)' : 'inherit',
                    py: 1
                  }}
                >
                  <ListItemIcon>
                    <DescriptionIcon />
                  </ListItemIcon>
                  <ListItemText 
                    primary={survey.name} 
                    secondary={`Modified: ${new Date(survey.dateModified).toLocaleDateString()}`}
                    primaryTypographyProps={{
                      noWrap: true,
                      style: { maxWidth: '120px' }
                    }}
                    secondaryTypographyProps={{
                      noWrap: true,
                      style: { maxWidth: '120px' }
                    }}
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleLoadSurvey(survey)}
                      title="Edit survey"
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDuplicateSurvey(survey)}
                      title="Duplicate survey"
                    >
                      <ContentCopyIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      onClick={() => handleDeleteSurvey(survey.id)}
                      title="Delete survey"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </ListItem>
            ))
          )}
        </List>
      </Box>
      
      <Divider />
      {/* This will now be fixed at the bottom */}
      <Box sx={{ 
        p: 2, 
        mt: 'auto',  // Pushes to bottom if needed
        position: 'sticky',
        bottom: 0,
        backgroundColor: 'background.paper'  // Ensures button has background
      }}>
        <Button 
          variant="contained" 
          fullWidth 
          startIcon={<AddCircleIcon />}
          onClick={startNew}
        >
          Create New Survey
        </Button>
      </Box> 
    </Box>
  );
  

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <AppBar
          position="fixed"
          sx={{
            width: { md: `calc(100% - ${drawerWidth}px)` },
            ml: { md: `${drawerWidth}px` },
          }}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2, display: { md: 'none' } }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
              {createNew ? 'New Survey' : currentSurvey?.name || 'ROI Calculator'}
            </Typography>
            {hasUnsavedChanges && (
              <Typography variant="caption" sx={{ mr: 2, fontStyle: 'italic' }}>
                Unsaved changes
              </Typography>
            )}
          </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true,
            }}
            sx={{
              display: { xs: 'block', md: 'none' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
              display: { xs: 'none', md: 'block' },
              '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{ 
            flexGrow: 1, 
            p: 3, 
            width: { md: `calc(100% - ${drawerWidth}px)` },
            mt: '64px'
          }}
        >
          <Container maxWidth="xl" sx={{ py: 2 }}>
            {!isSubmitted ? (
              <>
                <Typography variant="h4" component="h1" align="center" gutterBottom>
                  Technology Adoption ROI Calculator
                </Typography>
                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                  {currentSurvey 
                    ? `Editing: ${currentSurvey.name}` 
                    : 'Complete this survey to evaluate the ROI of your technology investment.'}
                </Typography>
                <Box 
                  sx={{ 
                    mt: 2,
                    width: '100%',
                    mx: 'auto'
                  }}
                >
                  <SurveyForm 
                    onSubmit={handleSubmit} 
                    initialResponses={currentResponses}
                    onChange={handleFormChange}
                  />
                </Box>
              </>
            ) : (
              <Box sx={{ maxWidth: '800px', mx: 'auto' }}>
                <Typography variant="h5" gutterBottom>
                  Survey Saved!
                </Typography>
                <Typography variant="body1" paragraph>
                  Your survey "{currentSurvey?.name}" has been saved successfully. You can view it in the sidebar or create a new survey.
                </Typography>
                
                {currentSurvey && (
                  <Box sx={{ my: 3, p: 3, bgcolor: 'background.paper', borderRadius: 1, boxShadow: 1 }}>
                    <Typography variant="h6" gutterBottom>
                      Survey Summary
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Created: {new Date(currentSurvey.dateCreated).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Last Modified: {new Date(currentSurvey.dateModified).toLocaleString()}
                    </Typography>
                    
                    <Typography variant="body2" sx={{ mt: 2 }}>
                      Questions answered: {Object.keys(currentSurvey.responses).length}
                    </Typography>
                    
                    {/* We can add more summary information here, like ROI calculations */}
                  </Box>
                )}
                
                <Box sx={{ mt: 4 }}>
                  <Button 
                    variant="contained" 
                    onClick={startNew} 
                    sx={{ mr: 2 }}
                  >
                    Create New Survey
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      setIsSubmitted(false);
                      setCreateNew(false);
                    }}
                  >
                    Continue Editing
                  </Button>
                </Box>
              </Box>
            )}
          </Container>
          <Footer />

        </Box>

        {/* Dialogs and Notifications */}
        <SaveSurveyDialog 
          open={openSaveDialog}
          onClose={() => setOpenSaveDialog(false)}
          onSave={handleSaveSurvey}
          initialName={currentSurvey?.name || ''}
          isEditing={!!currentSurvey}
        />
        
        <DeleteConfirmationDialog 
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ ...deleteDialog, open: false })}
          onConfirm={confirmDelete}
          surveyName={deleteDialog.surveyName}
        />
        
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={4000} 
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;