import knex from 'knex'

const pathToFile = './chat.json'

export class ChatManager {
    constructor(options, tableName) {
        const database = knex(options);
        database.schema.hasTable(tableName).then(function(exists) {
            if (!exists) {
              return database.schema.createTable(tableName, table => {
                table.increments('id')
                table.string('message', 200)
                table.string('timestamp', 200)
                table.string('email', 2000)
             });
            }
          });
        this.database = database;
        this.table = tableName;
    }

    create = async (message) => {
        let messageTS= {
            message: message.message,
            email: message.email,
            timestamp: new Date().toLocaleString()
        }
        return await this.database(this.table).insert(messageTS)

    }
    findAll = async () => {
        let chat = JSON.parse(JSON.stringify(await this.database.from(this.table).select('*')))
        return await chat
    }
}

