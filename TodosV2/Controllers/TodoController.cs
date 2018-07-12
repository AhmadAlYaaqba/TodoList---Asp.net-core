using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using TodosV2.Infrastructure;
using TodosV2.Models;

namespace TodosV2.Controllers
{
    [Produces("application/json")]
    [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
    [Route("api/[controller]")]
    [ApiController]
    public class TodoController : Controller
    {
        private readonly TodoInterface _TodoInterfaceImplement;
        private readonly IConfiguration _config;

        public TodoController(TodoInterface TodoInterfaceImplement, IConfiguration configuration)
        {
            _TodoInterfaceImplement = TodoInterfaceImplement;
            _config = configuration;
        }

        [NoCache]
        
        [HttpGet]
        public async Task<IEnumerable<Todo>> Get()
        {
            return await _TodoInterfaceImplement.GetAllTodos();
        }

        [HttpGet("{id}")]
        public async Task<IEnumerable<Todo>> Get(string id)
        {
            return await _TodoInterfaceImplement.GetTodoAsync(id);
        }

        [HttpPost]
        public async Task<IActionResult> Post([FromBody] TodoParam newTodo)
        {
            var result = _TodoInterfaceImplement.numberOfTitle(new Todo
            {
                title = newTodo.title,
                CreatedOn = DateTime.Now,
                status = newTodo.status,
                UserId = newTodo.UserId,
                Start_Date = newTodo.Start_Date,
                assinedTo = newTodo.assinedTo
            });
            if (result)
            {
                await _TodoInterfaceImplement.AddTodoAsync(new Todo
                {
                    title = newTodo.title,
                    CreatedOn = DateTime.Now,
                    status = newTodo.status,
                    UserId = newTodo.UserId,
                    Start_Date = newTodo.Start_Date,
                    assinedTo = newTodo.assinedTo
                });
                return Json(new RequestResult
                {
                    State = RequestState.Success,
                    Data = new { Msg = "Todo Created" }
                });
            } else
            {
                return Json(new RequestResult
                {
                    State = RequestState.Success,
                    Data = new { Msg = "There is 2 Todo with same title, please change title" }
                });

            }
            
        }

        [HttpPut("{id:length(24)}")]
        public void Put(string id, [FromBody]bool status)
        {
            _TodoInterfaceImplement.UpdateTodoDocumentAsync(id, status);
        }

        [HttpPut("title/{id}")]
        public void updateTitle(string id, [FromBody]string title)
        {
            _TodoInterfaceImplement.UpdateTodoTitle(id, title);
        }

        [HttpPut("assign/{id}")]
        public void updateAssign(string id, [FromBody]string assign)
        {
            _TodoInterfaceImplement.UpdateTodoAssign(id, assign);
        }

        [HttpDelete("{id:length(24)}")]
        public void Delete(string id)
        {
            _TodoInterfaceImplement.RemoveTodoAsync(id);
        }
    }
}