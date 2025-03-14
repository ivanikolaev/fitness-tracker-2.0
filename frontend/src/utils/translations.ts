// Define muscle group constants
export const MuscleGroup = {
    CHEST: 'chest',
    BACK: 'back',
    SHOULDERS: 'shoulders',
    ARMS: 'arms',
    LEGS: 'legs',
    CORE: 'core',
    FULL_BODY: 'full_body',
    CARDIO: 'cardio',
};

// Define exercise type constants
export const ExerciseType = {
    STRENGTH: 'strength',
    CARDIO: 'cardio',
    FLEXIBILITY: 'flexibility',
    BALANCE: 'balance',
};

// Translations for muscle groups
export const translateMuscleGroup = (muscleGroup: string): string => {
    switch (muscleGroup) {
        case MuscleGroup.CHEST:
            return 'Грудь';
        case MuscleGroup.BACK:
            return 'Спина';
        case MuscleGroup.SHOULDERS:
            return 'Плечи';
        case MuscleGroup.ARMS:
            return 'Руки';
        case MuscleGroup.LEGS:
            return 'Ноги';
        case MuscleGroup.CORE:
            return 'Кор';
        case MuscleGroup.FULL_BODY:
            return 'Все тело';
        case MuscleGroup.CARDIO:
            return 'Кардио';
        default:
            return muscleGroup;
    }
};

// Translations for exercise types
export const translateExerciseType = (exerciseType: string): string => {
    switch (exerciseType) {
        case ExerciseType.STRENGTH:
            return 'Силовое';
        case ExerciseType.CARDIO:
            return 'Кардио';
        case ExerciseType.FLEXIBILITY:
            return 'Гибкость';
        case ExerciseType.BALANCE:
            return 'Баланс';
        default:
            return exerciseType;
    }
};
