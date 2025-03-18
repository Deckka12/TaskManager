using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace TaskManager.Application.Services
{
    public class TelegramService
    {
        private readonly string _botToken;
        private readonly HttpClient _httpClient;

        public TelegramService(IConfiguration configuration)
        {
            _botToken = configuration["Telegram:BotToken"];
            _httpClient = new HttpClient();
        }

        // Метод для поиска chat_id по username через getUpdates
        public async Task<string?> GetChatIdByUsername(string username)
        {
            var url = $"https://api.telegram.org/bot{_botToken}/getUpdates";
            var response = await _httpClient.GetAsync(url);
            var responseString = await response.Content.ReadAsStringAsync();

            using (JsonDocument json = JsonDocument.Parse(responseString))
            {
                if (json.RootElement.TryGetProperty("result", out var updates))
                {
                    foreach (var update in updates.EnumerateArray())
                    {
                        if (update.TryGetProperty("message", out var message) &&
                            message.TryGetProperty("chat", out var chat) &&
                            message.TryGetProperty("from", out var fromUser))
                        {
                            var chatId = chat.GetProperty("id").ToString();
                            var user = fromUser.GetProperty("username").GetString();

                            if (!string.IsNullOrEmpty(user) && user.Equals(username, StringComparison.OrdinalIgnoreCase))
                            {
                                return chatId; // Нашли chat_id по username
                            }
                        }
                    }
                }
            }
            return null; // Не найден chat_id
        }

        // Метод отправки уведомлений
        public async Task SendNotification(string username, string message)
        {
            if (string.IsNullOrEmpty(username))
            {
                Console.WriteLine("Ошибка: username отсутствует.");
                return;
            }

            var chatId = await GetChatIdByUsername(username);
            if (string.IsNullOrEmpty(chatId))
            {
                Console.WriteLine($"Ошибка: Не удалось найти chat_id для @{username}. Попросите пользователя написать боту.");
                return;
            }

            var url = $"https://api.telegram.org/bot{_botToken}/sendMessage?chat_id={chatId}&text={message}";
            await _httpClient.GetAsync(url);
        }
    }
}
