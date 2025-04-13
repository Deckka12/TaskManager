using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text;
using TaskManager.Application.Interface;
using TaskManager.Application.Interfaces;
using TaskManager.Application.Services;
using TaskManager.Domain.Interface;
using TaskManager.Infrastructure.DBContext;
using TaskManager.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// 1. База данных
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
    options.EnableSensitiveDataLogging();
});

// 2. Контроллеры + JSON циклы
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
    });

// 3. DI
builder.Services.AddScoped(typeof(IRepository<>), typeof(GenericRepository<>));
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<ITaskRepository, TaskRepository>();
builder.Services.AddScoped<ITaskService, TaskService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<IWorkLogRepository, WorkLogRepository>();
builder.Services.AddScoped<IWorkLogService, WorkLogService>();
builder.Services.AddScoped<ITaskFileRepository, TaskFileRepository>();
builder.Services.AddScoped<ITaskFileService, TaskFileService>();
builder.Services.AddScoped<IProjectRoleService, ProjectRoleService>();
builder.Services.AddScoped<IProjectRoleRepository, ProjectRoleRepository>();
builder.Services.AddScoped<IWorkTypeRepository, WorkTypeRepository>();
builder.Services.AddScoped<IWorkTypeService, WorkTypeService>();
builder.Services.AddScoped<ICommentRepository, CommentRepository>();
builder.Services.AddScoped<ICommentService, CommentService>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<NotificationServices>();
builder.Services.AddScoped<INotificationRepository, NotificationRepository>();
builder.Services.AddScoped<INotificationService, NotificationService>();
builder.Services.AddScoped<KafkaProducer>();
builder.Services.AddScoped<KafkaConsumer>();
builder.Services.AddSingleton<KafkaProducerService>();
builder.Services.AddHostedService<KafkaNotificationConsumer>();



// 4. SignalR
builder.Services.AddSignalR();

// 5. Telegram bot
builder.Services.AddSingleton<TelegramService>();

// 6. Аутентификация (Cookie + JWT)
builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.LoginPath = "/Users/Login";
        options.LogoutPath = "/Users/Logout";
    });

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata = false;
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

// 7. Кэш Redis
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});

// 8. Авторизация
builder.Services.AddAuthorization();

// 9. CORS для фронта
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins("http://localhost:3000") // ← строго HTTP, как у тебя на фронте
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials();
    });
});

// 10. Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new Microsoft.OpenApi.Models.OpenApiInfo
    {
        Title = "Task Manager API",
        Version = "v1"
    });
});

// 11. Serilog
builder.Host.UseSerilog((ctx, lc) =>
    lc.ReadFrom.Configuration(ctx.Configuration));

var app = builder.Build();

// 12. Swagger UI (только в деве)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// 13. Pipeline

app.UseRouting();

app.UseCors("AllowFrontend"); 

app.UseAuthentication();
app.UseAuthorization();

//app.UseHttpsRedirection(); 

app.MapControllers();
app.MapHub<NotificationHub>("/hubs/notifications");

app.UseDefaultFiles();
app.MapStaticAssets();
app.MapFallbackToFile("/index.html");

app.Run();
