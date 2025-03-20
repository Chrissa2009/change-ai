// components/SurveyAnalysisResults.jsx
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
// import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
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

  // Extract ROI value from the nested object structure
  const roiValue = analysisData.roi?.value || 0;

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
                        color: (() => {
                        // ROI color ranges using Material UI palette or custom hex colors
                        if (roiValue <= 0.1) return '#FF0000'; // Dark Red - Poor/Negative
                        if (roiValue <= 0.2) return '#FF4500'; // Red-Orange - Below Average
                        if (roiValue <= 0.3) return '#FFA500'; // Orange - Fair
                        if (roiValue <= 0.4) return '#FFD700'; // Yellow-Orange - Moderate
                        if (roiValue <= 0.5) return '#FFFF00'; // Yellow - Average
                        if (roiValue <= 0.6) return '#ADFF2F'; // Yellow-Green - Good
                        if (roiValue <= 0.7) return '#3CB371'; // Light Green - Very Good
                        if (roiValue <= 0.8) return '#3CB371'; // Medium-Green - Outstanding
                        if (roiValue <= 0.9) return '#66BB6A'; // Green - Excellent
                        return '#43A047'; // Deep Green - Exceptional (91-100)
                        })(),
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'bold'
                    }}
                    >
                    {(roiValue > 0.7) 
                        ? <TrendingUpIcon sx={{ mr: 1 }} /> 
                        : <TrendingDownIcon sx={{ mr: 1 }} />}
                    {formatPercentage(roiValue)}
                </Typography>
              </Box>
              
              {analysisData.roi?.explanation && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="subtitle2" color="text.secondary">
                    Explanation
                  </Typography>
                  <Typography variant="body1">
                    {analysisData.roi.explanation}
                  </Typography>
                </Box>
              )}
            </Grid>
          </Grid>
        </AccordionDetails>
      </Accordion>
      
      {/* Insights Accordion */}
      {analysisData.insights && analysisData.insights.length > 0 && (
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
              {analysisData.insights.map((insight, index) => (
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
      {analysisData.recommendations && analysisData.recommendations.length > 0 && (
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
              {analysisData.recommendations.map((recommendation, index) => (
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
      
      {/* Additional Data Accordion */}
      {Object.entries(analysisData)
        .filter(([key]) => !['roi', 'insights', 'recommendations', 'surveyName'].includes(key))
        .length > 0 && (
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
                <Typography variant="h6">Additional Details</Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={2}>
                {Object.entries(analysisData)
                  .filter(([key]) => !['roi', 'insights', 'recommendations', 'surveyName'].includes(key))
                  .map(([key, value]) => {
                    // Only render primitive values or simple objects
                    if (typeof value !== 'object' || value === null) {
                      return (
                        <Grid item xs={12} key={key}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" color="text.secondary">
                              {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                            </Typography>
                            <Typography variant="body1">
                              {value}
                            </Typography>
                          </Box>
                        </Grid>
                      );
                    }
                    return null;
                  })}
              </Grid>
            </AccordionDetails>
          </Accordion>
        )}
    </Box>
  );
};

export default SurveyAnalysisResults;
