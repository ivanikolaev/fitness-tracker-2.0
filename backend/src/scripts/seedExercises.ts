import { AppDataSource } from '../data-source';
import { Exercise, MuscleGroup, ExerciseType } from '../entities/Exercise';

const exerciseRepository = AppDataSource.getRepository(Exercise);

// Array of exercises to seed
const exercises = [
    // Strength exercises
    {
        name: 'Жим штанги лежа',
        description: 'Базовое упражнение для развития грудных мышц и трицепсов',
        primaryMuscleGroup: MuscleGroup.CHEST,
        type: ExerciseType.STRENGTH,
        instructions: 'Лягте на скамью, возьмите штангу хватом шире плеч, опустите к груди и выжмите вверх'
    },
    {
        name: 'Приседания со штангой',
        description: 'Комплексное упражнение для развития мышц ног и кора',
        primaryMuscleGroup: MuscleGroup.LEGS,
        type: ExerciseType.STRENGTH,
        instructions: 'Поставьте штангу на плечи, присядьте до параллели бедер с полом и вернитесь в исходное положение'
    },
    {
        name: 'Становая тяга',
        description: 'Базовое упражнение для развития мышц спины, ягодиц и задней поверхности бедра',
        primaryMuscleGroup: MuscleGroup.BACK,
        type: ExerciseType.STRENGTH,
        instructions: 'Наклонитесь к штанге, возьмите ее хватом сверху, выпрямитесь, держа спину прямой'
    },
    {
        name: 'Подтягивания',
        description: 'Эффективное упражнение для развития мышц спины и бицепсов',
        primaryMuscleGroup: MuscleGroup.BACK,
        type: ExerciseType.STRENGTH,
        instructions: 'Возьмитесь за перекладину хватом сверху, подтянитесь до подбородка и медленно опуститесь'
    },
    {
        name: 'Отжимания от пола',
        description: 'Базовое упражнение для развития грудных мышц, плеч и трицепсов',
        primaryMuscleGroup: MuscleGroup.CHEST,
        type: ExerciseType.STRENGTH,
        instructions: 'Примите упор лежа, согните руки, опустив грудь к полу, затем выпрямите руки'
    },
    {
        name: 'Жим гантелей над головой',
        description: 'Упражнение для развития дельтовидных мышц и трицепсов',
        primaryMuscleGroup: MuscleGroup.SHOULDERS,
        type: ExerciseType.STRENGTH,
        instructions: 'Сидя или стоя, поднимите гантели от плеч вверх над головой и вернитесь в исходное положение'
    },
    {
        name: 'Сгибание рук с гантелями',
        description: 'Изолирующее упражнение для бицепсов',
        primaryMuscleGroup: MuscleGroup.ARMS,
        type: ExerciseType.STRENGTH,
        instructions: 'Стоя, держите гантели в опущенных руках, согните руки, поднимая гантели к плечам'
    },
    {
        name: 'Разгибание рук на трицепс',
        description: 'Изолирующее упражнение для трицепсов',
        primaryMuscleGroup: MuscleGroup.ARMS,
        type: ExerciseType.STRENGTH,
        instructions: 'Сидя или стоя, поднимите гантель за голову, согнув руки, затем выпрямите руки вверх'
    },
    {
        name: 'Планка',
        description: 'Статическое упражнение для укрепления кора и мышц пресса',
        primaryMuscleGroup: MuscleGroup.CORE,
        type: ExerciseType.STRENGTH,
        instructions: 'Примите положение упора на предплечьях и носках, держите тело прямым, напрягая мышцы кора'
    },
    
    // Cardio exercises
    {
        name: 'Бег на беговой дорожке',
        description: 'Кардио упражнение для развития выносливости и сжигания калорий',
        primaryMuscleGroup: MuscleGroup.CARDIO,
        type: ExerciseType.CARDIO,
        instructions: 'Установите желаемую скорость и наклон, бегите в комфортном темпе'
    },
    {
        name: 'Езда на велотренажере',
        description: 'Низкоударное кардио упражнение для развития выносливости ног',
        primaryMuscleGroup: MuscleGroup.CARDIO,
        type: ExerciseType.CARDIO,
        instructions: 'Отрегулируйте сиденье по высоте, установите сопротивление и крутите педали в комфортном темпе'
    },
    {
        name: 'Прыжки со скакалкой',
        description: 'Интенсивное кардио упражнение для всего тела',
        primaryMuscleGroup: MuscleGroup.CARDIO,
        type: ExerciseType.CARDIO,
        instructions: 'Держите скакалку за ручки, вращайте запястьями и прыгайте, когда скакалка приближается к ногам'
    },
    
    // Flexibility exercises
    {
        name: 'Растяжка подколенных сухожилий',
        description: 'Упражнение для улучшения гибкости задней поверхности бедра',
        primaryMuscleGroup: MuscleGroup.LEGS,
        type: ExerciseType.FLEXIBILITY,
        instructions: 'Сидя на полу, вытяните ноги вперед и наклонитесь, стараясь достать руками до стоп'
    },
    {
        name: 'Растяжка грудных мышц',
        description: 'Упражнение для улучшения гибкости грудных мышц и плеч',
        primaryMuscleGroup: MuscleGroup.CHEST,
        type: ExerciseType.FLEXIBILITY,
        instructions: 'Встаньте в дверном проеме, поднимите руки в стороны, согнув в локтях, и наклонитесь вперед'
    },
    
    // Balance exercises
    {
        name: 'Стойка на одной ноге',
        description: 'Упражнение для улучшения равновесия и координации',
        primaryMuscleGroup: MuscleGroup.LEGS,
        type: ExerciseType.BALANCE,
        instructions: 'Встаньте на одну ногу, другую согните в колене, удерживайте равновесие как можно дольше'
    }
];

// Function to seed exercises
const seedExercises = async () => {
    try {
        // Initialize database connection
        await AppDataSource.initialize();
        console.log('Database connection established');

        // Get existing exercises
        const existingExercises = await exerciseRepository.find();
        console.log(`Database already has ${existingExercises.length} exercises.`);
        console.log('Existing exercise names:', existingExercises.map(ex => ex.name));
        
        // Get existing exercise names
        const existingNames = existingExercises.map(ex => ex.name);
        
        // Filter out exercises that already exist by name
        const newExercises = exercises.filter(ex => !existingNames.includes(ex.name));
        console.log('New exercises to add:', newExercises.map(ex => ex.name));
        
        if (newExercises.length === 0) {
            console.log('No new exercises to add.');
            return;
        }
        
        console.log(`Adding ${newExercises.length} new exercises...`);
        
        // Create and save new exercises
        for (const exerciseData of newExercises) {
            const exercise = exerciseRepository.create(exerciseData);
            await exerciseRepository.save(exercise);
            console.log(`Created exercise: ${exercise.name}`);
        }

        console.log('Exercise seeding completed successfully');
    } catch (error) {
        console.error('Error during exercise seeding:', error);
    } finally {
        // Close database connection
        await AppDataSource.destroy();
        console.log('Database connection closed');
    }
};

// Run the seed function
seedExercises();
