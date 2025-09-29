// addData.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import connectDB from './config/db.js';

// Load Models
import User from './models/User.js';
import Category from './models/Category.js';
import Service from './models/Service.js';
import Booking from './models/Booking.js';
import ServiceProvider from './models/ServiceProvider.js';

// Load Sample Data
import { categories } from './data/sampleCategories.js';
import { services } from './data/sampleServices.js';
import { serviceProviders } from './data/sampleServiceProviders.js';

dotenv.config();

const addSampleData = async () => {
  await connectDB();
  try {
    // 1. Find the first user to assign a booking to.
    const existingUser = await User.findOne();
    if (!existingUser) {
      console.error('Error: No users found in the database. Please register at least one user before seeding.');
      process.exit(1);
    }
    console.log(`Found user: ${existingUser.fullName} to create a booking for.`);

    // 2. Add new categories
    const createdCategories = await Category.insertMany(categories);
    console.log(`${createdCategories.length} new categories added.`);

    // 3. Add new service providers
    const createdProviders = await ServiceProvider.insertMany(serviceProviders);
    console.log(`${createdProviders.length} new service providers added.`);

    // 4. Link new services to the new categories and providers, then add them
    const venueCategory = createdCategories.find(c => c.slug === 'venues');
    const bandCategory = createdCategories.find(c => c.slug === 'music-bands');
    
    const venueProvider = createdProviders.find(p => p.category === 'Venues');
    const bandProvider = createdProviders.find(p => p.category === 'Music Bands');
    
    const sampleServicesWithLinks = [
      { ...services[0], category: venueCategory._id, providers: [venueProvider._id] },
      { ...services[1], category: bandCategory._id, providers: [bandProvider._id] },
    ];
    
    const createdServices = await Service.insertMany(sampleServicesWithLinks);
    console.log(`${createdServices.length} new services added.`);

    // 5. Create a new sample booking
    const bookingService = createdServices[0]; // Let's book the venue
    
    // ----- START OF CHANGE -----
    
    const totalAmount = bookingService.priceInfo.amount;
    const paidAmount = 50000;
    const balanceAmount = totalAmount - paidAmount; // Manually calculate balance

    await Booking.create({
        user: existingUser._id,
        service: bookingService._id,
        serviceProvider: bookingService.providers[0],
        occasionType: "Sample Wedding Event",
        slot: {
            from: new Date('2025-11-15T10:00:00Z'),
            to: new Date('2025-11-15T22:00:00Z'),
        },
        payment: {
            total: totalAmount,
            paid: paidAmount,
            balance: balanceAmount, // Provide the calculated balance directly
        },
    });

    // ----- END OF CHANGE -----

    console.log('1 new booking created for the sample user.');


    console.log('\n✅✅✅ Sample data added successfully!');
    process.exit();
  } catch (error) {
    console.error(`\n❌❌❌ Error adding data: ${error.message}`);
    process.exit(1);
  }
};

addSampleData();