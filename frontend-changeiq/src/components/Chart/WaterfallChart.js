// WaterfallChart.js
import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
  LabelList,
} from 'recharts';
import { 
  Typography, 
  Box, 
  Paper, 
  useTheme,
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
} from '@mui/material';
import { categorizeQuestionsForWaterfall, generateWaterfallData, calculateRoiPercentage, formatCurrency } from './util';
import { surveyQuestions } from '../surveyQuestions';

const WaterfallChart = ({ financialData, title = "Cost-Benefit Analysis" }) => {
  const theme = useTheme();
  // Process the data for the waterfall chart using the utility functions
  const { chartData } = useMemo(() => {
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
          value: item.value,
          displayValue: item.value,
          total: runningTotal,
          description: item.description || "Starting Budget",
          step: "start"
        };
      }
      
      // For the last item (Net ROI), we want to show it as the final result
      if (index === waterfallData.length - 1 && item.isTotal) {
        return {
          name: 'Net\nImpact',
          fill: runningTotal >= 0 ? theme.palette.success.main : theme.palette.error.main,
          value: runningTotal,
          displayValue: item.value,
          total: runningTotal,
          description: item.description || `Overall impact: ${runningTotal >= 0 ? "Positive" : "Negative"} change of ${formatCurrency(Math.abs(runningTotal))}`,
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
        displayValue: itemValue, // Adding for consistency
        description: item.description,
        total: runningTotal,
        step: itemValue >= 0 ? "benefit" : "cost"
      };
    });

    return { 
      chartData: formattedData,
      roiPercentage: roiPercentage
    };
  }, [financialData, theme]);



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
    const { x, y, width, value } = props;
    // const item = chartData[index]; 
    
    // Don't render for zero values
    if (value === 0 || Math.abs(value) < 100) return null;
    
    // Position the label based on whether the value is positive or negative
    const labelY = value >= 0 ? y - 10 : y + 10;
    
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
  // const isPositiveROI = finalImpact > 0;

  if (!financialData || !surveyQuestions || chartData.length === 0) {
    return (
      <Paper sx={{ p: 3, mt: 2, mb: 4 }}>
        <Typography variant="body1" color="text.secondary" align="center">
          Financial data or survey questions not available for the waterfall chart.
        </Typography>
      </Paper>
    );
  }
  // Debug logging
  // console.log('Chart Data for table:', chartData.map(item => ({
  //   name: item.name,
  //   value: item.value, 
  //   total: item.total,
  //   runningTotal: item.runningTotal, 
  //   // Log all potential properties
  //   allProps: Object.keys(item)
  // })));

  return (
    <Box sx={{ width: '100%', mt: 2, mb: 2 }}>
      <Typography variant="h6" align="center" gutterBottom>
        {title}
      </Typography>
      {/* <Typography 
        variant="subtitle1" 
        align="center" 
        color={isPositiveROI ? 'success.main' : 'error.main'}
        gutterBottom
        fontWeight="bold"
      >
        ROI: {roiPercentage.toFixed(1)}% ({isPositiveROI ? 'Positive' : 'Negative'} Return)
      </Typography> */}
      <Typography 
        variant="subtitle2" 
        align="center" 
        color="text.secondary" 
        gutterBottom
        sx={{ mb: 2 }}
      >
        Net Financial Impact: {formatCurrency(finalImpact)}
      </Typography>

      {/* Chart Component */}
      <Box sx={{ 
        width: '100%', 
        mb: 4,
        overflow: 'hidden' // Ensure chart stays within container
      }}>
        <ResponsiveContainer width="100%" minHeight={500}>
        {/* <ResponsiveContainer width="100%" height="100%"> */}
          <BarChart
            data={chartData}
            margin={{ top: 30, right: 30, left: 20, bottom: 80 }}
            barCategoryGap={2}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis 
              dataKey="name" 
              tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
              angle={-45}  // Rotate text by -45 degrees
              textAnchor="end"  // Align text at the end
              height={60}  // Increase height for rotated labels
              interval={0}  // Display all labels
            />
            <YAxis 
              tickFormatter={formatCurrency}
              domain={[-maxValue, maxValue]}
              tickLine={false}
              axisLine={{ stroke: theme.palette.divider }}
              tick={{ fontSize: 12, fill: theme.palette.text.secondary }}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* <Legend verticalAlign="top" height={36} /> */}
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
      </Box>

      {/* Add data table */}
      <Box sx={{ 
        width: '100%',
        overflowX: 'auto', // Enable horizontal scrolling if needed
        mt: 2
      }}>
      <TableContainer component={Paper} sx={{ mt: 3, mb: 2 }}>
        <Table size="small" aria-label="financial breakdown table">
          <TableHead>
            <TableRow>
              <TableCell>Category</TableCell>
              <TableCell align="right">Value</TableCell>
              <TableCell align="right">Running Total</TableCell>
              <TableCell>Description</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {chartData.map((row, index) => (
              <TableRow 
                key={index}
                sx={{ 
                  '&:last-child td, &:last-child th': { border: 0 },
                  backgroundColor: row.isTotal ? 'rgba(130, 202, 157, 0.1)' : 
                                 row.isInitial ? 'rgba(136, 132, 216, 0.1)' : 
                                 'inherit'
                }}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right" sx={{ 
                  color: row.value > 0 ? 'success.main' : 
                          row.value < 0 ? 'error.main' : 
                          'text.primary',
                  fontWeight: row.isTotal || row.isInitial ? 'bold' : 'normal'
                }}>
                  {formatCurrency(row.value)}
                  {/* {row.value} */}
                </TableCell>
                <TableCell align="right">
                  {formatCurrency(row.total)}
                  {/* {row.runningTotal} */}
                </TableCell>
                <TableCell>
                  {row.description || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      </Box>

      <Box sx={{ mt: 2, width: '100%' }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          {/* Summary card content */}
          <Typography variant="body2" align="center" color="text.secondary" sx={{ mt: 1 }}>
            This chart shows the financial impact breakdown of implementing this technology solution
          </Typography>
        </Paper>
      </Box>
    </Box>
  );
};

export default WaterfallChart;
