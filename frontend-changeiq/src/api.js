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
  static async getSurveyAnalysis(surveyName) {
    if (!surveyName) {
      throw new Error('Survey name is required');
    }

    try {
      console.log(`Fetching analysis for survey: ${surveyName}`);
      const url = `${API_BASE_URL}/survey/analysis?surveyName=${encodeURIComponent(surveyName)}`;
      
      const response = await fetch(url);
      
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
      
      const data = await response.json();
      console.log(`Successfully retrieved analysis for "${surveyName}"`);
      return data;
    } catch (error) {
      console.error(`Error fetching analysis for survey "${surveyName}":`, error);
      throw error;
    }
  }
}

export default ApiService;
