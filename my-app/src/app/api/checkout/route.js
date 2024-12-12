import { MongoClient } from 'mongodb';

export async function POST(req) {
    try {
        const { username, items, total } = await req.json();

        // MongoDB connection
        const url = 'use client';
        const uri = process.env.DB_ADDRESS;
        const client = new MongoClient(uri);
        const dbName = 'app';

        await client.connect();
        console.log('Connected to MongoDB for checkout');

        const db = client.db(dbName);
        const collection = db.collection('orders');

        // Insert the order into the orders collection
        const newOrder = {
            username,
            items,
            total,
        };

        const result = await collection.insertOne(newOrder);
        console.log(result.insertedId);

        return new Response(JSON.stringify({ success: true, orderId: result.insertedId }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' },
        });
    } catch (error) {
        console.error(error);
        return new Response(JSON.stringify({ error}), { status: 500 });
    }
}
