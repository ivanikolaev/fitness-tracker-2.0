import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { WorkoutExercise } from './WorkoutExercise';

export enum MuscleGroup {
    CHEST = 'chest',
    BACK = 'back',
    SHOULDERS = 'shoulders',
    ARMS = 'arms',
    LEGS = 'legs',
    CORE = 'core',
    FULL_BODY = 'full_body',
    CARDIO = 'cardio',
}

export enum ExerciseType {
    STRENGTH = 'strength',
    CARDIO = 'cardio',
    FLEXIBILITY = 'flexibility',
    BALANCE = 'balance',
}

@Entity('exercises')
export class Exercise {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({
        name: 'primary_muscle_group',
        type: 'enum',
        enum: MuscleGroup,
        default: MuscleGroup.FULL_BODY,
    })
    primaryMuscleGroup: MuscleGroup;

    @Column({
        type: 'enum',
        enum: ExerciseType,
        default: ExerciseType.STRENGTH,
    })
    type: ExerciseType;

    @Column({ name: 'image_url', nullable: true })
    imageUrl: string;

    @Column({ name: 'video_url', nullable: true })
    videoUrl: string;

    @Column({ type: 'text', nullable: true })
    instructions: string;

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @OneToMany(() => WorkoutExercise, workoutExercise => workoutExercise.exercise)
    workoutExercises: WorkoutExercise[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
