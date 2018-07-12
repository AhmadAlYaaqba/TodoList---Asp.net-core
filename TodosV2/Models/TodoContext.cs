using Microsoft.Extensions.Options;
using MongoDB.Driver;

namespace TodosV2.Models
{
    public class TodoContext
    {
        private readonly IMongoDatabase _database = null;

        public TodoContext(IOptions<Settings> settings)
        {
            // connect to mongoDB server
            var client = new MongoClient(settings.Value.ConnectionString);
            if (client != null) // if server connected, connect with database
                _database = client.GetDatabase(settings.Value.Database);
        }

        public IMongoCollection<Todo> Todos
        {
            get
            {
                return _database.GetCollection<Todo>("Todo"); // get collection (Todo)
            }
        }
    }
}
