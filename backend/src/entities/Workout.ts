import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { User } from './User';
import { WorkoutExercise } from './WorkoutExercise';

@Entity('workouts')
export class Workout {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ name: 'scheduled_date', type: 'timestamp' })
    scheduledDate: Date;

    @Column({ name: 'completed_date', type: 'timestamp', nullable: true })
    completedDate: Date;

    @Column({ name: 'is_completed', default: false })
    isCompleted: boolean;

    @Column({ type: 'int', default: 0 })
    duration: number; // in minutes

    @ManyToOne(() => User, user => user.workouts)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    userId: string;

    @OneToMany(() => WorkoutExercise, workoutExercise => workoutExercise.workout, { cascade: true })
    workoutExercises: WorkoutExercise[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
