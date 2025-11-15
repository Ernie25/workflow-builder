namespace WorkflowBuilder.Application.Models.Dtos;

public sealed record WorkflowConnectionDto
{
    public required string From { get; init; }
    
    public required string To { get; init; }
    
    public ConnectionConditionDto? Condition { get; init; }
}

public sealed record ConnectionConditionDto
{
    public required string Type { get; init; }
    
    public string? Expression { get; init; }
}

