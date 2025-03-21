import React, { useState } from 'react';
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

const SurveyAnalysisResults = ({ analysisData }) => {
  const [expandedState, setExpandedState] = useState({
    panel1: true,
    panel2: true,
    panel3: true,
  });

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

  console.log('Rendering analysis results with data:', analysisData);

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
    <Box sx={{ mt: 1 }}>
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
                  {isRoiPercentage ? formatPercentage(roiValue) : formatCurrency(roiValue)}
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
                    }}>
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
                    }}>
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
      
      {/* Additional Data - Summary Accordion */}
      {analysisData.summaryData && (
        <Accordion 
          expanded={expandedState.panel4} 
          onChange={handleAccordionToggle('panel4')}
          sx={{ 
            '&.Mui-expanded': {
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
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
              <AssessmentIcon sx={{ mr: 1, color: '#219EBC' }} />
              <Typography variant="h6">Summary</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1">
              {analysisData.summaryData}
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default SurveyAnalysisResults;