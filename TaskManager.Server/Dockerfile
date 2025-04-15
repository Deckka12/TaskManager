# ---------- Stage 1: Build Frontend ----------
FROM node:20-alpine AS frontend-build

WORKDIR /app/frontend
COPY taskmanager.client/ ./

# Устанавливаем переменную окружения DOCKER=true
ENV DOCKER=true

RUN npm install
RUN npm run build

# ---------- Stage 2: Build Backend ----------
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS backend-build
RUN apt-get update && \
    apt-get install -y curl && \
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && \
    apt-get install -y nodejs && \
    node -v && npm -v

WORKDIR /src
COPY TaskManager.sln ./
COPY taskmanager.client/ ./taskmanager.client/
COPY TaskManager.Application/ ./TaskManager.Application/
COPY TaskManager.Domain/ ./TaskManager.Domain/
COPY TaskManager.Infrastructure/ ./TaskManager.Infrastructure/
COPY TaskManager.Server/ ./TaskManager.Server/

WORKDIR /src/TaskManager.Server
RUN dotnet restore
RUN dotnet publish "TaskManager.Server.csproj" -c Release -o /app/publish --nologo --verbosity detailed

# ---------- Stage 3: Final Image ----------
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS final

WORKDIR /app
COPY --from=backend-build /app/publish ./
COPY --from=frontend-build /app/frontend/dist ./wwwroot


EXPOSE 80
ENTRYPOINT ["dotnet", "TaskManager.Server.dll"]
