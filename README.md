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

## 3. Infrastructure Setup 🚀
### 3.1. Prerequisites
You'll need:
- An **Azure account**
- Azure resources set up for:
  - **Cosmos DB**
  - **Azure Blob Storage**
  - **Azure Functions**
  - **Azure OpenAI**
  - **Azure Key Vault**
  - **Azure Managed Identity**

Make sure you have **Node.js**, **Python**, and the **Azure CLI** installed.

Create a Managed Identity for your Azure Functions App in order to associate with permission roles. For CosmosDB
permissioning, leverage scripts/create_db_access_role since Cosmos DB storage account allowlisting is not exposed in the Azure portal.
See this [Azure Functions integration guide with Static Web Apps](https://learn.microsoft.com/en-us/azure/static-web-apps/functions-bring-your-own).
See [Azure Functions VSCode](https://learn.microsoft.com/en-us/azure/azure-functions/functions-develop-vs-code?tabs=node-v4%2Cpython-v2%2Cisolated-process%2Cquick-create&pivots=programming-language-csharp) for easy Azure Function bootstrapping as as well as setting up CI/CD. See [Static Web Apps Guide](https://learn.microsoft.com/en-us/azure/static-web-apps/get-started-portal?tabs=vanilla-javascript&pivots=github). Change .github/workflows yml files to reference your API tokens instead.

For Cosmos DB, setup database and containers defined in api/db_utils.py before running application.

For LLM, setup either OpenAI or Azure OpenAI. If you use OpenAI, store API key in Azure KeyVault, otherwise use role-based permissioning. Model can be changed in api/openai_utils.py.

### 3.2. Endpoint Setup
Change all endpoints defined as constants in all the files in api folder ending in utils.py, specific to your infrastucture.

### 3.3. Run the Project
1. Install dependencies
   ```sh
   cd api
   pip install -r requirements.txt\
   cd ../frontend-changeiq
   npm install
   ```
2. Build and run the frontend server
   ```sh
   npm run build
   npm run start
   ```
3. Open http://localhost:3000/ for local frontend testing.
## 🐛 Found a Bug?  

Spotted something off? Let us know!  
1. **Check** the [Issues tab](https://github.com/chrissa2009/change-ai/issues) to see if it’s already reported.  
2. **Report it** [here](https://github.com/chrissa2009/change-ai/issues/new) with:  
   - What happened?  
   - Steps to reproduce  
   - Expected vs. actual results  
   - Any error messages or screenshots  

Thanks for helping us improve! 🚀
