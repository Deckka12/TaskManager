using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace TaskManager.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class Update_ProjectUserRole_CompositeKe : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectUserRole",
                table: "ProjectUserRole");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectUserRole",
                table: "ProjectUserRole",
                columns: new[] { "UserId", "ProjectId", "RoleId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_ProjectUserRole",
                table: "ProjectUserRole");

            migrationBuilder.AddPrimaryKey(
                name: "PK_ProjectUserRole",
                table: "ProjectUserRole",
                columns: new[] { "UserId", "ProjectId" });
        }
    }
}
