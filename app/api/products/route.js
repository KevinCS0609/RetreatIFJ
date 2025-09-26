import { NextResponse } from 'next/server';
import clientPromise from '../../lib/mongodb';
// import { ObjectId } from 'mongodb';

// GET - Mengambil semua produk
export async function GET(request) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const products = await db.collection('products').find({}).toArray();
        
        return NextResponse.json({
            success: true,
            data: products
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({
            success: false,
            message: 'Gagal mengambil data produk'
        }, { status: 500 });
    }
}

// POST - Menambah produk baru
export async function POST(request) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const body = await request.json();
        const { name, price, stock, category, description } = body;
        
        // Validasi data
        if (!name || !price || stock === undefined) {
            return NextResponse.json({
                success: false,
                message: 'Nama produk, harga, dan stok wajib diisi'
            }, { status: 400 });
        }
        
        const newProduct = {
            name,
            price: parseFloat(price),
            stock: parseInt(stock),
            category: category || 'Uncategorized',
            description: description || '',
            createdAt: new Date(),
            updatedAt: new Date()
        };
        
        const result = await db.collection('products').insertOne(newProduct);
        
        return NextResponse.json({
            success: true,
            message: 'Produk berhasil ditambahkan',
            data: { _id: result.insertedId, ...newProduct }
        }, { status: 201 });
        
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json({
            success: false,
            message: 'Gagal menambahkan produk'
        }, { status: 500 });
    }
}