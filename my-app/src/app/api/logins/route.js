import { MongoClient } from 'mongodb';

export async function POST(req) {
    let client; // Declare client variable outside of try block
    try {
        // Parse incoming data
        const body = await req.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            console.error("Validation failed: Email and password are required");
            return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
        }

        console.log("Received email:", email);
        console.log("Received password:", password);

        // Connect to MongoDB
        const uri = process.env.DB_ADDRESS;
        client = new MongoClient(uri); // Initialize client here
        const dbName = 'app';
        await client.connect();

        console.log('Connected successfully to MongoDB');

        const db = client.db(dbName);
        const usersCollection = db.collection('users');

        // Find user in database
        const user = await usersCollection.findOne({ email });
        if (!user) {
            console.error("Invalid email:", email);
            return new Response(JSON.stringify({ error: "Invalid email" }), { status: 404 });
        }

        // Validate password
        if (user.password !== password) {
            console.error("Incorrect password for email:", email);
            return new Response(JSON.stringify({ error: "Incorrect password" }), { status: 401 });
        }

        // Respond with success
        console.log("User logged in successfully:", user.name);
        return new Response(JSON.stringify({ message: "Logged in", username: user.name }), { status: 200 });
    } catch (error) {
        console.error("Internal server error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
    } finally {
        // Close the MongoDB client if it was initialized
        if (client) {
            await client.close();
        }
    }
}
