using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Persistance.Migrations
{
    /// <inheritdoc />
    public partial class CommentAdded : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Comments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Body = table.Column<string>(type: "TEXT", nullable: true),
                    AuthorId = table.Column<string>(type: "TEXT", nullable: true),
                    PostId = table.Column<Guid>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Comments", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Comments_AspNetUsers_AuthorId",
                        column: x => x.AuthorId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Comments_Posts_PostId",
                        column: x => x.PostId,
                        principalTable: "Posts",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Comments_AuthorId",
                table: "Comments",
                column: "AuthorId");

            migrationBuilder.CreateIndex(
                name: "IX_Comments_PostId",
                table: "Comments",
                column: "PostId");


            migrationBuilder.RenameColumn(
                name: "CreatedOn",
                table: "Posts",
                newName: "CreatedAt");

			migrationBuilder.RenameColumn(
				name: "CreatedOn",
				table: "Images",
				newName: "CreatedAt");

			migrationBuilder.RenameColumn(
				name: "CreatedOn",
				table: "Likes",
				newName: "CreatedAt");

			migrationBuilder.RenameColumn(
				name: "CreatedOn",
				table: "AspNetUsers",
				newName: "CreatedAt");

		}

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Comments");


			migrationBuilder.RenameColumn(
				name: "CreatedAt",
				table: "Posts",
				newName: "CreatedOn");

			migrationBuilder.RenameColumn(
				name: "CreatedAt",
				table: "Images",
				newName: "CreatedOn");

			migrationBuilder.RenameColumn(
				name: "CreatedAt",
				table: "Likes",
				newName: "CreatedOn");

			migrationBuilder.RenameColumn(
				name: "CreatedAt",
				table: "AspNetUsers",
				newName: "CreatedOn");
		}
    }
}
