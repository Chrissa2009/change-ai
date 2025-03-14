// surveyQuestions.js
export const surveyQuestions = [
    {
      section: 'Initial Investment Assessment',
      questions: [
        {
          id: 'total_budget',
          type: 'text',
          label: 'What is your total budget for this technology implementation?',
          required: false,
        },
        {
          id: 'upfront_cost',
          type: 'text',
          label: 'What is the expected upfront cost of purchasing/licensing the technology?',
          required: false,
        },
        {
          id: 'setup_cost',
          type: 'text',
          label: 'How much do you expect to spend on initial setup and configuration?',
          required: false,
        },
        {
          id: 'training_cost',
          type: 'text',
          label: 'What are the estimated costs for staff training on the new technology?',
          required: false,
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
          required: false,
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
          required: false,
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
          required: false,
        },
        {
          id: 'staff_hours',
          type: 'text',
          label: 'How many staff hours will be dedicated to implementation?',
          required: false,
        },
        {
          id: 'hourly_cost',
          type: 'text',
          label: 'What is the average hourly cost of the staff involved in implementation?',
          required: false,
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
          required: false,
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
          required: false,
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
          required: false,
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
          required: false,
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
          required: false,
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
          required: false,
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
          required: false,
        },
        {
          id: 'business_processes',
          type: 'text',
          label: 'What specific business processes will this technology improve?',
          multiline: true,
          required: false,
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
          required: false,
        },
        {
          id: 'labor_hours_saved',
          type: 'text',
          label: 'How many labor hours do you expect to save weekly/monthly/annually?',
          required: false,
        },
        {
          id: 'saved_hours_value',
          type: 'text',
          label: 'What is the monetary value of these saved hours?',
          required: false,
        },
        {
          id: 'scaling_operations',
          type: 'text',
          label: 'How will this technology affect your ability to scale operations?',
          multiline: true,
          required: false,
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
          required: false,
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
          required: false,
        },
        {
          id: 'delay_cost_impact',
          type: 'text',
          label: 'What would be the cost impact of implementation delays?',
          required: false,
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
          required: false,
        },
        {
          id: 'contingency_budget',
          type: 'text',
          label: 'What contingency budget have you set aside for unexpected issues?',
          required: false,
        },
        {
          id: 'integration_challenges',
          type: 'text',
          label: 'Have you identified potential integration challenges with existing systems?',
          multiline: true,
          required: false,
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
          required: false,
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
          required: false,
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
          required: false,
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
          required: false,
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
          required: false,
        },
        {
          id: 'current_process_time',
          type: 'text',
          label: 'What is the current time spent on these processes?',
          required: false,
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
          required: false,
        },
        {
          id: 'error_reduction',
          type: 'text',
          label: 'How many fewer errors do you expect with the new technology?',
          required: false,
        },
        {
          id: 'error_cost',
          type: 'text',
          label: 'What is the current cost of errors that might be reduced?',
          required: false,
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
          required: false,
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
          required: false,
        },
        {
          id: 'time_to_market',
          type: 'text',
          label: 'How will this technology affect your time-to-market for new products/services?',
          multiline: true,
          required: false,
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
          required: false,
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
          required: false,
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
          required: false,
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
          required: false,
        },
        {
          id: 'employee_satisfaction',
          type: 'text',
          label: 'How do you expect this technology to impact employee satisfaction?',
          multiline: true,
          required: false,
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
          required: false,
        },
        {
          id: 'adoption_metrics',
          type: 'text',
          label: 'What metrics will you use to measure successful adoption?',
          multiline: true,
          required: false,
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
          required: false,
        },
        {
          id: 'competitive_advantages',
          type: 'text',
          label: 'What long-term competitive advantages do you expect from this investment?',
          multiline: true,
          required: false,
        },
        {
          id: 'growth_contribution',
          type: 'text',
          label: 'How will you measure the technology\'s contribution to business growth?',
          multiline: true,
          required: false,
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
          required: false,
        },
        {
          id: 'roi_kpis',
          type: 'text',
          label: 'What specific KPIs will you use to measure ROI on this technology?',
          multiline: true,
          required: false,
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
          required: false,
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
          required: false,
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
          required: false,
        },
        {
          id: 'reassessment_criteria',
          type: 'text',
          label: 'What criteria would trigger a reassessment of the technology investment?',
          multiline: true,
          required: false,
        },
        {
          id: 'exit_strategy',
          type: 'text',
          label: 'What is your exit strategy if the technology fails to deliver expected ROI?',
          multiline: true,
          required: false,
        }
      ]
    }
  ];

// Helper function to find a question by ID across all sections
export function findQuestionById(id) {
  for (const section of surveyQuestions) {
    for (const question of section.questions) {
      if (question.id === id) {
        return question;
      }
    }
  }
  return null;
}
