# Change AI
#### AI calculations. Human Decisions.
Change AI is an AI-powered Return on Investment (ROI) calculator that helps users assess readiness, model risk, and measure the impact of change initiatives. By processing responses from a customized Change Assessment Survey, the app instantly evaluates readiness, models risk, and calculates the projected Return on Investment (ROI). Powered by Azure OpenAI, it turns survey inputs into real-time insights, replacing guesswork and slow feedback loops with data-driven decisions.

## 1. Core Functionalities ⚙️
- **AI-Powered Predictive ROI Insights** with side-by-side change initiative comparison
- **ROI Dashboard and Reporting** to help stakeholders make data-backed decisions
- **Decision Log** tracks decisions changes, ensuring accountability and transparency
- **Prompt Engineering and Structured Output** ensured stable API consumption and tailored recommendations
- **Customization and Integration** allows users to customize parameters based on project context, essy integration within Azure ecosystem
- **Accessibility & Inclusion** uses clear, jargon-free language to make insights understandable to all stakeholders, from executives to non-technical users

## 2. Tech Stack 🥪
- **Frontend**: Azure Static Web App
- **Storage**: Azure Cosmos DB, Azure Blob
- **Compute**: Azure Functions
- **Security**: Azure Managed Identity, Azure KeyVault
- **Monitoring**: Azure Application Insights
- **AI Insights**: Azure OpenAI GPT-4o

## 3. Installation 🚀
### 3.1. Prerequisites
To run this project, you need an **Azure account** and the following services:
- **Azure Cosmos DB** (NoSQL database)
- **Azure Functions** (for serverless execution)

### 3.2. Environment Setup
Add the following environment variables in a `.env` file or use Azure Key Vault:

```sh
COSMOS_DB_CONNECTION_STRING="your_connection_string"
FUNCTION_APP_URL="your_function_url"
```
### 3.3. Run the project
1. Clone the project
   ```sh
   git clone https://github.com/tonidavisj/safedocsai.git
   ```
2. Install dependencies
   ```sh
   pip install -r requirements.txt
   npm install
   ```
3. Run the frontend server
   ```sh
   npm start
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
