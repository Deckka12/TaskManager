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
    [Migration("20250318132844_ddelegramdosers22")]
    partial class ddelegramdosers22
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "9.0.2")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

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

                    b.Property<string>("Description")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime?>("DueDate")
                        .HasColumnType("datetime2");

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

                    b.Property<string>("WorkType")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("Id");

                    b.HasIndex("TaskId");

                    b.HasIndex("UserId");

                    b.ToTable("WorkLogs");
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

            modelBuilder.Entity("TaskManager.Domain.Entities.Project", b =>
                {
                    b.HasOne("TaskManager.Domain.Entities.User", "Owner")
                        .WithMany("Projects")
                        .HasForeignKey("OwnerId")
                        .OnDelete(DeleteBehavior.Restrict)
                        .IsRequired();

                    b.Navigation("Owner");
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

                    b.Navigation("Project");

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

                    b.Navigation("Task");

                    b.Navigation("User");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.Project", b =>
                {
                    b.Navigation("Tasks");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.TaskItem", b =>
                {
                    b.Navigation("Comments");

                    b.Navigation("WorkLogs");
                });

            modelBuilder.Entity("TaskManager.Domain.Entities.User", b =>
                {
                    b.Navigation("Projects");

                    b.Navigation("TaskFiles");

                    b.Navigation("Tasks");

                    b.Navigation("WorkLogs");
                });
#pragma warning restore 612, 618
        }
    }
}
