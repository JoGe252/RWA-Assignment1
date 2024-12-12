import { MongoClient } from 'mongodb'

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    try {
      const url = process.env.DB_ADDRESS;
      const client = await clientPromise;
      const db = client.db('KrispyKreme_db');  // Replace with your actual database name

      // Insert the new user into the database
      await db.collection('users').insertOne({
        username,
        email,
        password  // Storing password directly (for testing purposes only)
      });

      // Respond to the client
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
}