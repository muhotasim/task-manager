const Datastore = require('nedb');
let ProjectStore = new Datastore({ filename: __dirname+"/_db/projects.db", autoload: true });
let TasksStore = new Datastore({ filename: __dirname+"/_db/tasks.db", autoload: true });
let db = {
    ProjectStore,
    TasksStore
}
module.exports  = db;