// const API_BASE_URL = 'https://happy-sky-0d83f1a10.6.azurestaticapps.net/api';
const API_BASE_URL = '/api';

class ApiService {
  static async getAllSurveys() {
    try {
      console.log('Fetching all surveys from:', `${API_BASE_URL}/surveys`);
      const response = await fetch(`${API_BASE_URL}/surveys`);
      // const response = await fetch(`${API_BASE_URL}/surveys`, {
      //   headers: {
      //     'Accept': 'application/json'
      //   }
      // });
      console.log('Response:', response);
      if (!response.ok) {
        // Better error handling for non-JSON responses
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const errorData = await response.json();
          throw new Error(`API error: ${JSON.stringify(errorData)}`);
        } else {
          try {
            const errorData = await response.json();
            throw new Error(`API error: ${JSON.stringify(errorData)}`);
          } catch (e) {
            const text = await response.text();
            throw new Error(`Non-JSON response (${response.status}): ${text.substring(0, 100)}...`);
          }
        }
      }
      
      const data = await response.json();
      console.log('Received survey data:', JSON.stringify(data));
      return data.surveyNames || [];
    } catch (error) {
      console.error('Error fetching surveys:', error);
      throw error;
    }
  }

  static async getSurveyByName(surveyName) {
    if (!surveyName) {
      throw new Error('Survey name is required');
    }
  
    try {
      console.log(`Fetching survey with name: ${surveyName}`);
      const url = `${API_BASE_URL}/survey?surveyName=${encodeURIComponent(surveyName)}`;
      
      const response = await fetch(url);
      
      if (response.status === 404) {
        console.log(`Survey "${surveyName}" not found`);
        return null; // Survey not found
      }
      
      if (!response.ok) {
        // Try to get more information about the error
        let errorDetails = '';
        try {
          const errorResponse = await response.text();
          errorDetails = errorResponse;
        } catch (e) {
          errorDetails = 'Unable to get error details';
        }
        
        throw new Error(`HTTP error ${response.status}: ${errorDetails}`);
      }
      
      const data = await response.json();
      console.log(`Successfully retrieved survey data for "${surveyName}"`);
      return data;
    } catch (error) {
      console.error(`Error fetching survey "${surveyName}":`, error);
      throw error;
    }
  }
  
  // Save or update a survey
  static async saveSurvey(surveyName, surveyData) {
    if (!surveyName) {
      throw new Error('Survey name is required');
    }

    try {
      console.log(`Saving survey: ${surveyName}`);
      const response = await fetch(`${API_BASE_URL}/survey?surveyName=${encodeURIComponent(surveyName)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(surveyData),
      });

      if (!response.ok) {
        let errorDetails = '';
        try {
          const errorResponse = await response.text();
          errorDetails = errorResponse;
        } catch (e) {
          errorDetails = 'Unable to get error details';
        }
        
        throw new Error(`HTTP error ${response.status}: ${errorDetails}`);
      }
      
      console.log(`Successfully saved survey "${surveyName}"`);
      return true;
    } catch (error) {
      console.error(`Error saving survey "${surveyName}":`, error);
      throw error;
    }
  }
  
  // Delete a survey
  static async deleteSurvey(surveyName) {
    if (!surveyName) {
      throw new Error('Survey name is required');
    }

    try {
      console.log(`Deleting survey: ${surveyName}`);
      const response = await fetch(`${API_BASE_URL}/survey?surveyName=${encodeURIComponent(surveyName)}`, {
        method: 'DELETE'
      });

      if (response.status === 404) {
        console.log(`Survey "${surveyName}" not found for deletion`);
        return false; // Survey not found
      }
      
      if (!response.ok) {
        let errorDetails = '';
        try {
          const errorResponse = await response.text();
          errorDetails = errorResponse;
        } catch (e) {
          errorDetails = 'Unable to get error details';
        }
        
        throw new Error(`HTTP error ${response.status}: ${errorDetails}`);
      }
      
      console.log(`Successfully deleted survey "${surveyName}"`);
      return true;
    } catch (error) {
      console.error(`Error deleting survey "${surveyName}":`, error);
      throw error;
    }
  }
  
  // Get analysis for a survey
  static async fetchSurveyAnalysis(surveyName, responses) {
    if (!surveyName) {
      throw new Error('Survey name is required');
    }  
    if (!responses) {
      throw new Error('Survey responses are required');
    }

    try {
      const url = `${API_BASE_URL}/survey/analysis?surveyName=${encodeURIComponent(surveyName)}`;
      
      // For a GET request with a body, we need to use the fetch API with specific settings
      if (responses) {
        const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        // The body that matches the expected format
        body: JSON.stringify(responses)

      });
      
      if (response.status === 404) {
        console.log(`Survey "${surveyName}" not found for analysis`);
        return null; // Survey not found
      }
      
      if (!response.ok) {
        let errorDetails = '';
        try {
          const errorResponse = await response.text();
          errorDetails = errorResponse;
        } catch (e) {
          errorDetails = 'Unable to get error details';
        }
        
        throw new Error(`HTTP error ${response.status}: ${errorDetails}`);
      }
      
        // Parse the response body ONCE
        const responseData = await response.json();
        
        // Fetch the summary text file
        const summaryResponse = await fetch(responseData.summary);
        const summaryData = await summaryResponse.text();
        
        // Fetch the analysis JSON file
        const analysisResponse = await fetch(responseData.analysis);
        const analysisData = await analysisResponse.json();
        
        console.log("summaryData:", summaryData);
        console.log("analysisData:", analysisData);
      
        // Return both pieces of data as an object
        return { 
          analysisData, 
          summaryData,
          analysisLink: responseData.analysis,
        };
      }
    } catch (error) {
      console.error(`Error fetching analysis for survey "${surveyName}":`, error);
      throw error;
    }
  }
  static async listReportVersions(surveyName) {
    if (!surveyName) {
      throw new Error('Survey name is required');
    }
  
    try {
      console.log(`Fetching report versions for survey: ${surveyName}`);
      const response = await fetch(`${API_BASE_URL}/report/versions?surveyName=${encodeURIComponent(surveyName)}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (!response.ok) {
        let errorDetails = '';
        try {
          const errorResponse = await response.text();
          errorDetails = errorResponse;
        } catch (e) {
          errorDetails = 'Unable to get error details';
        }
        
        throw new Error(`HTTP error ${response.status}: ${errorDetails}`);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched report versions for survey "${surveyName}"`);
      return data;
    } catch (error) {
      console.error(`Error fetching report versions for survey "${surveyName}":`, error);
      throw error;
    }
  }
  
  static async getReportVersion(surveyName, reportVersion) {
    if (!surveyName) {
      throw new Error('Survey name is required');
    }
    
    if (!reportVersion) {
      throw new Error('Report version is required');
    }
  
    try {
      console.log(`Fetching report version ${reportVersion} for survey: ${surveyName}`);
      const response = await fetch(
        `${API_BASE_URL}/report/version?surveyName=${encodeURIComponent(surveyName)}&reportVersion=${encodeURIComponent(reportVersion)}`, 
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
  
      if (response.status === 404) {
        console.log(`Report version ${reportVersion} not found for survey "${surveyName}"`);
        return null;
      }
  
      if (!response.ok) {
        let errorDetails = '';
        try {
          const errorResponse = await response.text();
          errorDetails = errorResponse;
        } catch (e) {
          errorDetails = 'Unable to get error details';
        }
        
        throw new Error(`HTTP error ${response.status}: ${errorDetails}`);
      }
      
      const data = await response.json();
      console.log(`Successfully fetched report version ${reportVersion} for survey "${surveyName}"`);
      return data;
    } catch (error) {
      console.error(`Error fetching report version ${reportVersion} for survey "${surveyName}":`, error);
      throw error;
    }
  }
}





export default ApiService;
