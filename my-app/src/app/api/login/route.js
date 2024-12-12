import { MongoClient } from 'mongodb';

export async function GET(req) {
    console.log("in the api page");

    const { searchParams } = new URL(req.url);
    const email = searchParams.get('email');
    const pass = searchParams.get('pass');
    
    console.log("Received email:", email);
    console.log("Received password:", pass);

    const url = process.env.DB_ADDRESS;
    const client = new MongoClient(url);
    const dbName = 'app'; // Database name

    try {
        await client.connect();
        console.log('Connected successfully to server');

        const db = client.db(dbName);
        const collection = db.collection('login'); // Collection name

        // Find user by email
        const findResult = await collection.findOne({ username: email });
        console.log('Found document =>', findResult);

        let valid = false;

        // Check if user exists and validate password
        if (findResult) {
            console.log("User found:", findResult);
            if (findResult.password === pass) {
                valid = true;
                console.log("Login valid");
            } else {
                console.log("Incorrect password for email:", email);
            }
        } else {
            console.log("Invalid email:", email);
        }

        // Return response based on login validity
        return Response.json({ data: valid ? "valid" : "invalid" });
    } catch (error) {
        console.error("Error connecting to the database:", error);
        return Response.json({ error: "Internal Server Error" }, { status: 500 });
    } finally {
        await client.close(); // Ensure the client is closed after the operation
    }
}
