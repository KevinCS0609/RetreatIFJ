import { NextResponse } from 'next/server';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

// GET - Mengambil produk berdasarkan ID
export async function GET(request, { params }) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const { id } = params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                message: 'ID produk tidak valid'
            }, { status: 400 });
        }
        
        const product = await db.collection('products').findOne({ _id: new ObjectId(id) });
        
        if (!product) {
            return NextResponse.json({
                success: false,
                message: 'Produk tidak ditemukan'
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            data: product
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({
            success: false,
            message: 'Gagal mengambil data produk'
        }, { status: 500 });
    }
}

// PUT - Mengupdate produk
export async function PUT(request, { params }) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const { id } = params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                message: 'ID produk tidak valid'
            }, { status: 400 });
        }
        
        const body = await request.json();
        const { name, price, stock, category, description } = body;
        
        // Validasi data
        if (!name || !price || stock === undefined) {
            return NextResponse.json({
                success: false,
                message: 'Nama produk, harga, dan stok wajib diisi'
            }, { status: 400 });
        }
        
        const updateData = {
            name,
            price: parseFloat(price),
            stock: parseInt(stock),
            category: category || 'Uncategorized',
            description: description || '',
            updatedAt: new Date()
        };
        
        const result = await db.collection('products').updateOne(
            { _id: new ObjectId(id) },
            { $set: updateData }
        );
        
        if (result.matchedCount === 0) {
            return NextResponse.json({
                success: false,
                message: 'Produk tidak ditemukan'
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            message: 'Produk berhasil diupdate'
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error updating product:', error);
        return NextResponse.json({
            success: false,
            message: 'Gagal mengupdate produk'
        }, { status: 500 });
    }
}

// DELETE - Menghapus produk
export async function DELETE(request, { params }) {
    try {
        const client = await clientPromise;
        const db = client.db(process.env.MONGODB_DB);
        
        const { id } = params;
        
        if (!ObjectId.isValid(id)) {
            return NextResponse.json({
                success: false,
                message: 'ID produk tidak valid'
            }, { status: 400 });
        }
        
        const result = await db.collection('products').deleteOne({ _id: new ObjectId(id) });
        
        if (result.deletedCount === 0) {
            return NextResponse.json({
                success: false,
                message: 'Produk tidak ditemukan'
            }, { status: 404 });
        }
        
        return NextResponse.json({
            success: true,
            message: 'Produk berhasil dihapus'
        }, { status: 200 });
        
    } catch (error) {
        console.error('Error deleting product:', error);
        return NextResponse.json({
            success: false,
            message: 'Gagal menghapus produk'
        }, { status: 500 });
    }
}