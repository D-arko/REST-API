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
    const userID = request.params.userID;
    const asc = request.params.asc;
    const requester = request.params.requester;
    let query = '';
        
    if (asc == 'desc') {
        query = `SELECT * FROM "Task" WHERE "userID" = ${userID} ORDER BY id DESC`;
    }
    else {
        query = `SELECT * FROM "Task" WHERE "userID" = ${id} ORDER BY ${orderBy} ASC`;
    }
    
    pool.query(query, (error, results) => {
        if (requester != userID) {
            response.status(403).send('Not authorized to view this tasks.');
        }
        else if (error) {
            throw error;   
        } else if (results.rows == '') {
            response.status(404).send('No Tasks found.');
        } else {
            response.status(200).json(results.rows);
        }
    });
};



module.exports = {
    getUserTasks,
};