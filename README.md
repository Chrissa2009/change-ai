# Change AI
![Change AI Banner](assets/banner.png)
**Change AI** is an AI-powered Return on Investment (ROI) calculator that helps users assess readiness, model risk, and measure the impact of change initiatives. By processing responses from a customized Change Assessment Survey, the app instantly evaluates readiness, models risk, and calculates the projected Return on Investment (ROI). Powered by Azure OpenAI, it turns survey inputs into real-time insights, replacing guesswork and slow feedback loops with data-driven decisions.
## Live Demo 🔗 
[https://happy-sky-0d83f1a10.6.azurestaticapps.net/](https://happy-sky-0d83f1a10.6.azurestaticapps.net/)

## 1. Core Functionalities ⚙️
- **AI-Powered Predictive ROI Insights** quantifies cost and benefits, calculates predictive ROI values
- **ROI Dashboard** with insights on key drivers of ROI and recommendations to implement change initiative
- **ROI Report Downloads** ability to download PDF reports with ROI summary, key insights, implementation steps, and a waterfall chart
- **Decision Log** tracks decisions changes available for download in JSON format, ensuring accountability and transparency
- **Structured Output** ensured stable API consumption and tailored recommendations
- **Prompt Engineering and Customization** allows users to get customized insights and recommendations based on project context
- **Integration** easy integration within the Azure ecosystem
- **Accessibility & Inclusion** uses clear, jargon-free language accessible to all stakeholders, regardless of technical background.

## 2. Tech Stack 🥪
- **Frontend**: Azure Static Web App
- **Storage**: Azure Cosmos DB, Azure Blob
- **Compute**: Azure Functions
- **Security**: Azure Managed Identity, Azure KeyVault
- **Monitoring**: Azure Application Insights
- **AI Insights**: Azure OpenAI GPT-4o

## 3. To Run Locally 🚀
### 3.1. Prerequisites
To run this project locally, you'll need:
- An **Azure account**
- Azure resources set up for:
  - **Cosmos DB**
  - **Azure Blob Storage**
  - **Azure Functions**
  - **Azure OpenAI**
  - (Optional) **Azure Key Vault** and **Application Insights**

Make sure you have **Node.js**, **Python**, and the **Azure CLI** installed.

### 3.2. Environment Setup
Add the following environment variables in a `.env` file or use Azure Key Vault:

```sh
# Cosmos DB
COSMOS_DB_CONNECTION_STRING="your_cosmos_db_connection_string"

# Blob Storage
AZURE_STORAGE_ACCOUNT_NAME="your_storage_account"
AZURE_STORAGE_ACCOUNT_KEY="your_storage_key"  # If not using Managed Identity
AZURE_STORAGE_CONTAINER_NAME="your_container_name"
# Azure Function App
FUNCTION_APP_URL="https://your-function-url.azurewebsites.net"

# Azure OpenAI
AZURE_OPENAI_ENDPOINT="https://your-openai-resource.openai.azure.com/"
AZURE_OPENAI_API_KEY="your_openai_api_key"
AZURE_OPENAI_DEPLOYMENT_NAME="gpt-4o"

# Application Insights (optional for local logging)
APPINSIGHTS_INSTRUMENTATIONKEY="your_app_insights_key"

# Key Vault (if accessed directly from code)
KEY_VAULT_NAME="your-keyvault-name"
```
If you're using Azure Managed Identity, you can skip direct API keys for storage and Key Vault—but you’ll still need to configure that identity locally via Azure CLI login.

### 3.3. Run the Project
1. Clone the project
   ```sh
   git clone https://github.com/Chrissa2009/change-ai.git
   cd change-ai
   ```
2. Install dependencies
   ```sh
   pip install -r requirements.txt
   npm install
   ```
3. Build and run the frontend server
   ```sh
   npm run build
   npm run start
   ```
## 🐛 Found a Bug?  

Spotted something off? Let us know!  
1. **Check** the [Issues tab](https://github.com/chrissa2009/change-ai/issues) to see if it’s already reported.  
2. **Report it** [here](https://github.com/chrissa2009/change-ai/issues/new) with:  
   - What happened?  
   - Steps to reproduce  
   - Expected vs. actual results  
   - Any error messages or screenshots  

Thanks for helping us improve! 🚀
