﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TaskManager.Infrastructure.DBContext;

#nullable disable

namespace TaskManager.Infrastructure.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20250411093711_addnotifytable1")]
    partial class addnotifytable1
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("TaskManager.Domain.Entities.Category", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Category");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.Comment", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<Guid>("TaskId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Text")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("TaskId");

                    b.HasIndex("UserId");

                    b.ToTable("Comments");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.Notification", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<bool>("IsRead")
                        .HasColumnType("bit");

                    b.Property<string>("Message")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("UserId");

                    b.ToTable("Notifications");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.Project", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("OwnerId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("OwnerId");

                    b.ToTable("Projects");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.ProjectRole", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("ProjectRoles");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.ProjectUserRole", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("UserId", "ProjectId", "RoleId");

                    b.HasIndex("ProjectId");

                    b.HasIndex("RoleId");

                    b.ToTable("ProjectUserRole");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.Role", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Role");

                    b.HasData(
                        new
                        {
                            Id = new Guid("eeed3e2b-c6f3-4d2b-b208-496b747160f9"),
                            Name = "admin"
                        },
                        new
                        {
                            Id = new Guid("57050ced-8aaf-4cd2-9fad-4fe44cb50985"),
                            Name = "user"
                        },
                        new
                        {
                            Id = new Guid("26a0356b-4055-4612-93c6-f0c69d116e97"),
                            Name = "moderator"
                        });
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.TaskFile", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Id"));

                    b.Property<string>("ContentType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<byte[]>("Data")
                        .IsRequired()
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("FileName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("TaskId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("TaskId");

                    b.HasIndex("UserId");

                    b.ToTable("TaskFiles");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.TaskItem", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("CategoryId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("CategotyID")
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("ChangedDate")
                        .HasColumnType("datetime2");

                    b.Property<DateTime>("CreationDate")
                        .HasColumnType("datetime2");

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("DueDate")
                        .HasColumnType("datetime2");

                    b.Property<Guid?>("PerformerID")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Priority")
                        .HasColumnType("int");

                    b.Property<Guid>("ProjectId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<string>("Title")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("CategoryId");

                    b.HasIndex("PerformerID");

                    b.HasIndex("ProjectId");

                    b.HasIndex("UserId");

                    b.ToTable("Tasks");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<DateTime>("CreatedAt")
                        .HasColumnType("datetime2");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("PasswordHash")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("TelegramId")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("Users");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.UserRole", b =>
                {
                    b.Property<Guid>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("RoleId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("UserId", "RoleId");

                    b.HasIndex("RoleId");

                    b.ToTable("UserRole");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.WorkLog", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Comment")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Date")
                        .HasColumnType("datetime2");

                    b.Property<double>("HoursSpent")
                        .HasColumnType("float");

                    b.Property<Guid>("TaskId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid?>("UserId")
                        .HasColumnType("uniqueidentifier");

                    b.Property<Guid>("WorkTypeId")
                        .HasColumnType("uniqueidentifier");

                    b.HasKey("Id");

                    b.HasIndex("TaskId");

                    b.HasIndex("UserId");

                    b.HasIndex("WorkTypeId");

                    b.ToTable("WorkLogs");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.WorkType", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("uniqueidentifier");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.ToTable("WorkType");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.Comment", b =>
                {
                    b.HasOne("TaskManager.Domain.Entities.TaskItem", "Task")
                        .WithMany("Comments")
                        .HasForeignKey("TaskId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("TaskManager.Domain.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Task");

                    b.Navigation("User");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.Notification", b =>
                {
                    b.HasOne("TaskManager.Domain.Entities.User", "User")
                        .WithMany()
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("User");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.Project", b =>
                {
                    b.HasOne("TaskManager.Domain.Entities.User", "Owner")
                        .WithMany("Projects")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Owner");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.ProjectUserRole", b =>
                {
                    b.HasOne("TaskManager.Domain.Entities.Project", "Project")
                        .WithMany("ProjectUserRoles")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TaskManager.Domain.Entities.ProjectRole", "Role")
                        .WithMany("ProjectUserRoles")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TaskManager.Domain.Entities.User", "User")
                        .WithMany("ProjectUserRoles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Project");

                    b.Navigation("Role");

                    b.Navigation("User");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.TaskFile", b =>
                {
                    b.HasOne("TaskManager.Domain.Entities.TaskItem", "Task")
                        .WithMany()
                        .HasForeignKey("TaskId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TaskManager.Domain.Entities.User", null)
                        .WithMany("TaskFiles")
                        .HasForeignKey("UserId");

                    b.Navigation("Task");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.TaskItem", b =>
                {
                    b.HasOne("TaskManager.Domain.Entities.Category", "Category")
                        .WithMany("Tasks")
                        .HasForeignKey("CategoryId");

                    b.HasOne("TaskManager.Domain.Entities.User", "Performer")
                        .WithMany()
                        .HasForeignKey("PerformerID")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("TaskManager.Domain.Entities.Project", "Project")
                        .WithMany("Tasks")
                        .HasForeignKey("ProjectId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("TaskManager.Domain.Entities.User", "User")
                        .WithMany("Tasks")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Category");

                    b.Navigation("Performer");

                    b.Navigation("Project");

                    b.Navigation("User");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.UserRole", b =>
                {
                    b.HasOne("TaskManager.Domain.Entities.Role", "Role")
                        .WithMany("UserRoles")
                        .HasForeignKey("RoleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TaskManager.Domain.Entities.User", "User")
                        .WithMany("UserRoles")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Role");

                    b.Navigation("User");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.WorkLog", b =>
                {
                    b.HasOne("TaskManager.Domain.Entities.TaskItem", "Task")
                        .WithMany("WorkLogs")
                        .HasForeignKey("TaskId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.HasOne("TaskManager.Domain.Entities.User", "User")
                        .WithMany("WorkLogs")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Restrict);

                    b.HasOne("TaskManager.Domain.Entities.WorkType", "WorkType")
                        .WithMany("WorkLogs")
                        .HasForeignKey("WorkTypeId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Task");

                    b.Navigation("User");

                    b.Navigation("WorkType");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.Category", b =>
                {
                    b.Navigation("Tasks");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.Project", b =>
                {
                    b.Navigation("ProjectUserRoles");

                    b.Navigation("Tasks");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.ProjectRole", b =>
                {
                    b.Navigation("ProjectUserRoles");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.Role", b =>
                {
                    b.Navigation("UserRoles");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.TaskItem", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("WorkLogs");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.User", b =>
                {
                    b.Navigation("ProjectUserRoles");

                    b.Navigation("Projects");

                    b.Navigation("TaskFiles");

                    b.Navigation("Tasks");

                    b.Navigation("UserRoles");

                    b.Navigation("WorkLogs");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.WorkType", b =>
                {
                    b.Navigation("WorkLogs");
                });
#pragma warning restore 612, 618
        }
    }
}
