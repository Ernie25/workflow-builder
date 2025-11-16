namespace WorkflowBuilder.Infrastructure.Services.Bedrock;

public sealed class BedrockOptions
{
    public required string ModelId { get; init; }
    
    public required string Region { get; init; }
    
    public int MaxTokens { get; init; } = 4096;
    
    public double Temperature { get; init; } = 0.7;
}

