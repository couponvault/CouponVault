require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function cleanNames() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        const db = mongoose.connection.db;

        const platforms = await db.collection('platforms').find({}).toArray();
        let updatedCount = 0;

        for (const platform of platforms) {
            let name = platform.name;
            // Remove domains like .com, .co.uk, .com.au, .in, .de, .fr, .co.id
            const toReplace = ['.com.au', '.co.uk', '.co.id', '.com', '.in', '.de', '.fr', '.co'];
            for (const ext of toReplace) {
                if (name.endsWith(ext)) {
                    name = name.slice(0, -ext.length);
                    break;
                }
            }

            // Capitalize first letter
            name = name.charAt(0).toUpperCase() + name.slice(1);

            if (name !== platform.name) {
                console.log(`Renaming: ${platform.name} -> ${name}`);
                
                // Update Platform
                await db.collection('platforms').updateOne(
                    { _id: platform._id },
                    { $set: { name: name } }
                );

                // Update all associated coupons
                await db.collection('coupons').updateMany(
                    { platform: platform._id },
                    { $set: { platformName: name } }
                );

                updatedCount++;
            }
        }

        console.log(`\nCleanup Complete! Updated ${updatedCount} platforms.`);
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
cleanNames();
