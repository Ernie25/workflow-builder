using WorkflowBuilder.Domain.Enums;

namespace WorkflowBuilder.Application.Models.Dtos;

public sealed record ChatResponse
{
    public required ChatClassification Classification { get; init; }
    
    public required string ResponseMessage { get; init; }
    
    public WorkflowResponse? Workflow { get; init; }
    
    public List<string>? SuggestedActions { get; init; }
}

