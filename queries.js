const Pool = require('pg').Pool;

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'REST-API',
    password: 'postgres',
    port: 5432
});


// Svi taskovi zadatog usera
const getUserTasks = (request, response) => {
    const { userID, asc, requester } = request.params;
    let query = '';
    
    if (requester != userID) {
        response.status(403).send('Not authorized to view these tasks.');
    }

    if (asc == 'desc') {
        query = `SELECT * FROM "Task" WHERE "userID" = ${userID} ORDER BY id DESC`;
    }
    else {
        query = `SELECT * FROM "Task" WHERE "userID" = ${userID} ORDER BY id ASC`;
    }
    
    pool.query(query, (error, results) => {
        if (error) {
            throw error;
        } else if (results.rows == '') {
            response.status(404).send('No Tasks found.');
        } else {
            response.status(200).json(results.rows);
        }
    });
};

const createTask = (request, response) => {
    const userID = request.params.userID;
    const { body } = request.body;

    pool.query('INSERT INTO "Task" ("userID", "body") VALUES ($1, $2) RETURNING *;', 
        [ userID, body ], (error, results) => {
        
            // if (requester != userID) {
            //     response.status(403).send('Not authorized to create tasks.');
            // }
            
             if (error) {
                throw error;
            } else {
                response.status(201).json(results.rows);
            }
        }
    );

};

const updateTask = (request, response) => {
    // const userID = request.params.userID;
    const id = request.params.id;
    const { body } = request.body;
    
    pool.query('UPDATE "Task" SET "body"=$2 WHERE "id"=$1 RETURNING *;',
        [ id, body ], (error, results) => {

            if (error) {
                throw error;
            } else {
                response.status(200).json(results.rows);
            }
        }
    );
}

module.exports = {
    getUserTasks,
    createTask,
    updateTask
};