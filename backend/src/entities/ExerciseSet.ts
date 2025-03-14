import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { WorkoutExercise } from './WorkoutExercise';

@Entity('exercise_sets')
export class ExerciseSet {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WorkoutExercise, workoutExercise => workoutExercise.sets, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'workout_exercise_id' })
    workoutExercise: WorkoutExercise;

    @Column({ name: 'workout_exercise_id' })
    workoutExerciseId: string;

    @Column({ name: 'set_number', type: 'int', default: 1 })
    setNumber: number;

    @Column({ type: 'float', nullable: true })
    weight: number;

    @Column({ type: 'int', nullable: true })
    reps: number;

    @Column({ type: 'int', nullable: true })
    duration: number; // in seconds

    @Column({ type: 'float', nullable: true })
    distance: number; // in kilometers

    @Column({ name: 'is_completed', default: false })
    isCompleted: boolean;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
