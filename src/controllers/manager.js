import knex from 'knex'

export class Manager {
    constructor(options, tableName) {
        const database = knex(options);
        database.schema.hasTable(tableName).then(function(exists) {
            if (!exists) {
                console.log('tabla creada')
                return database.schema.createTable(tableName, table => {
                table.increments('id')
                table.string('title', 200)
                table.integer('price')
                table.string('thumbnail', 2000)
             });
            }
          });
        this.database = database;
        this.table = tableName;
    }

    createTable = async (options, tableName)=> {
        const database = knex(options);
        await database.schema.hasTable(tableName).then(function(exists) {
            if (!exists) {
                console.log('tabla creada')
                return database.schema.createTable(tableName, table => {
                table.increments('id')
                table.string('title', 200)
                table.integer('price')
                table.string('thumbnail', 2000)
             });
            }
          });
    }

    create = async (producto) => {
        return await this.database(this.table).insert(producto)
    }
    
    findAll = async () =>{
        let producto = JSON.parse(JSON.stringify(await this.database.from(this.table).select('*')))
        return await producto;
    }

    findById = async (id) =>{
        id = parseInt(id);
        let producto = JSON.parse(JSON.stringify(await this.database.from(this.table).select('*').where('id', id)))
        return await producto;
    }

    update = async (id, producto) => {
        id = parseInt(id);
        return await this.database(this.table).where('id', id).update(producto)
    }

    delete = async (id) => {
        id = parseInt(id);
        return await this.database(this.table).where('id', id).del()
}
}


