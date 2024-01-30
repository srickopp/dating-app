import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { UserPremium } from './user-premium.entity';

@Entity('premium_packages')
export class PremiumPackage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    name: string;

    @Column({ nullable: false })
    total_purchased_user: number;

    @Column({ nullable: false })
    price: number;

    @Column({ nullable: true })
    description: string;

    @OneToMany(() => UserPremium, (userPremium) => userPremium.package)
    userPremiums: UserPremium[];
}
