// WaterfallChart.js
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  LabelList
} from 'recharts';
import { Typography, Box, Paper, useTheme } from '@mui/material';
import { categorizeQuestionsForWaterfall, generateWaterfallData, calculateRoiPercentage } from './util';
import { surveyQuestions } from '../surveyQuestions';

const WaterfallChart = ({ financialData, title = "Cost-Benefit Analysis" }) => {
  const theme = useTheme();

  // Process the data for the waterfall chart using the utility functions
  const { chartData, roiPercentage } = useMemo(() => {
    if (!financialData || !surveyQuestions) {
      return { chartData: [], roiPercentage: 0 };
    }

    // Step 1: Categorize the questions
    const categorizedQuestions = categorizeQuestionsForWaterfall(surveyQuestions);
    
    // Step 2: Generate the waterfall data
    const waterfallData = generateWaterfallData(financialData, categorizedQuestions);
    
    // Step 3: Calculate ROI percentage
    const roiPercentage = calculateRoiPercentage(waterfallData);

    // Step 4: Process the data for the waterfall chart
    // Convert the array to a format suitable for the Recharts waterfall
    let runningTotal = 0;
    const formattedData = waterfallData.map((item, index) => {
      // For the first item (Total Budget), we want to show it as the starting point
      if (index === 0 && item.isStarting) {
        runningTotal = item.value;
        return {
          name: 'Initial\nBudget',
          fill: theme.palette.info.light,
          value: 0, // No value for starting point in waterfall
          displayValue: item.value,
          total: runningTotal,
          step: "start"
        };
      }
      
      // For the last item (Net ROI), we want to show it as the final result
      if (index === waterfallData.length - 1 && item.isTotal) {
        return {
          name: 'Net\nImpact',
          fill: item.value >= 0 ? theme.palette.success.main : theme.palette.error.main,
          value: 0, // No value for end point in waterfall
          displayValue: item.value,
          total: runningTotal,
          step: "result"
        };
      }
      
      // For regular items, calculate how they affect the running total
      const itemValue = item.value;
      runningTotal += itemValue;
      
      return {
        name: item.name.replace(' ', '\n'), // Add line breaks for better display
        fill: itemValue >= 0 ? theme.palette.success.light : theme.palette.error.light,
        value: itemValue,
        description: item.description,
        total: runningTotal,
        step: itemValue >= 0 ? "benefit" : "cost"
      };
    });

    return { 
      chartData: formattedData,
      roiPercentage: roiPercentage
    };
  }, [financialData, surveyQuestions, theme]);

  // Format currency for tooltip and axis
  const formatCurrency = (value) => {
    if (Math.abs(value) >= 1e6) {
      return `$${(value / 1e6).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1e3) {
      return `$${(value / 1e3).toFixed(0)}K`;
    } else {
      return `$${value.toFixed(0)}`;
    }
  };

  // Custom tooltip for the waterfall chart
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <Paper sx={{ p: 2, boxShadow: 2, maxWidth: 280 }}>
          <Typography variant="subtitle2">{data.name.replace('\n', ' ')}</Typography>
          
          {data.description && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {data.description}
            </Typography>
          )}
          
          {data.step === "start" ? (
            <Typography variant="body2" fontWeight="bold">
              Starting Budget: {formatCurrency(data.displayValue)}
            </Typography>
          ) : data.step === "result" ? (
            <Typography variant="body2" fontWeight="bold" color={data.total >= 0 ? 'success.main' : 'error.main'}>
              Net Impact: {formatCurrency(data.total)}
            </Typography>
          ) : (
            <>
              <Typography variant="body2" color={data.value >= 0 ? 'success.main' : 'error.main'}>
                {data.value >= 0 ? 'Benefit: ' : 'Cost: '} {formatCurrency(Math.abs(data.value))}
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5 }}>
                Running Total: {formatCurrency(data.total)}
              </Typography>
            </>
          )}
        </Paper>
      );
    }
    return null;
  };

  // Get the max absolute value for y-axis scaling
  const maxValue = useMemo(() => {
    if (chartData.length === 0) return 1000;
    
    const max = Math.max(
      ...chartData.map(item => Math.abs(item.total || 0)), 
      ...chartData.map(item => Math.abs(item.value || 0)),
      ...chartData.map(item => Math.abs(item.displayValue || 0))
    );
    return max * 1.2; // Add 20% padding
  }, [chartData]);

  // Custom value label formatting
  const CustomizedLabel = (props) => {
    const { x, y, width, height, value, index } = props;
    const item = chartData[index];
    
    // Don't render for zero values
    if (value === 0 || Math.abs(value) < 100) return null;
    
    // Position the label based on whether the value is positive or negative
    const labelY = value >= 0 ? y - 10 : y + height + 15;
    
    return (
      <g>
        <text 
          x={x + width / 2} 
          y={labelY} 
          fill={theme.palette.text.primary}
          textAnchor="middle" 
          dominantBaseline="middle"
          fontSize={12}
        >
          {formatCurrency(Math.abs(value))}
        </text>
      </g>
    );
  };

  // Final impact and ROI 
  const finalImpact = chartData.length > 0 ? 
    chartData[chartData.length - 1].total : 0;
  const isPositiveROI = finalImpact > 0;

  if (!financialData || !surveyQuestions || chartData.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 2, mb: 4 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          Financial data or survey questions not available for the waterfall chart.
        </Typography>
      </Paper>
    );
  }

  return (
    <Box sx={{ width: '100%', height: 550, mt: 2, mb: 2 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      <Typography 
        variant="subtitle1" 
        align="center" 
        color={isPositiveROI ? 'success.main' : 'error.main'}
        gutterBottom
        fontWeight="bold"
      >
        ROI: {roiPercentage.toFixed(1)}% ({isPositiveROI ? 'Positive' : 'Negative'} Return)
      </Typography>
      <Typography 
        variant="subtitle2" 
        align="center" 
        color="text.secondary" 
        gutterBottom
        sx={{ mb: 2 }}
      >
        Net Financial Impact: {formatCurrency(finalImpact)}
      </Typography>
      
      <ResponsiveContainer width="100%" height="82%">
        <BarChart
          data={chartData}
          margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
          barCategoryGap={2}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="name" 
            interval={0}
            tickLine={false}
            angle={0}
            textAnchor="middle"
            height={60}
            tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
          />
          <YAxis 
            tickFormatter={formatCurrency}
            domain={[-maxValue, maxValue]}
            tickLine={false}
            axisLine={{ stroke: theme.palette.divider }}
            tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend verticalAlign="top" height={36} />
          <ReferenceLine y={0} stroke={theme.palette.divider} strokeWidth={2} />
          <defs>
            <linearGradient id="colorPositive" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.success.light} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={theme.palette.success.light} stopOpacity={0.6}/>
            </linearGradient>
            <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={theme.palette.error.light} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={theme.palette.error.light} stopOpacity={0.6}/>
            </linearGradient>
          </defs>
          
          {/* Main bars */}
          <Bar 
            dataKey="value" 
            radius={[4, 4, 0, 0]} 
            isAnimationActive={true}
            animationDuration={800}
            animationEasing="ease-in-out"
          >
            <LabelList dataKey="value" content={<CustomizedLabel />} />
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.fill || (entry.value >= 0 ? 'url(#colorPositive)' : 'url(#colorNegative)')} 
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      
      <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>
        This chart shows the financial impact breakdown of implementing this technology solution
      </Typography>
    </Box>
  );
};

export default WaterfallChart;
