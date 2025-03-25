using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TaskManager.Application.DTOs
{
    public class ProjectUserRoleDTO
    {
        public Guid UserId { get; set; }
        public string UserName { get; set; } = string.Empty;

        public Guid RoleId { get; set; }
        public string RoleName { get; set; } = string.Empty;
    }
}
