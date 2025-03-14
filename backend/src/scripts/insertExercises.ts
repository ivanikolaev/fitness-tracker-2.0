import { AppDataSource } from '../data-source';
import { Exercise, MuscleGroup, ExerciseType } from '../entities/Exercise';

// Array of exercises to insert
const exercises = [
    // Strength exercises
    {
        name: 'Жим штанги лежа',
        description: 'Базовое упражнение для развития грудных мышц и трицепсов',
        primaryMuscleGroup: MuscleGroup.CHEST,
        type: ExerciseType.STRENGTH,
        instructions: 'Лягте на скамью, возьмите штангу хватом шире плеч, опустите к груди и выжмите вверх',
        isActive: true
    },
    {
        name: 'Приседания со штангой',
        description: 'Комплексное упражнение для развития мышц ног и кора',
        primaryMuscleGroup: MuscleGroup.LEGS,
        type: ExerciseType.STRENGTH,
        instructions: 'Поставьте штангу на плечи, присядьте до параллели бедер с полом и вернитесь в исходное положение',
        isActive: true
    },
    {
        name: 'Становая тяга',
        description: 'Базовое упражнение для развития мышц спины, ягодиц и задней поверхности бедра',
        primaryMuscleGroup: MuscleGroup.BACK,
        type: ExerciseType.STRENGTH,
        instructions: 'Наклонитесь к штанге, возьмите ее хватом сверху, выпрямитесь, держа спину прямой',
        isActive: true
    },
    {
        name: 'Подтягивания',
        description: 'Эффективное упражнение для развития мышц спины и бицепсов',
        primaryMuscleGroup: MuscleGroup.BACK,
        type: ExerciseType.STRENGTH,
        instructions: 'Возьмитесь за перекладину хватом сверху, подтянитесь до подбородка и медленно опуститесь',
        isActive: true
    },
    {
        name: 'Отжимания от пола',
        description: 'Базовое упражнение для развития грудных мышц, плеч и трицепсов',
        primaryMuscleGroup: MuscleGroup.CHEST,
        type: ExerciseType.STRENGTH,
        instructions: 'Примите упор лежа, согните руки, опустив грудь к полу, затем выпрямите руки',
        isActive: true
    },
    {
        name: 'Жим гантелей над головой',
        description: 'Упражнение для развития дельтовидных мышц и трицепсов',
        primaryMuscleGroup: MuscleGroup.SHOULDERS,
        type: ExerciseType.STRENGTH,
        instructions: 'Сидя или стоя, поднимите гантели от плеч вверх над головой и вернитесь в исходное положение',
        isActive: true
    },
    {
        name: 'Сгибание рук с гантелями',
        description: 'Изолирующее упражнение для бицепсов',
        primaryMuscleGroup: MuscleGroup.ARMS,
        type: ExerciseType.STRENGTH,
        instructions: 'Стоя, держите гантели в опущенных руках, согните руки, поднимая гантели к плечам',
        isActive: true
    },
    {
        name: 'Разгибание рук на трицепс',
        description: 'Изолирующее упражнение для трицепсов',
        primaryMuscleGroup: MuscleGroup.ARMS,
        type: ExerciseType.STRENGTH,
        instructions: 'Сидя или стоя, поднимите гантель за голову, согнув руки, затем выпрямите руки вверх',
        isActive: true
    },
    {
        name: 'Планка',
        description: 'Статическое упражнение для укрепления кора и мышц пресса',
        primaryMuscleGroup: MuscleGroup.CORE,
        type: ExerciseType.STRENGTH,
        instructions: 'Примите положение упора на предплечьях и носках, держите тело прямым, напрягая мышцы кора',
        isActive: true
    },
    
    // Cardio exercises
    {
        name: 'Бег на беговой дорожке',
        description: 'Кардио упражнение для развития выносливости и сжигания калорий',
        primaryMuscleGroup: MuscleGroup.CARDIO,
        type: ExerciseType.CARDIO,
        instructions: 'Установите желаемую скорость и наклон, бегите в комфортном темпе',
        isActive: true
    },
    {
        name: 'Езда на велотренажере',
        description: 'Низкоударное кардио упражнение для развития выносливости ног',
        primaryMuscleGroup: MuscleGroup.CARDIO,
        type: ExerciseType.CARDIO,
        instructions: 'Отрегулируйте сиденье по высоте, установите сопротивление и крутите педали в комфортном темпе',
        isActive: true
    },
    {
        name: 'Прыжки со скакалкой',
        description: 'Интенсивное кардио упражнение для всего тела',
        primaryMuscleGroup: MuscleGroup.CARDIO,
        type: ExerciseType.CARDIO,
        instructions: 'Держите скакалку за ручки, вращайте запястьями и прыгайте, когда скакалка приближается к ногам',
        isActive: true
    },
    
    // Flexibility exercises
    {
        name: 'Растяжка подколенных сухожилий',
        description: 'Упражнение для улучшения гибкости задней поверхности бедра',
        primaryMuscleGroup: MuscleGroup.LEGS,
        type: ExerciseType.FLEXIBILITY,
        instructions: 'Сидя на полу, вытяните ноги вперед и наклонитесь, стараясь достать руками до стоп',
        isActive: true
    },
    {
        name: 'Растяжка грудных мышц',
        description: 'Упражнение для улучшения гибкости грудных мышц и плеч',
        primaryMuscleGroup: MuscleGroup.CHEST,
        type: ExerciseType.FLEXIBILITY,
        instructions: 'Встаньте в дверном проеме, поднимите руки в стороны, согнув в локтях, и наклонитесь вперед',
        isActive: true
    },
    
    // Balance exercises
    {
        name: 'Стойка на одной ноге',
        description: 'Упражнение для улучшения равновесия и координации',
        primaryMuscleGroup: MuscleGroup.LEGS,
        type: ExerciseType.BALANCE,
        instructions: 'Встаньте на одну ногу, другую согните в колене, удерживайте равновесие как можно дольше',
        isActive: true
    }
];

// Function to insert exercises directly
const insertExercises = async () => {
    try {
        // Initialize database connection
        await AppDataSource.initialize();
        console.log('Database connection established');

        // Insert exercises directly using SQL
        for (const exercise of exercises) {
            try {
                // Check if exercise already exists
                const existingExercise = await AppDataSource.query(
                    'SELECT id FROM exercises WHERE name = $1',
                    [exercise.name]
                );
                
                if (existingExercise.length > 0) {
                    console.log(`Exercise "${exercise.name}" already exists, skipping.`);
                    continue;
                }
                
                // Insert exercise
                const result = await AppDataSource.query(
                    `INSERT INTO exercises (
                        name, 
                        description, 
                        primary_muscle_group, 
                        type, 
                        instructions, 
                        is_active, 
                        created_at, 
                        updated_at
                    ) VALUES (
                        $1, $2, $3, $4, $5, $6, NOW(), NOW()
                    ) RETURNING id`,
                    [
                        exercise.name,
                        exercise.description,
                        exercise.primaryMuscleGroup,
                        exercise.type,
                        exercise.instructions,
                        exercise.isActive
                    ]
                );
                
                console.log(`Inserted exercise "${exercise.name}" with ID: ${result[0].id}`);
            } catch (err) {
                console.error(`Error inserting exercise "${exercise.name}":`, err);
            }
        }

        console.log('Exercise insertion completed');
    } catch (error) {
        console.error('Error during exercise insertion:', error);
    } finally {
        // Close database connection
        await AppDataSource.destroy();
        console.log('Database connection closed');
    }
};

// Run the function
insertExercises();
