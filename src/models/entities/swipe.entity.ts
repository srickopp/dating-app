import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Profile } from './profile.entity';

@Entity('swipes')
export class Swipe {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    swiper_id: string;

    @Column({ nullable: false })
    swiped_id: string;

    @Column({ nullable: false })
    is_like: boolean;

    @CreateDateColumn({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    created_at: Date;

    @ManyToOne(() => Profile, (profile) => profile.swipes)
    @JoinColumn({ name: 'swiper_id' })
    swiper: Profile;

    @ManyToOne(() => Profile, (profile) => profile.swiped)
    @JoinColumn({ name: 'swiped_id' })
    swiped: Profile;
}
