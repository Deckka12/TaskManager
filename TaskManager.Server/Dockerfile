# Стадия сборки
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
RUN apt-get update && apt-get install -y nodejs npm
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:5213
EXPOSE 5213
# Копируем проект и восстанавливаем зависимости
COPY *.sln .
COPY TaskManager.*/*.csproj ./
RUN for file in TaskManager.*.csproj; do mkdir -p "src/${file%%.csproj}" && mv "$file" "src/${file%%.csproj}/$file"; done

WORKDIR /app/src
COPY . .

WORKDIR /app/src/TaskManager.Server
RUN dotnet restore
RUN dotnet publish -c Release -o /out

# Финальный контейнер
FROM mcr.microsoft.com/dotnet/aspnet:9.0 AS runtime
WORKDIR /app
COPY --from=build /out ./

ENV ASPNETCORE_URLS=http://+:5213
EXPOSE 5213

ENTRYPOINT ["dotnet", "TaskManager.Server.dll"]
