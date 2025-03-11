import React, { useState } from 'react';
import {
  Paper,
  Box,
  Stepper,
  Step,
  StepLabel,
  Typography,
  Button,
  TextField,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Rating,
  Divider,
  MenuItem
} from '@mui/material';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';

// Survey questions
// Survey questions for technology adoption ROI calculation
const surveyQuestions = [
    {
      section: 'Initial Investment Assessment',
      questions: [
        {
          id: 'total_budget',
          type: 'text',
          label: 'What is your total budget for this technology implementation?',
          required: true,
        },
        {
          id: 'upfront_cost',
          type: 'text',
          label: 'What is the expected upfront cost of purchasing/licensing the technology?',
          required: true,
        },
        {
          id: 'setup_cost',
          type: 'text',
          label: 'How much do you expect to spend on initial setup and configuration?',
          required: true,
        },
        {
          id: 'training_cost',
          type: 'text',
          label: 'What are the estimated costs for staff training on the new technology?',
          required: true,
        },
        {
          id: 'additional_staff',
          type: 'radio',
          label: 'Will you need to hire additional staff or consultants for implementation?',
          options: [
            'Yes',
            'No',
            'Unsure'
          ],
          required: true,
        },
        {
          id: 'additional_staff_cost',
          type: 'text',
          label: 'If yes, what is the estimated cost for additional staff or consultants?',
          required: false,
        },
        {
          id: 'hardware_upgrades',
          type: 'radio',
          label: 'Do you anticipate any hardware upgrades to support this technology?',
          options: [
            'Yes',
            'No',
            'Unsure'
          ],
          required: true,
        },
        {
          id: 'hardware_cost',
          type: 'text',
          label: 'If yes, what is the estimated cost for hardware upgrades?',
          required: false,
        },
        {
          id: 'infrastructure_changes',
          type: 'text',
          label: 'What infrastructure changes (if any) will be required to support this technology?',
          multiline: true,
          required: false,
        }
      ]
    },
    {
      section: 'Implementation Timeline & Costs',
      questions: [
        {
          id: 'implementation_timeline',
          type: 'select',
          label: 'What is your expected timeline for full implementation?',
          options: [
            'Less than 3 months',
            '3-6 months',
            '6-12 months',
            '1-2 years',
            'More than 2 years'
          ],
          required: true,
        },
        {
          id: 'staff_hours',
          type: 'text',
          label: 'How many staff hours will be dedicated to implementation?',
          required: true,
        },
        {
          id: 'hourly_cost',
          type: 'text',
          label: 'What is the average hourly cost of the staff involved in implementation?',
          required: true,
        },
        {
          id: 'productivity_loss',
          type: 'radio',
          label: 'Do you expect productivity loss during the transition period?',
          options: [
            'Yes',
            'No',
            'Unsure'
          ],
          required: true,
        },
        {
          id: 'productivity_loss_cost',
          type: 'text',
          label: 'If yes, how do you quantify this productivity loss (in monetary terms)?',
          required: false,
        },
        {
          id: 'phased_rollout',
          type: 'radio',
          label: 'Will there be a phased rollout with separate cost stages?',
          options: [
            'Yes',
            'No',
            'Unsure'
          ],
          required: true,
        },
        {
          id: 'phased_rollout_details',
          type: 'text',
          label: 'If yes, please describe the phases and associated costs',
          multiline: true,
          required: false,
        }
      ]
    },
    {
      section: 'Ongoing Operational Costs',
      questions: [
        {
          id: 'annual_maintenance',
          type: 'text',
          label: 'What are the expected annual maintenance/support costs?',
          required: true,
        },
        {
          id: 'subscription_fee',
          type: 'text',
          label: 'What is the projected monthly/annual subscription fee (if applicable)?',
          required: false,
        },
        {
          id: 'staff_maintain',
          type: 'text',
          label: 'How many staff will be required to maintain the system?',
          required: true,
        },
        {
          id: 'technology_lifespan',
          type: 'select',
          label: 'What is the expected lifespan of this technology before requiring replacement/major upgrade?',
          options: [
            'Less than 1 year',
            '1-3 years',
            '3-5 years',
            '5-10 years',
            'More than 10 years'
          ],
          required: true,
        },
        {
          id: 'compliance_costs',
          type: 'radio',
          label: 'Are there any compliance or regulatory costs associated with this technology?',
          options: [
            'Yes',
            'No',
            'Unsure'
          ],
          required: true,
        },
        {
          id: 'compliance_costs_details',
          type: 'text',
          label: 'If yes, please describe these compliance/regulatory costs',
          multiline: true,
          required: false,
        }
      ]
    },
    {
      section: 'Expected Benefits & Revenue Impact',
      questions: [
        {
          id: 'revenue_impact',
          type: 'select',
          label: 'How do you expect this technology to impact your revenue?',
          options: [
            'Significant increase (>20%)',
            'Moderate increase (10-20%)',
            'Slight increase (1-10%)',
            'No change',
            'Decrease'
          ],
          required: true,
        },
        {
          id: 'business_processes',
          type: 'text',
          label: 'What specific business processes will this technology improve?',
          multiline: true,
          required: true,
        },
        {
          id: 'efficiency_improvement',
          type: 'select',
          label: 'By what percentage do you expect efficiency to improve in these processes?',
          options: [
            'Less than 10%',
            '10-25%',
            '26-50%',
            '51-75%',
            'More than 75%'
          ],
          required: true,
        },
        {
          id: 'labor_hours_saved',
          type: 'text',
          label: 'How many labor hours do you expect to save weekly/monthly/annually?',
          required: true,
        },
        {
          id: 'saved_hours_value',
          type: 'text',
          label: 'What is the monetary value of these saved hours?',
          required: true,
        },
        {
          id: 'scaling_operations',
          type: 'text',
          label: 'How will this technology affect your ability to scale operations?',
          multiline: true,
          required: true,
        },
        {
          id: 'new_markets',
          type: 'radio',
          label: 'Will this technology enable you to enter new markets or reach new customers?',
          options: [
            'Yes',
            'No',
            'Unsure'
          ],
          required: true,
        },
        {
          id: 'new_markets_details',
          type: 'text',
          label: 'If yes, please describe the new market opportunities',
          multiline: true,
          required: false,
        }
      ]
    },
    {
      section: 'Risk Assessment',
      questions: [
        {
          id: 'implementation_delays',
          type: 'select',
          label: 'What is the probability of implementation delays?',
          options: [
            'Very low (<10%)',
            'Low (10-25%)',
            'Medium (26-50%)',
            'High (51-75%)',
            'Very high (>75%)'
          ],
          required: true,
        },
        {
          id: 'delay_cost_impact',
          type: 'text',
          label: 'What would be the cost impact of implementation delays?',
          required: true,
        },
        {
          id: 'adoption_risk',
          type: 'select',
          label: 'What is the risk of lower-than-expected adoption rates among users?',
          options: [
            'Very low risk',
            'Low risk',
            'Medium risk',
            'High risk',
            'Very high risk'
          ],
          required: true,
        },
        {
          id: 'contingency_budget',
          type: 'text',
          label: 'What contingency budget have you set aside for unexpected issues?',
          required: true,
        },
        {
          id: 'integration_challenges',
          type: 'text',
          label: 'Have you identified potential integration challenges with existing systems?',
          multiline: true,
          required: true,
        }
      ]
    },
    {
      section: 'Customer & Market Impact',
      questions: [
        {
          id: 'customer_satisfaction',
          type: 'text',
          label: 'How will this technology improve customer satisfaction? How do you measure this?',
          multiline: true,
          required: true,
        },
        {
          id: 'customer_churn',
          type: 'select',
          label: 'Do you expect this technology to reduce customer churn? By what percentage?',
          options: [
            'No reduction expected',
            'Slight reduction (1-5%)',
            'Moderate reduction (6-10%)',
            'Significant reduction (11-20%)',
            'Major reduction (>20%)'
          ],
          required: true,
        },
        {
          id: 'pricing_impact',
          type: 'radio',
          label: 'Will this technology allow you to increase prices or offer premium services?',
          options: [
            'Yes',
            'No',
            'Unsure'
          ],
          required: true,
        },
        {
          id: 'competitive_position',
          type: 'select',
          label: 'How will this technology affect your competitive position in the market?',
          options: [
            'Significant advantage',
            'Moderate advantage',
            'Slight advantage',
            'Keep pace with competitors',
            'No impact'
          ],
          required: true,
        }
      ]
    },
    {
      section: 'Productivity Metrics',
      questions: [
        {
          id: 'automated_processes',
          type: 'text',
          label: 'How many manual processes will be automated with this technology?',
          required: true,
        },
        {
          id: 'current_process_time',
          type: 'text',
          label: 'What is the current time spent on these processes?',
          required: true,
        },
        {
          id: 'expected_time_reduction',
          type: 'select',
          label: 'What is the expected time reduction for these processes after implementation?',
          options: [
            'Less than 10%',
            '10-25%',
            '26-50%',
            '51-75%',
            'More than 75%'
          ],
          required: true,
        },
        {
          id: 'error_reduction',
          type: 'text',
          label: 'How many fewer errors do you expect with the new technology?',
          required: true,
        },
        {
          id: 'error_cost',
          type: 'text',
          label: 'What is the current cost of errors that might be reduced?',
          required: true,
        }
      ]
    },
    {
      section: 'Quality & Output Improvements',
      questions: [
        {
          id: 'quality_improvement',
          type: 'text',
          label: 'Will this technology improve the quality of your products/services? How do you measure this?',
          multiline: true,
          required: true,
        },
        {
          id: 'output_increase',
          type: 'select',
          label: 'Do you expect increased output/production capacity? By what percentage?',
          options: [
            'No increase expected',
            'Slight increase (1-10%)',
            'Moderate increase (11-25%)',
            'Significant increase (26-50%)',
            'Major increase (>50%)'
          ],
          required: true,
        },
        {
          id: 'time_to_market',
          type: 'text',
          label: 'How will this technology affect your time-to-market for new products/services?',
          multiline: true,
          required: true,
        },
        {
          id: 'resource_usage',
          type: 'radio',
          label: 'Will this technology reduce waste or resource usage?',
          options: [
            'Yes',
            'No',
            'Unsure'
          ],
          required: true,
        },
        {
          id: 'resource_reduction_amount',
          type: 'text',
          label: 'If yes, by what amount will waste or resource usage be reduced?',
          required: false,
        }
      ]
    },
    {
      section: 'Employee Impact & Adoption',
      questions: [
        {
          id: 'workforce_percentage',
          type: 'select',
          label: 'What percentage of your workforce will use this technology?',
          options: [
            'Less than 10%',
            '10-25%',
            '26-50%',
            '51-75%',
            '76-90%',
            'More than 90%'
          ],
          required: true,
        },
        {
          id: 'adoption_rate_3months',
          type: 'select',
          label: 'What is your expected adoption rate after 3 months?',
          options: [
            'Less than 25%',
            '25-50%',
            '51-75%',
            'More than 75%'
          ],
          required: true,
        },
        {
          id: 'adoption_rate_12months',
          type: 'select',
          label: 'What is your expected adoption rate after 12 months?',
          options: [
            'Less than 25%',
            '25-50%',
            '51-75%',
            '76-90%',
            'More than 90%'
          ],
          required: true,
        },
        {
          id: 'employee_satisfaction',
          type: 'text',
          label: 'How do you expect this technology to impact employee satisfaction?',
          multiline: true,
          required: true,
        },
        {
          id: 'adoption_resistance',
          type: 'radio',
          label: 'Do you anticipate any resistance to adoption?',
          options: [
            'Significant resistance',
            'Moderate resistance',
            'Slight resistance',
            'No resistance'
          ],
          required: true,
        },
        {
          id: 'adoption_metrics',
          type: 'text',
          label: 'What metrics will you use to measure successful adoption?',
          multiline: true,
          required: true,
        }
      ]
    },
    {
      section: 'Long-term Strategic Value',
      questions: [
        {
          id: 'strategic_alignment',
          type: 'text',
          label: 'How does this technology align with your 3-5 year strategic goals?',
          multiline: true,
          required: true,
        },
        {
          id: 'competitive_advantages',
          type: 'text',
          label: 'What long-term competitive advantages do you expect from this investment?',
          multiline: true,
          required: true,
        },
        {
          id: 'growth_contribution',
          type: 'text',
          label: 'How will you measure the technology\'s contribution to business growth?',
          multiline: true,
          required: true,
        },
        {
          id: 'payback_period',
          type: 'select',
          label: 'What is your expected payback period for this technology investment?',
          options: [
            'Less than 6 months',
            '6-12 months',
            '1-2 years',
            '2-3 years',
            '3-5 years',
            'More than 5 years'
          ],
          required: true,
        },
        {
          id: 'roi_kpis',
          type: 'text',
          label: 'What specific KPIs will you use to measure ROI on this technology?',
          multiline: true,
          required: true,
        },
        {
          id: 'minimum_roi',
          type: 'select',
          label: 'What is your minimum acceptable ROI percentage for this investment?',
          options: [
            'Less than 10%',
            '10-25%',
            '26-50%',
            '51-100%',
            'More than 100%'
          ],
          required: true,
        }
      ]
    },
    {
      section: 'Previous Technology Experience & Post-Implementation',
      questions: [
        {
          id: 'previous_implementation',
          type: 'radio',
          label: 'Have you implemented similar technologies before?',
          options: [
            'Yes',
            'No'
          ],
          required: true,
        },
        {
          id: 'previous_roi',
          type: 'text',
          label: 'If yes, what was the ROI of previous similar implementations?',
          required: false,
        },
        {
          id: 'implementation_lessons',
          type: 'text',
          label: 'What lessons from previous technology adoptions will you apply to this implementation?',
          multiline: true,
          required: false,
        },
        {
          id: 'roi_review_frequency',
          type: 'select',
          label: 'How frequently will you review the actual vs. projected ROI?',
          options: [
            'Monthly',
            'Quarterly',
            'Bi-annually',
            'Annually',
            'Less than annually'
          ],
          required: true,
        },
        {
          id: 'reassessment_criteria',
          type: 'text',
          label: 'What criteria would trigger a reassessment of the technology investment?',
          multiline: true,
          required: true,
        },
        {
          id: 'exit_strategy',
          type: 'text',
          label: 'What is your exit strategy if the technology fails to deliver expected ROI?',
          multiline: true,
          required: true,
        }
      ]
    }
  ];
  

