// SurveyAnalysisResults.js
import React, { useState, useRef, forwardRef, useImperativeHandle } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import RecommendIcon from '@mui/icons-material/Recommend';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AssessmentIcon from '@mui/icons-material/Assessment';
import EqualizerIcon from '@mui/icons-material/Equalizer';
import InsightsIcon from '@mui/icons-material/Insights';
import WaterfallChart from './Chart/WaterfallChart';

// Convert component to use forwardRef
const SurveyAnalysisResults = forwardRef(({ analysisData, surveyData, surveyName }, ref) => {
console.log('surveyName', surveyName);
  const [expandedState, setExpandedState] = useState({
    panel1: true, // ROI Summary
    panel2: true, // Insights
    panel3: true, // Recommendations
    panel4: true, // Chart
  });

  // Create a ref for the content container
  const contentRef = useRef(null);

  // Expose methods to parent components through ref
  useImperativeHandle(ref, () => ({
    // Method to expand all panels for PDF generation
    expandAllPanels: () => {
      setExpandedState({
        panel1: true,
        panel2: true,
        panel3: true,
        panel4: true,
      });
    },
    // Method to get the content DOM element for PDF generation
    getContentElement: () => contentRef.current,
    // Method to restore original panel state
    restorePanelState: (originalState) => {
      setExpandedState(originalState);
    },
    // Method to get current panel state
    getCurrentPanelState: () => {
      return {...expandedState};
    }
  }));

  // Toggle individual panel expanded state
  const handleAccordionToggle = (panelId) => (event, isExpanded) => {
    setExpandedState({
      ...expandedState,
      [panelId]: isExpanded
    });
  };

  if (!analysisData) {
    return (
      <Paper sx={{ p: 3, mt: 2, mb: 4 }}>
        <Typography variant="h6" color="text.secondary" align="center">
          No analysis data available. Run an analysis first.
        </Typography>
      </Paper>
    );
  }

  // Format percentage for display
  const formatPercentage = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  // Format currency for ROI value if it's a large number
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return 'N/A';
    // If value is very large, format as currency with appropriate abbreviation
    if (Math.abs(value) >= 1e9) {
      return `$${(value / 1e9).toFixed(1)}B`;
    } else if (Math.abs(value) >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1e3) {
      return `$${(value / 1e3).toFixed(1)}K`;
    } else {
      return `$${value.toFixed(2)}`;
    }
  };

  // Extract data from the new nested structure
  const responseData = analysisData?.analysisData?.response || {};
  
  // Get ROI value
  const roiValue = responseData.roi?.value || 0;
  const roiExplanation = responseData.roi?.explanation || '';
  
  // Get insights and recommendations arrays
  const insights = responseData.insights || [];
  const recommendations = responseData.recommendations || [];

  // Check if ROI is a percentage or a raw value
  const isRoiPercentage = roiValue >= -1 && roiValue <= 1;
  
  return (
    <Box sx={{ mt: 1 }} ref={contentRef}>
      <Box id="pdf-title-section" sx={{ 
        // display: 'none', 
        mb: 4,
        backgroundColor: '#023047',
        color: 'white',
        p: 2,
        borderRadius: 1,
        '@media print': {
        display: 'block !important',
        padding: '20px !important',
        marginBottom: '30px !important',
        '& h4': {
        fontSize: '24pt !important',
        lineHeight: '1.2 !important'
        },
        '& .MuiSvgIcon-root': {
        fontSize: '28pt !important',
        marginRight: '8px !important'
        }
    }
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} className="pdf-logo-container">
          <InsightsIcon sx={{ 
            fontSize: 30, 
            color: '#FFB703', 
            mr: 1 
          }} />
          <Typography variant="h4" 
          className="pdf-logo-text"
          sx={{ 
            fontFamily: '"Space Grotesk", sans-serif',
            color: '#FB8500',
            lineHeight: 1.2
          }}>
            change.ai
          </Typography>
        </Box>
        <Typography variant="subtitle2" 
        className="pdf-logo-subtext"
        sx={{ 
          color: '#8ecae6',
          textAlign: 'center',
          mt: 1,
          fontSize: '0.8rem'
        }}>
          AI Calculations. Human Decisions.
        </Typography>
      </Box>

        {/* Survey Name and Date */}
        <Box 
            id="pdf-survey-info"
            sx={{ 
            // display: 'none',
            '@media print': {
                display: 'block !important',
                textAlign: 'center',
                marginBottom: '20px !important',
                '& h3': {
                fontSize: '20pt !important',
                color: '#023047 !important',
                marginBottom: '8px !important'
                },
                '& h5': {
                fontSize: '14pt !important',
                color: '#666 !important'
                }
            }
            }}
        >
            <Typography variant="h5">
                {surveyName}
            </Typography>
        </Box>

      {/* ROI Summary Accordion */}
      <Accordion 
        expanded={expandedState.panel1} 
        onChange={handleAccordionToggle('panel1')}
        sx={{ 
          mb: 2, 
          '&.Mui-expanded': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
          }
        }}
      >
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
          sx={{ backgroundColor: 'rgba(33, 158, 188, 0.08)' }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <AssessmentIcon sx={{ mr: 1, color: '#219EBC' }} />
            <Typography variant="h6">ROI Summary</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  ROI
                </Typography>
                <Typography 
                  variant="h4" 
                  sx={{ 
                    color: roiValue > 0 ? '#43A047' : '#FF0000',
                    display: 'flex',
                    alignItems: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {roiValue > 0 
                    ? <TrendingUpIcon sx={{ mr: 1 }} /> 
                    : <TrendingDownIcon sx={{ mr: 1 }} />}
                  {formatPercentage(roiValue)}
                </Typography>
              </Box>
              
              {roiExplanation && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Explanation
                  </Typography>
                  <Typography variant="body1">
                    {roiExplanation}
                  </Typography>
                </Box>
              )}
              { analysisData && analysisData.summaryData && (
                <Box sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  Summary
                </Typography>
                <Typography variant="body1">
                {analysisData.summaryData}
                </Typography>
              </Box>
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* Insights Accordion */}
      {insights.length > 0 && (
        <Accordion 
          expanded={expandedState.panel2} 
          onChange={handleAccordionToggle('panel2')}
          sx={{ 
            mb: 2, 
            '&.Mui-expanded': {
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
            sx={{ backgroundColor: 'rgba(33, 158, 188, 0.08)' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <LightbulbIcon sx={{ mr: 1, color: '#219EBC' }} />
              <Typography variant="h6">Key Insights</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {insights.map((insight, index) => (
                <Grid item xs={12} key={`insight-${index}`}>
                  <Card 
                    elevation={1}   
                    sx={{ 
                      border: 'none',
                      boxShadow: 'none'
                    }}
                    className="no-break" // Added for PDF page breaks
                  >
                    <CardHeader 
                      title={insight.title}
                      subheader={insight.description}
                    />
                    <CardContent>
                      <Typography variant="body1">
                        {insight.contents}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}
      
      {/* Recommendations Accordion */}
      {recommendations.length > 0 && (
        <Accordion 
          expanded={expandedState.panel3} 
          onChange={handleAccordionToggle('panel3')}
          sx={{ 
            mb: 2, 
            '&.Mui-expanded': {
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
            }
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel3-content"
            id="panel3-header"
            sx={{ backgroundColor: 'rgba(33, 158, 188, 0.08)' }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <RecommendIcon sx={{ mr: 1, color: '#219EBC' }} />
              <Typography variant="h6">Recommendations</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              {recommendations.map((recommendation, index) => (
                <Grid item xs={12} key={`recommendation-${index}`}>
                  <Card 
                    elevation={1}   
                    sx={{ 
                      border: 'none',
                      boxShadow: 'none'
                    }}
                    className="no-break" // Added for PDF page breaks
                  >
                    <CardHeader 
                      title={recommendation.title}
                      subheader={recommendation.description}
                    />
                    <CardContent>
                      <Typography variant="body1">
                        {recommendation.contents}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </AccordionDetails>
        </Accordion>
      )}

      {/* Financial Visualization Accordion with Waterfall Chart */}
        <Accordion 
        expanded={expandedState.panel4} 
        onChange={handleAccordionToggle('panel4')}
        sx={{ 
            mb: 2, 
            '&.Mui-expanded': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
            },    
            overflow: 'visible',
            '& .MuiCollapse-root': {
              overflow: 'visible'
            }
        }}
        >
        <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel4-content"
            id="panel4-header"
            sx={{ backgroundColor: 'rgba(33, 158, 188, 0.08)' }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <EqualizerIcon sx={{ mr: 1, color: '#219EBC' }} />
                <Typography variant="h6">Financial Impact Breakdown</Typography>
            </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ 
    // Remove fixed padding bottom
            py: 2, 
            px: { xs: 1, sm: 2 },
            // Allow content to determine size
            display: 'flex', 
            flexDirection: 'column',
            minHeight: 600, // Provide minimum height for chart
            overflow: 'visible' // Important: allow content to be visible
        }}>
                <WaterfallChart 
                    financialData={surveyData}
                    title="Cost-Benefit Waterfall Analysis" 
                />
        </AccordionDetails>
        </Accordion>
      
      {/* Add a footer that will only appear in the PDF */}
      <Box 
        id="pdf-footer-section" 
        sx={{ 
          mt: 4, 
          pt: 2, 
          borderTop: '1px solid #eee', 
          textAlign: 'center', 
          display: 'none', // Hidden by default, will be shown for PDF
          pb: 3 
        }}
      >
        <Typography variant="body2" color="text.secondary">
          Generated by ChangeAI on {new Date().toLocaleString()}
        </Typography>        
        <Typography variant="body2" color="text.secondary">
          Disclaimer: The ROI insights generated by this tool are automated and may require human review for accuracy and applicability. We recommend verifying results with a qualified expert before making any business decisions.
        </Typography>
      </Box>
    </Box>
  );
});

export default SurveyAnalysisResults;
