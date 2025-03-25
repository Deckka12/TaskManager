using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection.Emit;
using System.Text;
using System.Threading.Tasks;
using TaskManager.Domain.Entities;

namespace TaskManager.Infrastructure.Configuration
{
    public class ProjectUserRoleConfiguration : IEntityTypeConfiguration<ProjectUserRole>
    {
        public void Configure(EntityTypeBuilder<ProjectUserRole> builder)
        {
            builder.HasKey(pur => new { pur.UserId, pur.ProjectId, pur.RoleId });

            builder.HasOne(pur => pur.User)
                .WithMany(u => u.ProjectUserRoles)
                .HasForeignKey(pur => pur.UserId);

            builder.HasOne(pur => pur.Project)
                .WithMany(p => p.ProjectUserRoles)
                .HasForeignKey(pur => pur.ProjectId);

            builder.HasOne(pur => pur.Role)
                .WithMany(r => r.ProjectUserRoles)
                .HasForeignKey(pur => pur.RoleId);
        }
    }
}
