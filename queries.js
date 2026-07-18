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
    const { userID, sort, requester } = request.params;
    let query = '';
    
    if (requester != userID) {
        response.status(403).send('Not authorized to view these tasks.');
    }

    if (sort.toUpperCase() == 'DESC') {
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
    const requester = request.params.requester;
    const { body } = request.body;

    if (requester != userID) {
        response.status(403).send('Can only create your own tasks.');
    }

    pool.query('INSERT INTO "Task" ("userID", "body") VALUES ($1, $2) RETURNING *;', 
        [ userID, body ], (error, results) => {
        
             if (error) {
                throw error;
            } else {
                response.status(201).json(results.rows);
            }
        }
    );

};

const updateTask = (request, response) => {
    const id = request.params.id;
    const { body } = request.body;
    const requester = request.params.requester;
    
    pool.query('SELECT 1 FROM "Task" WHERE id=$1;',
        [ id ], (error, results) => {
            console.log(`results.rows.length=${results.rows.length}`)
            if (results.rows.length === 0) {
                return response.status(404).json(`Task ${id} does not exist.`);
            }
            
            if (error) {
                throw error;
            }
        }

    )

    pool.query('SELECT "userID" FROM "Task" WHERE id=$1;',
        [ id ], (error, results) => {

            if (requester != id) {
                response.status(403).json('Not authorized to change this task.')
            }
            
            if (error) {
                throw error;
            }         
        }
    )

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