FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS base
USER $APP_UID
WORKDIR /app
EXPOSE 8080

FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["WorkflowBuilder.Api/WorkflowBuilder.Api.csproj", "WorkflowBuilder.Api/"]
RUN dotnet restore "WorkflowBuilder.Api/WorkflowBuilder.Api.csproj"
COPY . .
WORKDIR "/src/WorkflowBuilder.Api"
RUN dotnet build "./WorkflowBuilder.Api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./WorkflowBuilder.Api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "WorkflowBuilder.Api.dll"]