function SurveyForm({ onSubmit }) {
  const [activeStep, setActiveStep] = useState(0);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});

  const handleNext = () => {
    // Validate current section before proceeding
    const currentSection = surveyQuestions[activeStep];
    const newErrors = {};
    
    currentSection.questions.forEach(question => {
      if (question.required && (!responses[question.id] || responses[question.id] === '')) {
        newErrors[question.id] = 'This field is required';
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    if (activeStep === surveyQuestions.length - 1) {
      // If this is the last step, submit the form
      onSubmit(responses);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleInputChange = (id, value) => {
    setResponses({
      ...responses,
      [id]: value
    });
    
    // Clear error when user types
    if (errors[id]) {
      const newErrors = { ...errors };
      delete newErrors[id];
      setErrors(newErrors);
    }
  };

  // Render the current section's questions
  const renderQuestions = () => {
    const currentSection = surveyQuestions[activeStep];
    
    return (
      <Box sx={{ mt: 2 }}>
        {currentSection.questions.map((question) => (
          <Box key={question.id} sx={{ mb: 4 }}>
            {renderQuestion(question)}
          </Box>
        ))}
      </Box>
    );
  };

  // Render a specific question based on its type
  const renderQuestion = (question) => {
    switch (question.type) {
      case 'text':
      case 'email':
        return (
          <TextField
            id={question.id}
            label={question.label}
            type={question.type}
            value={responses[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            fullWidth
            required={question.required}
            multiline={question.multiline}
            rows={question.multiline ? 4 : 1}
            error={!!errors[question.id]}
            helperText={errors[question.id]}
          />
        );
        
      case 'radio':
        return (
          <FormControl component="fieldset" error={!!errors[question.id]}>
            <FormLabel component="legend">{question.label}</FormLabel>
            <RadioGroup
              value={responses[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
            >
              {question.options.map((option) => (
                <FormControlLabel
                  key={option}
                  value={option}
                  control={<Radio />}
                  label={option}
                />
              ))}
            </RadioGroup>
            {errors[question.id] && (
              <Typography color="error" variant="caption">
                {errors[question.id]}
              </Typography>
            )}
          </FormControl>
        );
        
      case 'rating':
        return (
          <Box>
            <FormLabel component="legend">{question.label}</FormLabel>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
              <Rating
                name={question.id}
                value={Number(responses[question.id] || 0)}
                onChange={(_, newValue) => handleInputChange(question.id, newValue)}
                size="large"
                precision={1}
              />
              <Box sx={{ ml: 2 }}>
                {responses[question.id] ? 
                  `${responses[question.id]} stars` : 'No rating selected'}
              </Box>
            </Box>
            {errors[question.id] && (
              <Typography color="error" variant="caption">
                {errors[question.id]}
              </Typography>
            )}
          </Box>
        );
        
      case 'select':
        return (
          <TextField
            id={question.id}
            select
            label={question.label}
            value={responses[question.id] || ''}
            onChange={(e) => handleInputChange(question.id, e.target.value)}
            fullWidth
            required={question.required}
            error={!!errors[question.id]}
            helperText={errors[question.id]}
          >
            {question.options.map((option) => (
              <MenuItem key={option} value={option}>
                {option}
              </MenuItem>
            ))}
          </TextField>
        );
        
      default:
        return null;
    }
  };

  return (
    <Paper 
        elevation={3} 
        sx={{ 
        p: { xs: 2, sm: 3 }, // Responsive padding
        width: '100%',       // Use full width
        overflowX: 'hidden'  // Prevent horizontal scroll
        }}
    >
        <Stepper 
        activeStep={activeStep} 
        sx={{ 
            mb: 4,
            display: { xs: 'none', md: 'flex' } // Hide on small screens
        }}
        >
        {surveyQuestions.map((section) => (
            <Step key={section.section}>
            <StepLabel>{section.section}</StepLabel>
            </Step>
        ))}
        </Stepper>
      
      <Box>
        <Typography variant="h6" gutterBottom>
          {surveyQuestions[activeStep].section}
        </Typography>
        
        <Divider sx={{ mb: 3 }} />
        
        {renderQuestions()}
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            startIcon={<NavigateBeforeIcon />}
          >
            Back
          </Button>
          
          <Button
            variant="contained"
            onClick={handleNext}
            endIcon={activeStep === surveyQuestions.length - 1 ? null : <NavigateNextIcon />}
            color="primary"
          >
            {activeStep === surveyQuestions.length - 1 ? 'Submit' : 'Next'}
          </Button>
        </Box>
      </Box>
    </Paper>
  );
}

export default SurveyForm;
