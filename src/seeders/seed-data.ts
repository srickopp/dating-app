import { DataSource } from 'typeorm';
import { Profile } from '../models/entities/profile.entity';
import { faker } from '@faker-js/faker';

export async function seedData(dataSource: DataSource): Promise<void> {
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
