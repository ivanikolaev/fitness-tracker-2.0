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
import { Workout } from './Workout';
import { Exercise } from './Exercise';
import { ExerciseSet } from './ExerciseSet';

@Entity('workout_exercises')
export class WorkoutExercise {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Workout, workout => workout.workoutExercises, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workout_id' })
    workout: Workout;

    @Column({ name: 'workout_id' })
    workoutId: string;

    @ManyToOne(() => Exercise, exercise => exercise.workoutExercises)
    @JoinColumn({ name: 'exercise_id' })
    exercise: Exercise;

    @Column({ name: 'exercise_id' })
    exerciseId: string;

    @Column({ type: 'int', default: 0 })
    order: number;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @Column({ name: 'is_completed', default: false })
    isCompleted: boolean;

    @OneToMany(() => ExerciseSet, exerciseSet => exerciseSet.workoutExercise, { cascade: true })
    sets: ExerciseSet[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
