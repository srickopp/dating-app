import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { User } from './user.entity';
import { Swipe } from './swipe.entity';
import { UserPremium } from './user-premium.entity';

@Entity('profiles')
export class Profile {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    user_id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    age: number;

    @Column({ default: 0 })
    daily_swipe_count: number;

    @Column({ default: 0 })
    likes_count: number;

    @Column({ default: 'male' })
    gender: string;

    @Column({ nullable: true })
    bio: string;

    @Column({ nullable: true })
    image_url: string;

    @Column({ default: false })
    is_verified: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    updated_at: Date;

    @OneToOne(() => User, (user) => user.profile)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @OneToMany(() => Swipe, (swipe) => swipe.swiper)
    swipes: Swipe[];

    @OneToMany(() => Swipe, (swipe) => swipe.swiped)
    swiped: Swipe[];

    @OneToMany(() => UserPremium, (userPremium) => userPremium.profile)
    premium: UserPremium[];
}
