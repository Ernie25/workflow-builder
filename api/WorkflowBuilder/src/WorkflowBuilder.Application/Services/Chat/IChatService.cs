using WorkflowBuilder.Application.Models.Dtos;

namespace WorkflowBuilder.Application.Services.Chat;

public interface IChatService
{
    Task<ChatResponse> ProcessChatAsync(
        ChatRequest request,
        CancellationToken cancellationToken = default);
}

