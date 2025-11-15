using WorkflowBuilder.Domain.ValueObjects;

namespace WorkflowBuilder.Domain.Services;

public interface IBedrockChatService
{
    Task<BedrockChatResult> ProcessChatMessageAsync(
        string message,
        string? workflowId,
        CancellationToken cancellationToken = default);
}

