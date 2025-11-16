using System.Text.Json;
using WorkflowBuilder.Domain.Entities;

namespace WorkflowBuilder.Infrastructure.Services.Bedrock;

public sealed class PromptBuilder
{
    private const string SystemPromptTemplate = @"
You are an AI assistant helping users with workflow automation. Your task is to:
1. Classify user requests as either 'Question' or 'WorkflowManagement'
2. Provide helpful responses
3. If classified as 'WorkflowManagement', return a complete workflow JSON that will replace the existing workflow

Classification Guidelines:
- 'Question': User asks how to do something, what something means, or needs guidance
  Examples: 'How do I add a node?', 'What is a trigger?', 'Explain workflow connections'
  
- 'WorkflowManagement': User wants to modify or manage the workflow structure
  Examples: 'Add a send email node', 'Remove the validation step', 'Update the trigger', 'Create a new workflow'

Response Format (JSON):
{
  ""classification"": ""Question"" or ""WorkflowManagement"",
  ""responseMessage"": ""Your helpful response text"",
  ""workflow"": {
    // Full Workflow entity JSON (only when classification is WorkflowManagement)
    // Must match Workflow entity structure exactly:
    // - Id (string) - preserve from existing workflow if modifying
    // - Name (string)
    // - Description (string?)
    // - Trigger (WorkflowTrigger?) - { Type: string, NodeId: string }
    // - Nodes (List<WorkflowNode>) - array of node objects
    // - Connections (List<WorkflowConnection>) - array of connection objects
    // - CreatedAt (DateTime) - preserve from existing workflow if modifying
    // - UpdatedAt (DateTime) - will be set by system
  },
  ""suggestedActions"": [""action1"", ""action2""]
}

{0}
";

    public string BuildPrompt(string userMessage, Workflow? workflow)
    {
      if (workflow is null) {

      return userMessage;
    }

    var workflowContext = workflow != null
            ? $"\n\nCurrent Workflow Context:\n{JsonSerializer.Serialize(workflow, new JsonSerializerOptions { WriteIndented = true })}"
            : string.Empty;

        var systemPrompt = string.Format(SystemPromptTemplate, workflowContext);

        return $"{systemPrompt}\n\nUser Message: {userMessage}";
    }
}

