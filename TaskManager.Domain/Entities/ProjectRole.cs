using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManager.Domain.Entities
{
    public class ProjectRole
    {
        public Guid Id { get; set; }
        public string Name { get; set; }
        public ICollection<ProjectUserRole> ProjectUserRoles { get; set; }
    }
}
