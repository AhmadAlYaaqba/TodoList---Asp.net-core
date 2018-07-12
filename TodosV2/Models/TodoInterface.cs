using System.Collections.Generic;
using System.Threading.Tasks;

namespace TodosV2.Models
{
    public interface TodoInterface
    {
        Task<IEnumerable<Todo>> GetAllTodos(); // for all todos
        Task<IEnumerable<Todo>> GetTodoAsync(string id); // todos for certain user by user id
        Task<Todo> GetOneTodoAsync(string id); // todos for certain user by user id
        Task AddTodoAsync(Todo item); // new Todo item
        Task<bool> RemoveTodoAsync(string id); // remove todo by its ID 
        Task<bool> UpdateTodoDocumentAsync(string id, bool status); // update the status of todo
        Task<bool> UpdateTodoTitle(string id, string title); // update the title
        Task<bool> UpdateTodoAssign(string id, string assign); // update the AssignTo
        bool numberOfTitle(Todo item);
    }
}
