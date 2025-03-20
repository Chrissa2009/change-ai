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
  Alert,
  CircularProgress,
  Paper,
  Dialog, 
  DialogContent, 
  DialogTitle, 
  LinearProgress,
  Tooltip,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import DeleteIcon from '@mui/icons-material/Delete';
import EditNoteIcon from '@mui/icons-material/EditNote';
import EditIcon from '@mui/icons-material/Edit';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SurveyForm from './components/SurveyForm';
import SaveSurveyDialog from './components/SaveSurveyDialog';
import DeleteConfirmationDialog from './components/DeleteConfirmationDialog';
import Footer from './components/Footer';
import InsightsIcon from '@mui/icons-material/Insights';
import CalculateIcon from '@mui/icons-material/Calculate';
import CloseIcon from '@mui/icons-material/Close';
import '@fontsource/space-grotesk';
import ApiService from './api';
import SurveyAnalysisResults from './components/SurveyAnalysisResults';
import BarChartIcon from '@mui/icons-material/BarChart';

const theme = createTheme({
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
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [apiError, setApiError] = useState(null);
  const [surveyAnalysis, setSurveyAnalysis] = useState(null);
  const [analysisDialogOpen, setAnalysisDialogOpen] = useState(false);

  const appTheme = useTheme();
  const isMobile = useMediaQuery(appTheme.breakpoints.down('md'));

  useEffect(() => {
    const fetchSurveys = async () => {
      setIsLoading(true);
      try {
        const surveyNames = await ApiService.getAllSurveys();
        if (surveyNames && surveyNames.length > 0) {
          // For each survey name, fetch the complete survey data
          const surveyPromises = surveyNames.map(name => ApiService.getSurveyByName(name));
          const surveysData = await Promise.all(surveyPromises);
          
          // Transform the data to match your app's format
          const formattedSurveys = surveysData
          .filter(survey => survey) // Filter out null results
          .map((survey, index) => {
            // Ensure every survey has a name property
            // If the survey data doesn't include a name, use the name from the surveyNames array
            const surveyName = survey.name || surveyNames[index] || `Unnamed Survey ${index + 1}`;
            
            return {
              id: survey.id || Date.now() + index, // Use existing ID or create a unique one
              name: surveyName, // Use the determined name
              responses: survey.responses || {},
              dateCreated: survey.dateCreated || new Date().toISOString(),
              dateModified: survey.dateModified || new Date().toISOString()
            };
          });
          
          console.log('formattedSurveys:', formattedSurveys)
          setSavedSurveys(formattedSurveys);
        }
      } catch (error) {
        console.error('Error loading surveys:', error);
        setApiError('Failed to load surveys from API.');
        setSavedSurveys([]); // Set empty array instead of falling back to localStorage
      } finally {
        setIsLoading(false);
      }
    };

    fetchSurveys();
  }, []);

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

  const handleSaveSurvey = async (surveyName) => {
    setIsLoading(true);
    try {
      const newSurvey = {
        id: currentSurvey ? currentSurvey.id : Date.now(),
        name: surveyName,
        responses: currentResponses,
        dateCreated: currentSurvey ? currentSurvey.dateCreated : new Date().toISOString(),
        dateModified: new Date().toISOString()
      };

      // Save to API
      await ApiService.saveSurvey(surveyName, newSurvey);

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
    } catch (error) {
      console.error('Error saving survey:', error);
      setSnackbar({
        open: true,
        message: `Failed to save survey: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadSurvey = async (survey) => {
    if (hasUnsavedChanges) {
      if (!window.confirm('You have unsaved changes. Do you want to discard them and load another survey?')) {
        return;
      }
    }
  
    setIsLoading(true);
    try {
      const fetchedSurvey = await ApiService.getSurveyByName(survey.name);
      console.log('fetchedSurvey:', fetchedSurvey);
      
      if (!fetchedSurvey) {
        throw new Error('Survey could not be loaded from the API');
      }
      
      // Format the data to match your app's structure
      const formattedSurvey = {
        id: fetchedSurvey.id || Date.now(),
        name: fetchedSurvey.name || survey.name,
        responses: fetchedSurvey.responses || {},
        dateCreated: fetchedSurvey.dateCreated || new Date().toISOString(),
        dateModified: fetchedSurvey.dateModified || new Date().toISOString()
      };
      
      console.log('Setting current survey with responses:', formattedSurvey.responses);
      setCurrentSurvey(formattedSurvey);
      setCurrentResponses(formattedSurvey.responses);
      
      setCreateNew(false);
      setIsSubmitted(false);
      setHasUnsavedChanges(false);
      if (isMobile) {
        setMobileOpen(false);
      }
    } catch (error) {
      console.error('Error loading survey:', error);
      setSnackbar({
        open: true,
        message: `Failed to load survey: ${error.message}`,
        severity: 'error'
      });
    
    } finally {
      setIsLoading(false);
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

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const surveyToDelete = savedSurveys.find(s => s.id === deleteDialog.surveyId);
      if (surveyToDelete) {
        // Use the dedicated delete method
        await ApiService.deleteSurvey(surveyToDelete.name);
      }
      
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
    } catch (error) {
      console.error('Error deleting survey:', error);
      setSnackbar({
        open: true,
        message: `Failed to delete survey: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const getSurveyAnalysis = async (surveyName) => {
    if (!surveyName) {
      setSnackbar({
        open: true,
        message: 'Error: Survey name is missing',
        severity: 'error'
      });
      return;
    }
    
    setIsLoadingAnalysis(true);
    setSurveyAnalysis(null);
    
    try {
      const analysisData = await ApiService.getSurveyAnalysis(surveyName);
      
      console.log('Analysis data received:', analysisData);
      
      if (!analysisData || Object.keys(analysisData).length === 0) {
        throw new Error('Analysis returned empty results');
      }
      
      setSnackbar({
        open: true,
        message: 'Analysis completed successfully',
        severity: 'success'
      });
      
      setSurveyAnalysis(analysisData);
  
    } catch (error) {
      console.error('Error getting survey analysis:', error);
      setSnackbar({
        open: true,
        message: `Failed to get analysis: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsLoadingAnalysis(false);
    }
  };

  const handleDuplicateSurvey = async (survey) => {
    setIsLoading(true);
    try {
      const newSurvey = {
        id: Date.now(),
        name: `${survey.name}-Copy`,
        responses: { ...survey.responses },
        dateCreated: new Date().toISOString(),
        dateModified: new Date().toISOString()
      };
      
      // Save to the API
      await ApiService.saveSurvey(newSurvey.name, newSurvey);
      
      setSavedSurveys([...savedSurveys, newSurvey]);
      
      setSnackbar({
        open: true,
        message: 'Survey duplicated',
        severity: 'success'
      });
    } catch (error) {
      console.error('Error duplicating survey:', error);
      setSnackbar({
        open: true,
        message: `Failed to duplicate survey: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const startNew = async () => {
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
      height: '100%',
      display: 'flex', 
      flexDirection: 'column'
    }}>
    <Toolbar sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      backgroundColor: '#023047' 
    }}>
      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        <Box>
          <Typography 
            variant="h4" 
            noWrap 
            component="div" 
            sx={{ 
              fontFamily: '"Space Grotesk", sans-serif', 
              color: "#FB8500",
              lineHeight: 1.2,
              display: 'flex',
              alignItems: 'center'
            }}
            >
            <InsightsIcon sx={{ mr: 1, fontSize: 40, color: '#FFB703' }} />
            change.ai
          </Typography>
        </Box>
        <Typography 
          variant="subtitle2" 
          sx={{ 
            color: '#8ecae6',
            fontStyle: 'bold',
            letterSpacing: 0.5,
            fontSize: '0.85rem',
            textAlign: 'center'
          }}
        >
          AI Calculations. Human Decisions.
        </Typography>
      </Box>
    </Toolbar>     
      <Divider />
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Your Surveys
        </Typography>
      </Toolbar>
  
      <Divider />
      
      <Box sx={{ 
        flex: 1,
        display: 'flex', 
        flexDirection: 'column',
        overflow: 'hidden'
      }}>
        <List sx={{ 
          overflowY: 'auto', 
          flex: 1
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
                  <Tooltip 
                    title={
                      <Box>
                        <Typography variant="subtitle2">{survey.name}</Typography>
                        <Typography variant="body2" >
                          Modified: {new Date(survey.dateModified).toLocaleString()}
                        </Typography>
                      </Box>
                    }
                    arrow
                    placement="top"
                    enterDelay={500}
                  >
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
                  </Tooltip>
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
      <Box sx={{ 
        p: 2, 
        mt: 'auto',
        position: 'sticky',
        bottom: 0,
        backgroundColor: 'background.paper'
      }}>
        <Button 
          variant="contained" 
          fullWidth 
          startIcon={<AddCircleIcon />}
          onClick={startNew}
          sx={{ backgroundColor: "#219EBC", '&:hover': { backgroundColor: "#1A7A94" } }}
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
            backgroundColor: '#023047'
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
            mt: '64px',
            backgroundColor: "#fff8f0",
          }}
        >         
          {isLoading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <CircularProgress />
            </Box>
          )}
          
          {apiError && (
            <Alert severity="warning" sx={{ mb: 2 }}>
              {apiError}
            </Alert>
          )}

          <Container maxWidth="xl" sx={{ py: 2 }}>
            {!isSubmitted ? (
              <>
                <Typography 
                  variant="h4" 
                  component="h1" 
                  align="center" 
                  gutterBottom
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#FB8500'
                  }}
                >
                  <CalculateIcon sx={{ mr: 1, fontSize: 40, color: '#FB8500' }} />
                  Technology Adoption ROI Calculator
                </Typography>
                {currentSurvey ? (
                <Alert 
                  severity="info" 
                  icon={<EditNoteIcon />}
                  sx={{ 
                    mb: 4, 
                    display: 'flex', 
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Typography variant="body1">
                    You are currently editing survey: <strong>{currentSurvey.name}</strong>
                  </Typography>
                </Alert>
              ) : (
                <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 4 }}>
                  Complete this survey to evaluate the ROI of your technology investment.
                </Typography>
              )}
                                
                {/* Analysis section for the submitted view */}
                {currentSurvey && (
                  <Box sx={{ mt: 4, mb: 3 }}>
                    <Paper sx={{ p: 3 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6" color= '#023047'>
                          ROI Analysis
                        </Typography>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<BarChartIcon />}
                          onClick={() => {
                            getSurveyAnalysis(currentSurvey.name);
                            setAnalysisDialogOpen(true);
                          }}
                          disabled={isLoadingAnalysis}
                          sx={{ backgroundColor: "#219EBC", '&:hover': { backgroundColor: "#1A7A94" } }}
                        >
                          {isLoadingAnalysis ? 'Analyzing...' : 'Run Analysis'}
                        </Button>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        Run an analysis to calculate ROI, payback period, and get insights based on your survey responses.
                      </Typography>
                    </Paper>
                    
                    {/* Show the analysis results if available */}
                    <Dialog
                      open={analysisDialogOpen}
                      onClose={() => setAnalysisDialogOpen(false)}
                      fullWidth
                      maxWidth="md"
                      scroll="paper"
                      aria-labelledby="analysis-dialog-title"
                    >
                      <DialogTitle id="analysis-dialog-title">
                        RESULTS
                        <IconButton
                          aria-label="close"
                          onClick={() => setAnalysisDialogOpen(false)}
                          sx={{ position: 'absolute', right: 8, top: 8 }}
                        >
                          <CloseIcon />
                        </IconButton>
                      </DialogTitle>
                      <DialogContent dividers>
                        {isLoadingAnalysis ? (
                          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                            <LinearProgress color="success" />
                          </Box>
                        ) : surveyAnalysis ? (
                          <SurveyAnalysisResults analysisData={surveyAnalysis} />
                        ) : (
                          <Typography>No analysis data available yet.</Typography>
                        )}
                      </DialogContent>
                      {/* <DialogActions>
                        <Button onClick={() => setAnalysisDialogOpen(false)}>Close</Button>
                      </DialogActions> */}
                    </Dialog>
                  </Box>
                )}
                <Box 
                  sx={{ 
                    mt: 2,
                    width: '100%',
                    mx: 'auto',
                  }}
                >
                  <SurveyForm 
                    key={currentSurvey ? currentSurvey.id : 'new-survey'}
                    onSubmit={handleSubmit} 
                    initialResponses={currentResponses}
                    onChange={handleFormChange}
                  />
                  
                  {!createNew && currentSurvey && (
                    <Box sx={{ mt: 4, mb: 3 }}>
                      <Divider sx={{ mb: 3 }} />
                      <Paper sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                          <Typography variant="h6">
                            ROI Analysis
                          </Typography>
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<BarChartIcon />}
                            onClick={() => getSurveyAnalysis(currentSurvey.name)}
                            disabled={isLoadingAnalysis}
                            sx={{ backgroundColor: "#219EBC", '&:hover': { backgroundColor: "#1A7A94" } }}
                          >
                            {isLoadingAnalysis ? 'Analyzing...' : 'Run Analysis'}
                          </Button>
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          Generate an ROI analysis based on your current survey responses.
                        </Typography>
                      </Paper>
                      
                      {/* Show the analysis results */}
                      {surveyAnalysis && (
                        <SurveyAnalysisResults analysisData={surveyAnalysis} />
                      )}
                    </Box>
                  )}
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
                  </Box>
                )}

                
                <Box sx={{ mt: 4 }}>
                  <Button 
                    variant="contained" 
                    onClick={startNew} 
                    sx={{ mr: 2, backgroundColor: "#219EBC", '&:hover': { backgroundColor: "#1A7A94" } }}
                  >
                    Create New Survey
                  </Button>
                  <Button 
                    variant="outlined" 
                    onClick={() => {
                      setIsSubmitted(false);
                      setCreateNew(false);
                    }}
                    sx={{
                      color: '#219EBC'
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
