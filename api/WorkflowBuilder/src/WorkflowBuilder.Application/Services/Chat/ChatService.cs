using WorkflowBuilder.Application.Mappings;
using WorkflowBuilder.Application.Models.Dtos;
using WorkflowBuilder.Domain.Entities;
using WorkflowBuilder.Domain.Enums;
using WorkflowBuilder.Domain.Repositories;
using WorkflowBuilder.Domain.Services;
using WorkflowBuilder.Domain.ValueObjects;

namespace WorkflowBuilder.Application.Services.Chat;

public sealed class ChatService : IChatService
{
    private readonly IBedrockChatService _bedrockChatService;
    private readonly IWorkflowRepository _workflowRepository;

    public ChatService(
        IBedrockChatService bedrockChatService,
        IWorkflowRepository workflowRepository)
    {
        _bedrockChatService = bedrockChatService;
        _workflowRepository = workflowRepository;
    }

    public async Task<ChatResponse> ProcessChatAsync(
        ChatRequest request,
        CancellationToken cancellationToken = default)
    {
        Workflow? existingWorkflow = null;
        if (!string.IsNullOrWhiteSpace(request.WorkflowId))
        {
            existingWorkflow = await _workflowRepository.GetByIdAsync(
                request.WorkflowId,
                cancellationToken);

            if (existingWorkflow == null)
            {
                throw new ArgumentException(
                    $"Workflow with id {request.WorkflowId} not found.",
                    nameof(request));
            }
        }
        
        var result = await _bedrockChatService.ProcessChatMessageAsync(
            request.Message,
            request.WorkflowId,
            cancellationToken);
        
        // If WorkflowManagement classification with workflow, update existing workflow
        if (result.Classification == ChatClassification.WorkflowManagement &&
            result.Workflow != null &&
            existingWorkflow != null)
        {
            // Preserve Id and CreatedAt, update UpdatedAt
            result.Workflow.Id = existingWorkflow.Id;
            result.Workflow.CreatedAt = existingWorkflow.CreatedAt;
            result.Workflow.UpdatedAt = DateTime.UtcNow;

            // Update workflow in repository
            var updatedWorkflow = await _workflowRepository.UpdateAsync(
                existingWorkflow.Id,
                result.Workflow,
                cancellationToken);

            if (updatedWorkflow != null)
            {
                // Update result with saved workflow
                result = new BedrockChatResult
                {
                    Classification = result.Classification,
                    ResponseMessage = result.ResponseMessage,
                    Workflow = updatedWorkflow,
                    SuggestedActions = result.SuggestedActions
                };
            }
        }
        
        return result.ToResponse();
    }
}

