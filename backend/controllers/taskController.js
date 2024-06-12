const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.getAllTasks = async (req, res) => {
  const query = 'SELECT * FROM Users';
  db.query(query, (err, results) => {
    if (err) {
      res.status(500).send({ message: 'Error fetching Users' });
    } else {
      res.send(results);
    }
  });
}

exports.getTaskByLocation = async (req, res) => {
  const location = req.params.location;
  const query = `SELECT * FROM Users WHERE location = ?`;
  db.query(query,location, (err, results) => {
    if (err) {
      res.status(404).send({ message: 'Location not found' });
    } else {
      res.send(results[0]);
    }
  });
}

exports.getTaskByAuth = async (req, res) => {
  const { email, password } = req.body;
  const query = `SELECT * FROM Users WHERE email = ? AND password = ?`;
  db.query(query, [email, password], (err, results) => {
    if (err) {
      res.status(404).send({ message: 'user not found' });
    } else {
      //Assign JWT (json web token) to user
      const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
        expiresIn: '6h',
      });

      res.status(200).json({
        status: 'success',
        message: 'User signed in Successfully',
        token,
        user: {
          name: results[0].name,
          email: results[0].email,
          contact: results[0].contact,
          location: results[0].location,
          image: results[0].image
        },
      });
    }
  });
}

exports.addTask = async (req, res) => {
  const { name, email, contact, password, location, image } = req.body;
  const query = `INSERT INTO Users (name, email, contact, password, location) VALUES (?, ?, ?, ?, ?)`;
  db.query(query, [name, email, contact, password, location, image], (err, results) => {
    if (err) {
      console.error('Error adding User:', err);
      res.status(500).send({ message: 'Error adding User' });
    } else {
      //Assign JWT (json web token) to user
      const token = jwt.sign({ email: email }, process.env.SECRET_KEY, {
        expiresIn: '6h',
      });

      res.status(201).json({
        status: 'success',
        message: 'User registered Successfully',
        token,
        user: {
          name: name,
          email: email,
          contact: contact,
          location: location,
          image: image,
        },
      });
    }
  });
}

exports.updateTask = async (req, res) => {
  const id = req.params.id;
  const { name, email, contact, location } = req.body;
  const query = `UPDATE Users SET name = ?, email = ?, contact = ?, location = ? WHERE id = ${id}`;
  db.query(query, [name, description], (err, results) => {
    if (err) {
      res.status(404).send({ message: 'User not found' });
    } else {
      res.send({ message: 'User updated successfully' });
    }
  });
}

exports.deleteTask = async (req, res) => {
  const id = req.params.id;
  const query = `DELETE FROM Users WHERE id = ${id}`;
  db.query(query, (err, results) => {
    if (err) {
      res.status(404).send({ message: 'User not found' });
    } else {
      res.send({ message: 'User deleted successfully' });
    }
  });
}
