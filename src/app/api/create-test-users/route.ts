import { NextResponse } from 'next/server';
import { hash } from 'bcrypt';
import { db } from '@/lib/db';

export async function GET() {
    try {
        // Check if renter user already exists
        const existingRenter = await db.user.findUnique({
            where: {
                email: 'renter@example.com',
            },
        });

        // Check if owner user already exists
        const existingOwner = await db.user.findUnique({
            where: {
                email: 'owner@example.com',
            },
        });

        let renterUser;
        let ownerUser;
        let renterCreated = false;
        let ownerCreated = false;
        let listing;

        // Create renter user if it doesn't exist
        if (!existingRenter) {
            const hashedPassword = await hash('renter123', 10);

            renterUser = await db.user.create({
                data: {
                    name: 'Test Renter',
                    email: 'renter@example.com',
                    hashedPassword,
                    role: 'RENTER',
                },
            });
            renterCreated = true;
        } else {
            renterUser = existingRenter;
        }

        // Create owner user if it doesn't exist
        if (!existingOwner) {
            const hashedPassword = await hash('owner123', 10);

            ownerUser = await db.user.create({
                data: {
                    name: 'Test Owner',
                    email: 'owner@example.com',
                    hashedPassword,
                    role: 'OWNER',
                },
            });
            ownerCreated = true;

            // Create a sample listing for the owner
            listing = await db.listing.create({
                data: {
                    title: 'Luxury Apartment',
                    description: 'A beautiful luxury apartment with amazing views',
                    category: 'APARTMENT',
                    price: 150,
                    imageUrls: 'https://source.unsplash.com/random/?luxury,apartment',
                    address: '456 Park Ave',
                    city: 'New York',
                    state: 'NY',
                    country: 'USA',
                    features: 'WiFi, Kitchen, Air conditioning, Pool, Gym',
                    ownerId: ownerUser.id,
                },
            });

            // Create a booking from renter to owner
            if (renterUser) {
                const now = new Date();
                const startDate = new Date();
                startDate.setDate(now.getDate() + 7);
                const endDate = new Date();
                endDate.setDate(startDate.getDate() + 3);

                await db.booking.create({
                    data: {
                        startDate,
                        endDate,
                        totalPrice: 450,
                        status: 'PENDING',
                        listingId: listing.id,
                        renterId: renterUser.id,
                        ownerId: ownerUser.id,
                    },
                });
            }
        } else {
            ownerUser = existingOwner;
        }

        return NextResponse.json({
            message: 'Test users created successfully',
            users: {
                renter: {
                    created: renterCreated,
                    email: 'renter@example.com',
                    password: 'renter123',
                    role: 'RENTER'
                },
                owner: {
                    created: ownerCreated,
                    email: 'owner@example.com',
                    password: 'owner123',
                    role: 'OWNER'
                }
            }
        });
    } catch (error) {
        console.error('Error creating test users:', error);
        return NextResponse.json({ error: 'Failed to create test users' }, { status: 500 });
    }
} 