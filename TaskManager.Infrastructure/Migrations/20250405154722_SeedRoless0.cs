using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace TaskManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedRoless0 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.InsertData(
                table: "Role",
                columns: new[] { "Id", "Name" },
                values: new object[,]
                {
                    { new Guid("26a0356b-4055-4612-93c6-f0c69d116e97"), "moderator" },
                    { new Guid("57050ced-8aaf-4cd2-9fad-4fe44cb50985"), "user" },
                    { new Guid("eeed3e2b-c6f3-4d2b-b208-496b747160f9"), "admin" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("26a0356b-4055-4612-93c6-f0c69d116e97"));

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("57050ced-8aaf-4cd2-9fad-4fe44cb50985"));

            migrationBuilder.DeleteData(
                table: "Role",
                keyColumn: "Id",
                keyValue: new Guid("eeed3e2b-c6f3-4d2b-b208-496b747160f9"));
        }
    }
}
