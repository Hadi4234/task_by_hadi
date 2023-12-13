const express = require('express');
const errorHandler = require('./utils/errorhandler.js');
const mysql = require('mysql2');
const app = express();
const port = 5500;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const connection = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: '',
    database: 'my_db'
});


connection.connect((err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        return;
    }
    console.log('Connected to database');
});


const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        ID INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
        password VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
        type VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL,
        active TINYINT DEFAULT 1
    )
`;

connection.query(createUsersTableQuery, (err, results) => {
    if (err) throw err;
    console.log('Users table created or already exists');
});



const checkProcedureQuery = `
    SELECT COUNT(*)
    FROM information_schema.routines 
    WHERE routine_name = "addUser" 
    AND routine_schema = "my_db"
    AND routine_type = "PROCEDURE";
`;

connection.query(checkProcedureQuery, (error, results) => {
    if (error) throw error;
  
    const procedureExists = results[0]['COUNT(*)'] !== 0;
  
    if (!procedureExists) {
      // Create the procedure if it doesn't exist
      const createProcedureQuery = `
      CREATE PROCEDURE addUser(
        IN userEmail VARCHAR(255),
        IN userPassword VARCHAR(255),
        IN userType VARCHAR(255)
    )
    BEGIN
        INSERT INTO users (email, password, type)
        VALUES (userEmail, userPassword, userType);
    END 
      `;
  
    connection.query(createProcedureQuery, (createError) => {
        if (createError) throw createError;
        console.log('Procedure created');
      });
    } else {
      console.log('Procedure already exists');
    }
  });

app.post('/user', async(req, res) => {
    try {
        const {email, password, type} = req.body;
        const addUser = await connection
          .promise()
          .query(
            `CALL addUser(?, ?, ?)`,
            [email, password, type]
          );
        res.status(200).json({
          message: "User created",
        });
      } catch (err) {
        res.status(500).json({
          message: err,
        });
      }
});

app.delete("/user/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const update = await connection
        .promise()
        .query(
          `DELETE FROM  users where id = ?`,
          [id]
        );
      res.status(200).json({
        message: "deleted",
      });
    } catch (err) {
      res.status(500).json({
        message: err,
      });
    }
  });


app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
