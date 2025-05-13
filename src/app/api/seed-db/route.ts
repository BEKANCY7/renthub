import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Check if test user already exists
        const existingUser = await db.user.findUnique({
            where: {
                email: 'test@example.com',
            },
        });

        if (existingUser) {
            return NextResponse.json({
                message: 'Test user already exists',
                loginCredentials: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            });
        }

        // Create a test user
        const hashedPassword = await hash('password123', 10);

        const testUser = await db.user.create({
            data: {
                name: 'Test User',
                email: 'test@example.com',
                hashedPassword,
                role: 'OWNER', // This allows accessing both renter and owner dashboards
            },
        });

        // Create a sample listing
        const listing = await db.listing.create({
            data: {
                title: 'Sample Apartment',
                description: 'A beautiful apartment in the heart of the city',
                category: 'APARTMENT',
                price: 100,
                imageUrls: 'https://source.unsplash.com/random/?apartment',
                address: '123 Main St',
                city: 'New York',
                state: 'NY',
                country: 'USA',
                features: 'WiFi, Kitchen, Air conditioning',
                ownerId: testUser.id,
            },
        });

        return NextResponse.json({
            message: 'Sample data created successfully',
            loginCredentials: {
                email: 'test@example.com',
                password: 'password123'
            },
            user: {
                id: testUser.id,
                email: testUser.email,
                role: testUser.role,
            },
            listing: {
                id: listing.id,
                title: listing.title,
            },
        });
    } catch (error) {
        console.error('Error seeding database:', error);
        return NextResponse.json({ error: 'Failed to seed database' }, { status: 500 });
    }
} 