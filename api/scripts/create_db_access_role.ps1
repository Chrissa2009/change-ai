param (
    [Parameter(Mandatory=$true)]
    [string]$resourceGroup,

    [Parameter(Mandatory=$true)]
    [string]$accountName,

    [Parameter(Mandatory=$true)]
    [string]$scope
)

$ErrorActionPreference = "Stop"

try {
    $azVersion = az version
    if ($azVersion) {
        Write-Host "Azure CLI is installed. Version details: $azVersion"
    }
} catch {
    Write-Host "Azure CLI is not installed."
    exit
}

try {
    az account show > $null 2>&1
    Write-Host "Already logged into Azure, proceeding..."
} catch {
    Write-Host "Need to login Azure..."
    az login --use-device-code
}

$filePath = "temp_db_role.json"

$roleAssignmentGuid = [guid]::NewGuid().ToString()

$currentUserId = az ad signed-in-user show --query id -o tsv

$existingRole = az cosmosdb sql role definition list --account-name $accountName --resource-group $resourceGroup --query "[?roleName=='Custom Cosmos DB Role'].id" -o tsv

if ($existingRole) {
    Write-Host "Role 'Custom Cosmos DB Role' already exists, skippping role creation and principal association."
    exit
}

$roleDefinition = @{
    Id = $roleAssignmentGuid
    RoleName = "Custom Cosmos DB Role"
    Type = "CustomRole"
    AssignableScopes = @($scope)
    Permissions = @(
        @{
            DataActions = @(
                "Microsoft.DocumentDB/databaseAccounts/readMetadata",
                "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/*",
                "Microsoft.DocumentDB/databaseAccounts/sqlDatabases/containers/items/*"
            )
        }
    )
}

$roleDefinition | ConvertTo-Json -Depth 10 | Out-File -FilePath $filePath -Force

try {
    az cosmosdb sql role definition create --account-name $accountName --resource-group $resourceGroup --body @$filePath
    az cosmosdb sql role assignment create --account-name $accountName --principal-id $currentUserId --resource-group $resourceGroup --scope $scope --role-definition-id $roleAssignmentGuid
} finally {
    Remove-Item $filePath -Force
}
