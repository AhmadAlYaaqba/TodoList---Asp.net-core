using System;

namespace TodosV2.Models
{
    public class TodoParam
    {
        public string title { get; set; }
        public bool status { get; set; } // completed or not
        public string UserId { get; set; }  // to make reference for user who create
        public DateTime Start_Date { get; set; }
        public string assinedTo { get; set; }
    }
}
