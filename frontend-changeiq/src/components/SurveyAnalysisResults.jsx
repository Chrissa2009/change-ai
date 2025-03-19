import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import TimerIcon from '@mui/icons-material/Timer';

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

  // Format currency for display
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(value);
  };

  // Format percentage for display
  const formatPercentage = (value) => {
    if (value === undefined || value === null) return 'N/A';
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <MonetizationOnIcon sx={{ mr: 1 }} />
        ROI Analysis Results
      </Typography>
      
      {/* Summary Section */}
      <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                ROI
              </Typography>
              <Typography variant="h4" sx={{ 
                color: (analysisData.roi > 0) ? 'success.main' : 'error.main',
                display: 'flex',
                alignItems: 'center'
              }}>
                {(analysisData.roi > 0) 
                  ? <TrendingUpIcon sx={{ mr: 1 }} /> 
                  : <TrendingDownIcon sx={{ mr: 1 }} />}
                {formatPercentage(analysisData.roi)}
              </Typography>
            </Box>
            
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Payback Period
              </Typography>
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center' }}>
                <TimerIcon sx={{ mr: 1, fontSize: 20 }} />
                {analysisData.payback_period ? `${analysisData.payback_period} months` : 'N/A'}
              </Typography>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" color="text.secondary">
                Net Present Value
              </Typography>
              <Typography variant="h5">
                {formatCurrency(analysisData.npv)}
              </Typography>
            </Box>
            
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Total Cost of Ownership
              </Typography>
              <Typography variant="h6">
                {formatCurrency(analysisData.total_cost)}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Benefits & Costs */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Benefits</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {analysisData.benefits ? (
              <List dense>
                {Object.entries(analysisData.benefits).map(([key, value]) => (
                  <ListItem key={key}>
                    <ListItemText 
                      primary={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      secondary={formatCurrency(value)}
                    />
                    <Chip 
                      label={formatCurrency(value)} 
                      color="success" 
                      size="small" 
                      variant="outlined"
                    />
                  </ListItem>
                ))}
                <Divider sx={{ my: 1 }} />
                <ListItem>
                  <ListItemText 
                    primary="Total Benefits"
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                  <Chip 
                    label={formatCurrency(analysisData.total_benefits)} 
                    color="success" 
                    size="small" 
                  />
                </ListItem>
              </List>
            ) : (
              <Typography color="text.secondary">No benefits data available</Typography>
            )}
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>Costs</Typography>
            <Divider sx={{ mb: 2 }} />
            
            {analysisData.costs ? (
              <List dense>
                {Object.entries(analysisData.costs).map(([key, value]) => (
                  <ListItem key={key}>
                    <ListItemText 
                      primary={key.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                      secondary={formatCurrency(value)}
                    />
                    <Chip 
                      label={formatCurrency(value)} 
                      color="error" 
                      size="small" 
                      variant="outlined"
                    />
                  </ListItem>
                ))}
                <Divider sx={{ my: 1 }} />
                <ListItem>
                  <ListItemText 
                    primary="Total Costs"
                    primaryTypographyProps={{ fontWeight: 'bold' }}
                  />
                  <Chip 
                    label={formatCurrency(analysisData.total_cost)} 
                    color="error" 
                    size="small" 
                  />
                </ListItem>
              </List>
            ) : (
              <Typography color="text.secondary">No costs data available</Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
      
      {/* Recommendations & Insights */}
      {analysisData.recommendations && (
        <Accordion sx={{ mt: 3 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Recommendations</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              {analysisData.recommendations}
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}
      
      {analysisData.insights && (
        <Accordion sx={{ mt: 2 }}>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant="h6">Insights</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body1" paragraph>
              {analysisData.insights}
            </Typography>
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default SurveyAnalysisResults;
