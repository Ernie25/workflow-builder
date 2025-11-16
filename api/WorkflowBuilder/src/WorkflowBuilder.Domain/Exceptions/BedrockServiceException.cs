namespace WorkflowBuilder.Domain.Exceptions;

public sealed class BedrockServiceException : Exception
{
    public BedrockServiceException(string message) : base(message)
    {
    }

    public BedrockServiceException(string message, Exception innerException)
        : base(message, innerException)
    {
    }
}

