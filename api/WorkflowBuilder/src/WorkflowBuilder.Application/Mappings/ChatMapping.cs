using WorkflowBuilder.Application.Models.Dtos;
using WorkflowBuilder.Domain.ValueObjects;

namespace WorkflowBuilder.Application.Mappings;

public static class ChatMapping
{
    public static ChatResponse ToResponse(this BedrockChatResult result)
    {
        return new ChatResponse
        {
            Classification = result.Classification,
            ResponseMessage = result.ResponseMessage,
            Workflow = result.Workflow?.ToResponse(),
            SuggestedActions = result.SuggestedActions.Any()
                ? result.SuggestedActions.ToList()
                : null
        };
    }
}

