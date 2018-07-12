using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using System;

namespace TodosV2.Models
{
    public class Todo
    {
        [BsonId]
        public ObjectId InternalId { get; set; }               
        public string title { get; set; }
        public bool status { get; set; }
        public DateTime Start_Date { get; set; }
        public DateTime CreatedOn { get; set; } = DateTime.Now;
        public string UserId { get; set; } 
        public string assinedTo { get; set; }
    }
}
