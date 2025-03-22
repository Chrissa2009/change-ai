import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Container, 
  Drawer, 
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
  DialogActions,
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  Menu,
  MenuItem
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import DescriptionIcon from '@mui/icons-material/Description';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';
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
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import CloseIcon from '@mui/icons-material/Close';
import ManageSearchIcon from '@mui/icons-material/ManageSearch';
import '@fontsource/space-grotesk';
import ApiService from './api';
import SurveyAnalysisResults from './components/SurveyAnalysisResults';
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import HistoryIcon from '@mui/icons-material/History';
import { surveyQuestions } from './components/surveyQuestions';
import { generatePDFWithHtml2Pdf } from './components/pdfUtils';
import { downloadFile } from './components/fileUtils';

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
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [reportVersions, setReportVersions] = useState({});
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [selectedSurvey, setSelectedSurvey] = useState(null);
  const [versionsLoading, setVersionsLoading] = useState(false);
  const [isHovered, setIsHovered] = useState(false);


  console.log('currentSurvey:', currentSurvey);
  const appTheme = useTheme();
  const isMobile = useMediaQuery(appTheme.breakpoints.down('md'));
  // Create a ref to the SurveyAnalysisResults component
  const surveyResultsRef = useRef(null);
  console.log('surveyAnalysis:', surveyAnalysis);
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

    // Handle PDF download
    const handlePdfDownload = async () => {
      if (!surveyAnalysis) return;
      
      setIsGeneratingPDF(true);
      
      try {
        await generatePDFWithHtml2Pdf(surveyResultsRef, currentSurvey.name);
        // You could show a success message here
      } catch (error) {
        console.error('Failed to generate PDF:', error);
        // You could show an error message here
      } finally {
        setIsGeneratingPDF(false);
      }
    };

  const transformResponsesToApiFormat = (responses) => {
    // Initialize the output object with forms array
    const transformedData = {
      forms: []
    };
    
    // Iterate through all responses
    Object.entries(responses).forEach(([questionId, answer]) => {
      // Skip empty answers
      if (answer === undefined || answer === null || answer === '') {
        return;
      }
      
      // Find the question definition to get category, title and description
      let questionData = null;
      let category = '';
      
      // Search for the question in survey questions
      for (const section of surveyQuestions) {
        const question = section.questions.find(q => q.id === questionId);
        if (question) {
          questionData = question;
          category = section.section;
          break;
        }
      }
      
      // If question found, add to forms
      if (questionData) {
        transformedData.forms.push({
          category: category,
          title: questionId,
          description: questionData.label,
          contents: String(answer) // Ensure contents is always a string
        });
      }
    });
    
    return transformedData;
  };

  const getSurveyAnalysis = async (surveyName, responses) => {
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
      const transformedData = transformResponsesToApiFormat(responses);
      // console.log('Analysis response sent:', transformedData);
      const analysisData = await ApiService.fetchSurveyAnalysis(surveyName, transformedData);
      
      // console.log('Analysis data received:', analysisData);
      
      if (!analysisData || Object.keys(analysisData).length === 0) {
        throw new Error('Analysis returned empty results');
      }
      
      setSnackbar({
        open: true,
        message: 'Analysis completed successfully',
        severity: 'success'
      });
      
      setSurveyAnalysis(analysisData);
      // console.log('setSurveyAnalysis(analysisData):', surveyAnalysis);
  
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
  //TODO: Remove this console.log
  useEffect(() => {
    console.log('islodingAnalysis:', isLoadingAnalysis);
  }, [isLoadingAnalysis]);

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

  const handleReportVersionSelectAndDownload = async (surveyName, reportVersion) => {
    try {
      const reportData = await ApiService.getReportVersion(surveyName, reportVersion);
      
      if (reportData?.analysis) {
        downloadFile(reportData.analysis); // Direct download
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to download report: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const fetchReportVersions = async (surveyName) => {
    try {
      setVersionsLoading(true);
      const response = await ApiService.listReportVersions(surveyName);
      
      // Extract reportVersions array from the response
      setReportVersions(prev => ({
        ...prev,
        [surveyName]: response.reportVersions || []
      }));
    } catch (error) {
      console.error('Error fetching report versions:', error);
      setSnackbar({
        open: true,
        message: `Failed to load report versions: ${error.message}`,
        severity: 'error'
      });
    } finally {
      setVersionsLoading(false);
    }
  };

  // Open LOGS menu
  const handleLogsMenuOpen = (event, surveyName) => {
    setMenuAnchor(event.currentTarget);
    setSelectedSurvey(surveyName);
    if (!reportVersions[surveyName]) {
      fetchReportVersions(surveyName);
    }
  };

  // Close LOGS menu
  const handleLogsMenuClose = () => {
    setMenuAnchor(null);
    setSelectedSurvey(null);
  };
console.log('currentResponses:', currentResponses);
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
          Start New Survey
        </Button>
      </Box>
      <Divider />
      
      <Typography 
      variant="h6" 
      sx={{ 
        p: 2,
        pb: 1,
        fontWeight: 'medium',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      SURVEYS
    </Typography>
  
  {/* Survey List */}
    <Box sx={{ 
      flex: 1,
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'hidden'
    }}>
      <Box sx={{ 
        overflowY: 'auto', 
        flex: 1,
        // p: 1
      }}>
        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : savedSurveys.length === 0 ? (
          <Box sx={{ p: 2, textAlign: 'center' }}>
            <Typography variant="body1">No saved surveys</Typography>
            <Typography variant="body2" color="text.secondary">
              Create your first survey to get started
            </Typography>
          </Box>
        ) : (
          savedSurveys
            .sort((a, b) => new Date(b.dateModified) - new Date(a.dateModified))
            .map((survey) => (
              <Accordion
                defaultExpanded
                key={survey.id}
                disableGutters
                sx={{
                  // mb: 1,
                  // boxShadow: 'none',
                  // '&:before': {
                  //   display: 'none',
                  // },
                  // backgroundColor: currentSurvey && currentSurvey.id === survey.id ? 
                  //   'rgba(33, 158, 188, 0.08)' : 'background.paper',
                  // border: '1px solid',
                  // borderColor: 'divider',
                  // borderRadius: 1,
                  overflow: 'hidden',
                }}
              >
                <Tooltip 
                  title={
                    <Box>
                      <Typography variant="subtitle2">{survey.name}</Typography>
                      {/* <Typography variant="body2" >
                        Modified: {new Date(survey.dateModified).toLocaleString()}
                      </Typography> */}
                    </Box>
                  }
                  arrow
                  placement="right"
                  enterDelay={500}
                  slotProps={{
                    tooltip: {
                      sx: {
                        backgroundColor: '#3b3b3b',
                      },
                    },
                    arrow: {
                      sx: {
                        color: '#3b3b3b',
                      },
                    },
                  }}
                >

                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    minHeight: '48px',
                    '& .MuiAccordionSummary-content': {
                      margin: '8px 0',
                    },
                    backgroundColor: 'rgba(33, 158, 188, 0.08)'
                  }}
                  >
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <DescriptionIcon 
                      fontSize="small" 
                      sx={{ 
                        mr: 1.5, 
                        color: currentSurvey && currentSurvey.id === survey.id ? 
                        '#219EBC' : 'text.secondary' 
                      }}
                      />
                    <Typography 
                      sx={{ 
                        fontWeight: currentSurvey && currentSurvey.id === survey.id ? 
                        'medium' : 'normal',
                        color: currentSurvey && currentSurvey.id === survey.id ? 
                        'primary.main' : 'text.primary',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                        maxWidth: {
                          xs: '150px',
                          sm: '180px'
                        }
                      }}
                      >
                      {survey.name}
                    </Typography>
                  </Box>
                </AccordionSummary>
                </Tooltip>
                <AccordionDetails>
                  <Box sx={{ mb: 1.5, ml: 0.5 }}>
                    <Typography 
                      variant="body2" 
                      color="text.secondary"
                      sx={{ fontSize: '0.8rem' }}
                    >
                      Modified: {new Date(survey.dateModified).toLocaleString()}
                    </Typography>
                  </Box>
                  
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 1 }}>
                    <Box>
                      <Button
                        size="small"
                        variant="outlined"
                        onClick={(e) => handleLogsMenuOpen(e, survey.name)}
                        startIcon={<HistoryIcon fontSize="small" />} // History icon
                        sx={{
                          textTransform: 'none', // Prevent uppercase transformation
                          color: 'text.secondary', // Default text color
                          '&:hover': {
                            color: 'primary.main', // Change text and icon color on hover
                            backgroundColor: 'action.hover', // Optional: Add background color on hover
                            borderColor: 'primary.main'
                          },
                        }}
                      >
                        DOWNLOAD REPORTS
                      </Button>
                      <Menu
                        anchorEl={menuAnchor}
                        open={Boolean(menuAnchor && selectedSurvey === survey.name)}
                        onClose={handleLogsMenuClose}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'right',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                      >
                        {versionsLoading ? (
                          <MenuItem disabled>
                            <Box sx={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                              <CircularProgress size={20} />
                            </Box>
                          </MenuItem>
                        ) : (
                          (reportVersions[survey.name] || []).map((timestamp, index) => {
                            // Parse the timestamp
                            const date = new Date(timestamp);
                            // Format the date
                            const formattedDate = date.toLocaleString('en-US', {
                              year: 'numeric',
                              month: 'numeric',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                              second: '2-digit'
                            });
                      
                            return (
                              <MenuItem 
                                key={timestamp}
                                onClick={() => {
                                  handleLogsMenuClose();
                                  handleReportVersionSelectAndDownload(survey.name, timestamp);
                                }}
                              >
                                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                                Version {index + 1} - {formattedDate}
                                </Typography>
                              </MenuItem>
                            );
                          })
                        )}
                        {(reportVersions[survey.name] || []).length === 0 && !versionsLoading && (
                          <MenuItem disabled>
                            <Typography variant="body2" color="text.secondary">
                              No report versions available
                            </Typography>
                          </MenuItem>
                        )}
                      </Menu>

                    </Box>
                    <Box sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      gap: 0.5 // Add gap between icons
                    }}>
                      <Tooltip title="EDIT" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleLoadSurvey(survey)}
                          sx={{
                            '&:hover': {
                              color: 'info.main',
                            },
                          }}
                        >
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="DUPLICATE" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleDuplicateSurvey(survey)}
                          sx={{
                            '&:hover': {
                              color: 'success.main',
                            },
                          }}
                        >
                          <ContentCopyIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="DELETE" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteSurvey(survey.id)}
                          sx={{
                            '&:hover': {
                              color: 'error.main',
                            },
                          }}
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </Box>
                </AccordionDetails>
              </Accordion>
            ))
        )}
      </Box>
      </Box>
    </Box>
  );

  const isAnalysisDisabled = hasUnsavedChanges || !currentSurvey || Object.keys(currentSurvey.responses).length === 0;

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
          {/* Mobile Drawer */}
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
          {/* Desktop Drawer */}
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
                <Box sx={{ mt: 4, mb: 3 }}>
                  <Paper sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                      <Typography variant="h6" color= '#023047'>
                        ROI Analysis
                      </Typography>
                      <Tooltip 
                        title={Object.keys(currentResponses).length === 0 ?
                          "Fill in survey before creating report." : 
                          "Save survey progress before creating report."
                        }
                        open={isHovered && isAnalysisDisabled}
                      >
                        <span onMouseEnter={() => setIsHovered(true)}
                              onMouseLeave={() => setIsHovered(false)}
                        >
                          <Button
                            variant="contained"
                            color="primary"
                            startIcon={<QueryStatsIcon />}
                            onClick={() => {
                              getSurveyAnalysis(currentSurvey.name, currentResponses);
                              setAnalysisDialogOpen(true);
                            }}
                            disabled={isLoadingAnalysis || isAnalysisDisabled}
                            sx={{ backgroundColor: "#219EBC", '&:hover': { backgroundColor: "#1A7A94" } }}
                          >
                            {isLoadingAnalysis ? 'Analyzing...' : 'Create Report'}
                          </Button>
                        </span>
                      </Tooltip>
                    </Box>
                    <Typography variant="body2" color="text.secondary">
                      Analyze ROI, payback period, and survey insights, with a PDF report and charts.
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
                      Analysis Results
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
                        <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
                          <LinearProgress color='success'/>
                        </Box>
                      ) : surveyAnalysis && currentSurvey ? (
                        <SurveyAnalysisResults 
                          analysisData={surveyAnalysis}
                          surveyData={currentResponses}             
                          surveyName={currentSurvey.name}
                          ref={surveyResultsRef} 
                        />
                      ) : (
                        <Typography>No analysis data found.</Typography>
                      )}
                    </DialogContent>
                    <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Tooltip 
                        title={
                          <Box>
                            <Typography variant="subtitle2">The ROI insights generated by this tool are automated and may require human review for accuracy and applicability. 
                              We recommend verifying results with a qualified expert before making any business decisions.</Typography>
                          </Box>
                        }
                        arrow
                        placement="top"
                        slotProps={{
                          tooltip: {
                            sx: {
                              backgroundColor: '#3b3b3b',
                            },
                          },
                          arrow: {
                            sx: {
                              color: '#3b3b3b',
                            },
                          },
                        }}
                      >
                        <Typography
                            variant="body2"
                            sx={{
                              border: '1px solid',
                              borderColor: '#f57c00',
                              borderRadius: '4px',
                              padding: '6px 12px',
                              cursor: 'pointer',
                              color: '#f57c00',
                              gap: 1,
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'all 0.3s ease',
                              '&:hover': {
                                transform: 'translateY(-3px)',
                                boxShadow: '0 6px 12px rgba(25, 118, 210, 0.3)',
                              },
                            }}
                            >
                            <PrivacyTipIcon fontSize="small"/>
                            DISCLAIMER
                        </Typography>
                      </Tooltip>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap',  }}>
                        <Button
                          onClick={() => downloadFile(surveyAnalysis.analysisLink)}
                          disabled={isLoadingAnalysis} 
                          variant='outlined'
                          endIcon={<ManageSearchIcon />}
                          sx={{
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-3px)',
                              boxShadow: '0 6px 12px rgba(25, 118, 210, 0.3)',
                            },
                          }}
                        >
                          Download JSON Audit Trail
                        </Button>
                        <Button 
                          onClick={handlePdfDownload} 
                          disabled={!surveyAnalysis || isGeneratingPDF} 
                          variant='outlined'
                          color="success"
                          sx={{
                            color: 'success.main',
                            borderColor: 'success.main',
                            '&:disabled': {
                              opacity: 0.7,
                              borderColor: (theme) => theme.palette.mode === 'light' 
                                ? 'rgba(0, 0, 0, 0.12)' 
                                : 'rgba(255, 255, 255, 0.12)'
                            },
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-3px)',
                              boxShadow: '0 6px 12px rgba(25, 118, 210, 0.3)',
                              borderColor: 'success.dark',
                            },
                          }}
                          endIcon={isGeneratingPDF ?
                            <CircularProgress size={20} color="success" /> : 
                            <FileDownloadIcon color="success" />
                          }
                        >
                          {isGeneratingPDF ? 'Generating PDF...' : 'Download PDF Report'}
                        </Button>
                      </Box>
                    </DialogActions>
                  </Dialog>
                </Box>
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
          savedSurveys={savedSurveys}
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
