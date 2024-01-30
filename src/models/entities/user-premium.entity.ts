import { Entity, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, Column } from 'typeorm';
import { Profile } from './profile.entity';
import { PremiumPackage } from './premium-package.entity';

@Entity('user_premiums')
export class UserPremium {
    @PrimaryGeneratedColumn('uuid')
    profile_id: string;

    @Column({ nullable: false })
    package_id: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    start_date: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    end_date: Date;

    @ManyToOne(() => Profile, (profile) => profile.userPremiums)
    profile: Profile;

    @ManyToOne(() => PremiumPackage, (p) => p.userPremiums)
    package: PremiumPackage;
}
