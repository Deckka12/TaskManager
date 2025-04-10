using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class ddorkypeupport12 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "WorkType",
                table: "WorkLogs");

            migrationBuilder.AddColumn<Guid>(
                name: "WorkTypeId",
                table: "WorkLogs",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));

            migrationBuilder.CreateTable(
                name: "WorkType",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WorkType", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_WorkLogs_WorkTypeId",
                table: "WorkLogs",
                column: "WorkTypeId");

            migrationBuilder.AddForeignKey(
                name: "FK_WorkLogs_WorkType_WorkTypeId",
                table: "WorkLogs",
                column: "WorkTypeId",
                principalTable: "WorkType",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WorkLogs_WorkType_WorkTypeId",
                table: "WorkLogs");

            migrationBuilder.DropTable(
                name: "WorkType");

            migrationBuilder.DropIndex(
                name: "IX_WorkLogs_WorkTypeId",
                table: "WorkLogs");

            migrationBuilder.DropColumn(
                name: "WorkTypeId",
                table: "WorkLogs");

            migrationBuilder.AddColumn<string>(
                name: "WorkType",
                table: "WorkLogs",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
