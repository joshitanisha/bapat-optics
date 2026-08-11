"start": "nodemon index.js", // Start the server

"sq:init": "sequelize-cli init", // Initialize Sequelize project
example : npm run sq:init

"sq:model:create": "sequelize-cli model:generate --name", // Generate a model
example : npm run sq:model:create -- Users --attributes name:string,email:string,password:string

"sq:migration:create": "sequelize-cli migration:generate --name", // Create a migration
example : npm run sq:migration:create -- add-category

"sq:db:create": "sequelize-cli db:create", // Create the database
example: npm run sq:db:create

"sq:db:drop": "sequelize-cli db:drop", // Drop the database
example : npm run sq:db:drop

"sq:db:migrate": "sequelize-cli db:migrate", // Run migrations
example : npm run sq:db:migrate

"sq:db:migrate:undo": "sequelize-cli db:migrate:undo", // Undo last migration
example : npm run sq:db:migrate:undo

"sq:db:migrate:undo:all": "sequelize-cli db:migrate:undo:all", // Undo all migrations
example : npm run sq:db:migrate:undo:all

"sq:db:seed": "sequelize-cli db:seed:all", // Run all seeds
example :npm run sq:db:seed 

"sq:db:seed:undo": "sequelize-cli db:seed:undo", // Undo last seed
example : npm run sq:db:seed:undo

"sq:db:seed:undo:all": "sequelize-cli db:seed:undo:all" // Undo all seeds
example : npm run sq:db:seed:undo:all

"sq:seed:create": "sequelize-cli seed:generate --name" // Create a new seed
example : npm run sq:seed:create -- Roles

"sq:seed:create": "sequelize-cli seed:generate --name" // Create a new seed
example : npx sequelize-cli db:migrate:undo --name MIGRATION_FILENAME.js
