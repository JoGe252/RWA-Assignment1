import { MongoClient } from 'mongodb';

export async function POST(req) {
    try {
        console.log("In the putInCart API page");

        // Parse incoming data
        const body = await req.json();
        const { pname, username } = body;

        // Validate input
        if (!pname || !username) {
            console.error("Validation failed: pname or username is missing");
            return new Response(JSON.stringify({ error}), { status: 400 });
        }

        console.log("Product name:", pname);
        console.log("Username:", username);

        // MongoDB connection
        const uri = process.env.DB_ADDRESS;
        const client = new MongoClient(uri);
        const dbName = 'app';
        await client.connect();

        console.log('Connected successfully to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('shopping_cart1'); // Collection name for shopping cart

        // Insert the product into the shopping cart
        const insertResult = await collection.insertOne({ pname, username });

        console.log("Insert Result:", insertResult);

        // Return success response
        return new Response(JSON.stringify({ message: "Product added ", result: insertResult }), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Error in putInCart API:", error);
        return new Response(JSON.stringify({ error}), { status: 500 });
    }
}

  