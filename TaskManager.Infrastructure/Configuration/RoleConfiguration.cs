using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using TaskManager.Domain.Entities;

namespace TaskManager.Infrastructure.Configuration
{
    public class RoleConfiguration : IEntityTypeConfiguration<Role>
    {
        public void Configure(EntityTypeBuilder<Role> builder)
        {
            builder.HasData(
                new Role { Id = Guid.Parse("EEED3E2B-C6F3-4D2B-B208-496B747160F9"), Name = "admin" },
                new Role { Id = Guid.Parse("57050CED-8AAF-4CD2-9FAD-4FE44CB50985"), Name = "user" },
                new Role { Id = Guid.Parse("26A0356B-4055-4612-93C6-F0C69D116E97"), Name = "moderator" }
            );
        }
    }
}
