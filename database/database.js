const mariadb = require('mariadb');
const fs = require('fs');
const { DBhost, DBuser, DBpassword, DBport, DBdefaultdatabse } = require('../config/config.json');


class Database {
    constructor() {
        this.testConnectionAndSetup();
    }
    async testConnectionAndSetup() {
        try {
            this.conn = await mariadb.createConnection({
                host: DBhost,
                user: DBuser,
                password: DBpassword,
                port: DBport,
                database: DBdefaultdatabse,
                trace: true
            });
            console.log("Database connection established! Initial connection id is: " + this.conn.threadId);
        } catch (err) {
            console.log("Failed to connect to Database!: " + err);
            process.exit(5);
        }
        //run dbsetup.sql setup, after connection is established
        this.setupDatabase();
    }
    async openConnection(isSilent) {
        try {
            this.conn = await mariadb.createConnection({
                host: DBhost,
                user: DBuser,
                password: DBpassword,
                port: DBport,
                database: DBdefaultdatabse,
                trace: true
            });
            if(isSilent){
                console.log("Database connection established! connection id is: " + this.conn.threadId);
            }
            
        } catch (err) {
            console.log("Failed to connect to Database!: " + err);
            process.exit(5);
        }
    }

    async setupDatabase() {
        console.log("Running Database Setup (dbsetup.sql)");
        try {

            const sqlFile = fs.readFileSync("./dbsetup.sql", 'utf8')
                .split("\r\n").join("")//remove new lines, for some reason connector doesnt like it
                .split(";");//Split Queries into seperate statements

            sqlFile.forEach(statement => {
                if(statement !== '') {
                    this.queryDatabase(statement, true);
                }
            });

        } catch (err) {
            console.log("Setup failed!" + err);
            process.exit(5);
        }
        console.log("Database Setup Executed!");
    }

    async queryDatabase(statement, values, isSilent) {
        this.openConnection(isSilent);
        if(isSilent){
            console.log("Querying Database with: " + statement + " and the values " + values);
        }
        try {
            const res = await this.conn.query({sql: statement}, values)
            return res;

        } catch (err) {
            console.log("Query failed!" + err + statement);
            process.exit(5);
        }
        this.conn.end();
    }
}

const database = new Database();

module.exports = database;