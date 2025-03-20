// components/SurveyAnalysisResults.jsx
import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  CardHeader
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import RecommendIcon from '@mui/icons-material/Recommend';

const SurveyAnalysisResults = ({ analysisData }) => {
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
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <MonetizationOnIcon sx={{ mr: 1 }} />
        Technology Adoption Analysis Results
      </Typography>
      
      {/* Summary Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                ROI
              </Typography>
              <Typography variant="h4" sx={{ 
                color: (roiValue > 0) ? 'success.main' : 'error.main',
                display: 'flex',
                alignItems: 'center'
              }}>
                {(roiValue > 0) 
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
      </Paper>
      
      {/* Insights */}
      {analysisData.insights && analysisData.insights.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <LightbulbIcon sx={{ mr: 1 }} />
            Insights
          </Typography>
          
          <Grid container spacing={2}>
            {analysisData.insights.map((insight, index) => (
              <Grid item xs={12} key={`insight-${index}`}>
                <Card elevation={1}>
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
        </Box>
      )}
      
      {/* Recommendations */}
      {analysisData.recommendations && analysisData.recommendations.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
            <RecommendIcon sx={{ mr: 1 }} />
            Recommendations
          </Typography>
          
          <Grid container spacing={2}>
            {analysisData.recommendations.map((recommendation, index) => (
              <Grid item xs={12} key={`recommendation-${index}`}>
                <Card elevation={1} sx={{ bgcolor: 'background.paper' }}>
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
        </Box>
      )}
      
      {/* Additional analysis data could be displayed here */}
      {Object.entries(analysisData)
        .filter(([key]) => !['roi', 'insights', 'recommendations', 'surveyName'].includes(key))
        .map(([key, value]) => {
          // Only render primitive values or simple objects
          if (typeof value !== 'object' || value === null) {
            return (
              <Box key={key} sx={{ mt: 2 }}>
                <Typography variant="subtitle2" color="text.secondary">
                  {key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ')}
                </Typography>
                <Typography variant="body1">
                  {value}
                </Typography>
              </Box>
            );
          }
          return null;
        })}
    </Box>
  );
};

export default SurveyAnalysisResults;
