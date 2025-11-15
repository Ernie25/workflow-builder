using WorkflowBuilder.Domain.Entities;
using WorkflowBuilder.Domain.Enums;

namespace WorkflowBuilder.Domain.ValueObjects;

public sealed class BedrockChatResult
{
    public required ChatClassification Classification { get; init; }
    
    public required string ResponseMessage { get; init; }
    
    public Workflow? Workflow { get; init; }
    
    public List<string> SuggestedActions { get; init; } = new();
}

