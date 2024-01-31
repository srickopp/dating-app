import { DataSource } from 'typeorm';
import { Profile } from '../models/entities/profile.entity';
import { faker } from '@faker-js/faker';
import { PremiumPackage } from 'src/models/entities/premium-package.entity';

export async function seedData(dataSource: DataSource): Promise<void> {
    await profileSeed(dataSource);
    await packageSeed(dataSource);
}

async function profileSeed(dataSource: DataSource) {
    const profileRepo = dataSource.getRepository(Profile);

    const profiles: Profile[] = [];
    let gender: 'male' | 'female' = 'male';
    for (let index = 0; index < 100; index++) {
        gender = gender == 'male' ? 'female' : 'male';
        const profile = profileRepo.create({
            user_id: faker.string.uuid(),
            name: faker.person.fullName({
                sex: gender,
            }),
            gender,
            age: Number(
                faker.number.bigInt({
                    min: 17,
                    max: 40,
                }),
            ),
            bio: faker.person.bio(),
            image_url: faker.image.url(),
            likes_count: Number(
                faker.number.bigInt({
                    min: 10,
                    max: 1000,
                }),
            ),
            daily_swipe_count: 0,
            is_verified: faker.datatype.boolean(),
        });

        profiles.push(profile);
    }
    await profileRepo.save(profiles);
}

async function packageSeed(dataSource: DataSource) {
    const packageRepo = dataSource.getRepository(PremiumPackage);

    await packageRepo.save([
        {
            name: 'Verified Lable View',
            description: 'Can View User with Verified Label',
            price: 10000,
            total_purchased_user: 0,
        },
        {
            name: 'Unlimited Swipes!',
            description: 'Can Got an Unlimited Swipes!',
            price: 10000,
            total_purchased_user: 0,
        },
    ]);
}
