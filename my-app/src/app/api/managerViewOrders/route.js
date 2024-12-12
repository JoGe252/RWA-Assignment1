import { MongoClient } from 'mongodb';

export async function GET(req) {
    try {
        // MongoDB connection
        const uri = process.env.DB_ADDRESS;
        const client = new MongoClient(uri);
        const dbName = 'app';

        await client.connect();
        console.log('Connected successfully to MongoDB');

        const db = client.db(dbName);
        const collection = db.collection('orders'); // Ensure you are querying the "orders" collection

        // Retrieve all orders
        const orders = await collection.find({}).toArray();
        console.log('Orders Retrieved:', orders);

        return new Response(JSON.stringify(orders), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error( error);
        return new Response(JSON.stringify({ error}), { status: 500 });
    }
}