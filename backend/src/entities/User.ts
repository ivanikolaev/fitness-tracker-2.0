import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { Workout } from './Workout';

export enum UserRole {
    USER = 'user',
    TRAINER = 'trainer',
    ADMIN = 'admin',
}

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'first_name', length: 100 })
    firstName: string;

    @Column({ name: 'last_name', length: 100 })
    lastName: string;

    @Column({ unique: true })
    email: string;

    @Column({ select: false })
    password: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER,
    })
    role: UserRole;

    @Column({ name: 'profile_picture', nullable: true })
    profilePicture: string;

    @Column({ nullable: true })
    height: number;

    @Column({ nullable: true })
    weight: number;

    @Column({ name: 'date_of_birth', nullable: true })
    dateOfBirth: Date;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ name: 'refresh_token', nullable: true, type: 'text' })
    refreshToken: string | null;

    @OneToMany(() => Workout, workout => workout.user)
    workouts: Workout[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
