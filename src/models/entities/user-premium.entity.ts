import {
    Entity,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    Column,
    JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';
import { PremiumPackage } from './premium-package.entity';

@Entity('user_premiums')
export class UserPremium {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    profile_id: string;

    @Column({ nullable: false })
    package_id: string;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    start_date: Date;

    @UpdateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    end_date: Date;

    @ManyToOne(() => Profile, (profile) => profile.premiums)
    @JoinColumn({ name: 'profile_id' })
    profile: Profile;

    @ManyToOne(() => PremiumPackage, (p) => p.userPremiums)
    @JoinColumn({ name: 'package_id' })
    package: PremiumPackage;
}
