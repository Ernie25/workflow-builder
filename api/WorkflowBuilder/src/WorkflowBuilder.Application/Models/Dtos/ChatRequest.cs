namespace WorkflowBuilder.Application.Models.Dtos;

public sealed record ChatRequest
{
    public required string Message { get; init; }
    
    public string? WorkflowId { get; init; }
}

