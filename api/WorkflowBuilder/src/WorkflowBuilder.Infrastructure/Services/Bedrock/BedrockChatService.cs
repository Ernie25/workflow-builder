using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WorkflowBuilder.Domain.Entities;
using WorkflowBuilder.Domain.Enums;
using WorkflowBuilder.Domain.Exceptions;
using WorkflowBuilder.Domain.Repositories;
using WorkflowBuilder.Domain.Services;
using WorkflowBuilder.Domain.ValueObjects;

namespace WorkflowBuilder.Infrastructure.Services.Bedrock;

public sealed class BedrockChatService : IBedrockChatService
{
    private readonly BedrockOptions _options;
    private readonly PromptBuilder _promptBuilder;
    private readonly IWorkflowRepository _workflowRepository;
    private readonly ILogger<BedrockChatService> _logger;

    public BedrockChatService(
        IOptions<BedrockOptions> options,
        PromptBuilder promptBuilder,
        IWorkflowRepository workflowRepository,
        ILogger<BedrockChatService> logger)
    {
        _options = options.Value;
        _promptBuilder = promptBuilder;
        _workflowRepository = workflowRepository;
        _logger = logger;
    }

    public async Task<BedrockChatResult> ProcessChatMessageAsync(
        string message,
        string? workflowId,
        CancellationToken cancellationToken = default)
    {
        try
        {
            Workflow? workflow = null;
            if (!string.IsNullOrWhiteSpace(workflowId))
            {
                workflow = await _workflowRepository.GetByIdAsync(workflowId, cancellationToken);
            }
            
            var prompt = _promptBuilder.BuildPrompt(message, workflow);

            _logger.LogInformation(
                "Processing chat message. WorkflowId: {WorkflowId}, MessageLength: {MessageLength}",
                workflowId ?? "none",
                message.Length);

            // TODO: Replace this section with actual AWS Bedrock API call
            // 1. Create InvokeModelRequest with Claude message format:
            //    - ModelId: _options.ModelId
            //    - ContentType: "application/json"
            //    - Accept: "application/json"
            //    - Body: JSON with structure:
            //      {
            //        "anthropic_version": "bedrock-2023-05-31",
            //        "max_tokens": _options.MaxTokens,
            //        "temperature": _options.Temperature,
            //        "messages": [
            //          {
            //            "role": "user",
            //            "content": prompt
            //          }
            //        ]
            //      }
            //
            // 2. Call AmazonBedrockRuntimeClient.InvokeModelAsync(request, cancellationToken)
            //
            // 3. Parse response:
            //    - Read response.Body stream
            //    - Parse JSON to extract content[0].text
            //    - Deserialize the text content (which should be JSON) to BedrockResponseDto

            // PLACEHOLDER: Simulated response for development
            // Remove this when implementing actual Bedrock call
            var simulatedResponse = new BedrockResponseDto
            {
                Classification = "Question",
                ResponseMessage = "This is a placeholder response. Implement AWS Bedrock API call above.",
                Workflow = null,
                SuggestedActions = new List<string> { "Implement Bedrock integration" }
            };
            
            var result = MapToBedrockChatResult(simulatedResponse, workflowId, workflow);

            _logger.LogInformation(
                "Chat processed successfully. Classification: {Classification}",
                result.Classification);

            return result;
        }
        catch (Exception ex) when (ex is not BedrockServiceException)
        {
            _logger.LogError(ex, "Error calling AWS Bedrock service.");
            throw new BedrockServiceException(
                "An error occurred while processing the chat message.",
                ex);
        }
    }

    private static BedrockChatResult MapToBedrockChatResult(
        BedrockResponseDto response,
        string? workflowId,
        Workflow? existingWorkflow)
    {
        Workflow? workflow = null;
        if (response.Workflow != null)
        {
            try
            {
                var workflowJson = JsonSerializer.Serialize(response.Workflow);
                workflow = JsonSerializer.Deserialize<Workflow>(workflowJson);

                if (workflow != null && existingWorkflow != null)
                {
                    workflow.Id = existingWorkflow.Id;
                    workflow.CreatedAt = existingWorkflow.CreatedAt;
                }
            }
            catch (JsonException ex)
            {
                throw new BedrockServiceException(
                    "Failed to deserialize workflow JSON from Bedrock response.",
                    ex);
            }
        }

        return new BedrockChatResult
        {
            Classification = Enum.Parse<ChatClassification>(response.Classification),
            ResponseMessage = response.ResponseMessage,
            Workflow = workflow,
            SuggestedActions = response.SuggestedActions ?? new List<string>()
        };
    }
    
    private sealed class BedrockResponseDto
    {
        public required string Classification { get; init; }
        public required string ResponseMessage { get; init; }
        public Dictionary<string, object>? Workflow { get; init; }
        public List<string>? SuggestedActions { get; init; }
    }
}
