using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace TodosV2.Models
{
    public class TodoInterfaceImplement : TodoInterface
    {
        private readonly TodoContext _context = null;

        public TodoInterfaceImplement(IOptions<Settings> settings)
        {
            _context = new TodoContext(settings);
        }

        public async Task AddTodoAsync(Todo item)
        {

            try
            {
                await _context.Todos.InsertOneAsync(item);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public bool numberOfTitle(Todo item)
        {
            var result = _context.Todos
                                .Find(document => document.title == item.title && document.UserId == item.UserId).ToList().Count;
            return result < 2;
        }

        public async Task<IEnumerable<Todo>> GetAllTodos()
        {
            try
            {
                return await _context.Todos
                        .Find(_ => true).ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<Todo> GetOneTodoAsync(string id)
        {
            var internalID = new BsonObjectId(new ObjectId(id));
            var filter = Builders<Todo>.Filter.Eq("InternalId", internalID);
            try
            {
                return await _context.Todos
                                .Find(filter).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IEnumerable<Todo>> GetTodoAsync(string id)
        {
            
               // filter all todos items to get a list for user with provieded ID
               var filter = Builders<Todo>.Filter.Eq("UserId", id);
            try
            {
                return await _context.Todos
                                .Find(filter).ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> RemoveTodoAsync(string id)
        {
            // convert string (id param) to object ID 
            var internalID = new BsonObjectId(new ObjectId(id));
            try
            {
                DeleteResult actionResult
                    = await _context.Todos.DeleteOneAsync(
                        Builders<Todo>.Filter.Eq("InternalId", internalID));

                return actionResult.IsAcknowledged
                    && actionResult.DeletedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UpdateTodoDocumentAsync(string id, bool status)
        {
            // convert string (id param) to object ID 
            var internalID = new BsonObjectId(new ObjectId(id));
            // use Object it to filter documents in database
            var filter = Builders<Todo>.Filter.Eq("InternalId", internalID);
            // update found document for the new status
            var update = Builders<Todo>.Update.Set("status", status);
            
            try
            {
                UpdateResult actionResult
                    = await _context.Todos.UpdateOneAsync(filter, update);

                return actionResult.IsAcknowledged
                    && actionResult.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UpdateTodoTitle(string id, string title)
        {
            // convert string (id param) to object ID 
            var internalID = new BsonObjectId(new ObjectId(id));
            // use Object it to filter documents in database
            var filter = Builders<Todo>.Filter.Eq("InternalId", internalID);
            // update found document for the new status
            var update = Builders<Todo>.Update.Set("title", title);
            try
            {
                UpdateResult actionResult
                    = await _context.Todos.UpdateOneAsync(filter, update);

                return actionResult.IsAcknowledged
                    && actionResult.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> UpdateTodoAssign(string id, string assign)
        {
            // convert string (id param) to object ID 
            var internalID = new BsonObjectId(new ObjectId(id));
            // use Object it to filter documents in database
            var filter = Builders<Todo>.Filter.Eq("InternalId", internalID);
            // update found document for the new status
            var update = Builders<Todo>.Update.Set("assinedTo", assign);
            try
            {
                UpdateResult actionResult
                    = await _context.Todos.UpdateOneAsync(filter, update);

                return actionResult.IsAcknowledged
                    && actionResult.ModifiedCount > 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
