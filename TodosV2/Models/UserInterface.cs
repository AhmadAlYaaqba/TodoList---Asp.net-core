using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodosV2.Models
{
    public interface UserInterface
    {
        Task AddUserAsync(User user);
    }
}
