using System.Reflection.Metadata;
using Amazon.BedrockRuntime;
using Amazon.BedrockRuntime.Model;
using System.Text;
using System.Text.Json;
using Amazon;
using Amazon.BedrockAgentRuntime;
using Amazon.BedrockAgentRuntime.Model;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using WorkflowBuilder.Domain.Entities;
using WorkflowBuilder.Domain.Enums;
using WorkflowBuilder.Domain.Exceptions;
using WorkflowBuilder.Domain.Repositories;
using WorkflowBuilder.Domain.Services;
using WorkflowBuilder.Domain.ValueObjects;
using Document = Amazon.Runtime.Documents.Document;

namespace WorkflowBuilder.Infrastructure.Services.Bedrock;

public sealed class BedrockChatService : IBedrockChatService
{
    private readonly AmazonBedrockRuntimeClient _bedrockClient;
    private readonly BedrockOptions _options;
    private readonly PromptBuilder _promptBuilder;
    private readonly IWorkflowRepository _workflowRepository;
    private readonly ILogger<BedrockChatService> _logger;

    public BedrockChatService(
        AmazonBedrockRuntimeClient bedrockClient,
        IOptions<BedrockOptions> options,
        PromptBuilder promptBuilder,
        IWorkflowRepository workflowRepository,
        ILogger<BedrockChatService> logger)
    {
        _bedrockClient = bedrockClient;
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
          var client = new AmazonBedrockAgentRuntimeClient(RegionEndpoint.EUNorth1);
          
          var region = "eu-north-1";
          var flowId = "";
          var flowAlias = "";

          object question = new
          {
            question = "Test",
          };
          var document = new Document("Test");
          
          var flowInput = new FlowInput
          {
            Content = new FlowInputContent { Document = document },
            NodeName = "FlowInputNode",
            NodeOutputName = "document"
          };
          
          var request = new InvokeFlowRequest
          {
            FlowIdentifier = flowId,
            FlowAliasIdentifier = flowAlias,
            Inputs = new List<FlowInput> { flowInput }
          };
          
          var response = await client.InvokeFlowAsync(request);
          
          FlowOutputEvent? flowOutputEvent = null;
          FlowCompletionEvent? flowCompletionEvent = null;

          // Process the response stream from the flow invocation
          foreach (var eventItem in response.ResponseStream)
          {
            if (eventItem is FlowOutputEvent outputEvent)
              flowOutputEvent = outputEvent;

            if (eventItem is FlowCompletionEvent completionEvent)
              flowCompletionEvent = completionEvent;
          }

          // Check if the flow has completed successfully and output the results
          if (flowCompletionEvent?.CompletionReason == "SUCCESS" && flowOutputEvent?.Content?.Document != null)
          {
            Console.WriteLine("Flow invocation was successful! The output of the flow is as follows:");
            Console.WriteLine($"Document Content: {flowOutputEvent.Content.Document}");
          }
          else
          {
            Console.WriteLine($"Flow invocation completed with reason: {flowCompletionEvent?.CompletionReason ?? "Unknown"}");
          }
            // Workflow? workflow = null;
            // if (!string.IsNullOrWhiteSpace(workflowId))
            // {
            //     workflow = await _workflowRepository.GetByIdAsync(workflowId, cancellationToken);
            // }
            //
            // var prompt = _promptBuilder.BuildPrompt(message, workflow);
            //
            // _logger.LogInformation(
            //     "Processing chat message. WorkflowId: {WorkflowId}, MessageLength: {MessageLength}",
            //     workflowId ?? "none",
            //     message.Length);
            //
            // // Create request body for Claude model
            // var requestBody = new
            // {
            //     anthropic_version = "bedrock-2023-05-31",
            //     max_tokens = _options.MaxTokens,
            //     temperature = _options.Temperature,
            //     messages = new[]
            //     {
            //         new
            //         {
            //             role = "user",
            //             content = prompt
            //         }
            //     }
            // };
            //
            // var requestBodyJson = JsonSerializer.Serialize(requestBody);
            // var requestBodyBytes = Encoding.UTF8.GetBytes(requestBodyJson);
            //
            // // Create InvokeModelRequest
            // var request = new InvokeModelRequest
            // {
            //     ModelId = _options.ModelId,
            //     ContentType = "application/json",
            //     Accept = "application/json",
            //     Body = new MemoryStream(requestBodyBytes)
            // };
            //
            // // Call AWS Bedrock
            // _logger.LogDebug("Invoking Bedrock model: {ModelId}", _options.ModelId);
            // var response = await _bedrockClient.InvokeModelAsync(request, cancellationToken);
            //
            // // Parse response
            // using var reader = new StreamReader(response.Body);
            // var responseBody = await reader.ReadToEndAsync();
            //
            // _logger.LogDebug("Bedrock response received. Length: {Length}", responseBody.Length);
            //
            // // Parse Claude response format
            // var jsonDoc = JsonDocument.Parse(responseBody);
            // var contentText = jsonDoc.RootElement
            //     .GetProperty("content")[0]
            //     .GetProperty("text")
            //     .GetString();
            //
            // if (string.IsNullOrWhiteSpace(contentText))
            // {
            //     throw new BedrockServiceException("Bedrock response does not contain text content.");
            // }
            //
            // // Deserialize the JSON response from Claude
            // var bedrockResponse = JsonSerializer.Deserialize<BedrockResponseDto>(contentText);
            //
            // if (bedrockResponse == null)
            // {
            //     throw new BedrockServiceException("Failed to deserialize Bedrock response.");
            // }
            //
            // var result = MapToBedrockChatResult(bedrockResponse, workflowId, workflow);
            //
            // _logger.LogInformation(
            //     "Chat processed successfully. Classification: {Classification}",
            //     result.Classification);

            var result = new BedrockChatResult
            {
              Classification = ChatClassification.Question,
              ResponseMessage = response.ExecutionId,
              Workflow = null,
              SuggestedActions = new(),
            };

            return result;
        }
        catch (BedrockServiceException)
        {
            throw;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "Failed to parse Bedrock response JSON.");
            throw new BedrockServiceException(
                "Failed to parse response from AWS Bedrock.",
                ex);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error calling AWS Bedrock service. Exception type: {ExceptionType}", ex.GetType().Name);
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
