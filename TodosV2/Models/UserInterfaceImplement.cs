using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace TodosV2.Models
{
    public class UserInterfaceImplement : UserInterface
    {
        private readonly UserContext _context = null;

        public UserInterfaceImplement(IOptions<Settings> settings)
        {
            _context = new UserContext(settings);
        }

        public async Task AddUserAsync(User user)
        {
            try
            {
                await _context.Users.InsertOneAsync(user);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
