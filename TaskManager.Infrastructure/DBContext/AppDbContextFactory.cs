using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.IO;

namespace TaskManager.Infrastructure.DBContext
{
    public class AppDbContextFactory : IDesignTimeDbContextFactory<AppDbContext>
    {
        public AppDbContext CreateDbContext(string[] args)
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory()) // Указываем путь к конфигурации
                .AddJsonFile("appsettings.json") // Загружаем строку подключения
                .Build();

            var optionsBuilder = new DbContextOptionsBuilder<AppDbContext>();

            // Подключаем SQL Server

            optionsBuilder.UseSqlServer(configuration.GetConnectionString("DefaultConnection"), options =>
            options.EnableRetryOnFailure(
                maxRetryCount: 5,
                maxRetryDelay: TimeSpan.FromSeconds(10),
                errorNumbersToAdd: null));


            return new AppDbContext(optionsBuilder.Options);
        }
    }
}
