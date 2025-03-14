import { useState } from 'react';
import { useGetExercisesQuery } from '../../api/exercisesApiSlice';
import './ExercisesPage.css';

const ExercisesPage = () => {
    const [selectedType, setSelectedType] = useState<string>('');
    const [selectedMuscleGroup, setSelectedMuscleGroup] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [page, setPage] = useState(1);
    const limit = 12;

    // Fetch exercises based on filters
    const {
        data: exercisesData,
        isLoading,
        isError,
    } = useGetExercisesQuery({
        type: selectedType || undefined,
        muscleGroup: selectedMuscleGroup || undefined,
        search: searchQuery || undefined,
        page,
        limit,
    });

    // Extract exercises from response data
    const exercises = exercisesData?.data.exercises || [];
    const totalExercises = exercisesData?.data.total || 0;
    const totalPages = Math.ceil(totalExercises / limit);

    // Handle filter change
    const handleFilterChange = (type: string, value: string) => {
        if (type === 'type') {
            setSelectedType(value);
        } else if (type === 'muscleGroup') {
            setSelectedMuscleGroup(value);
        }
        setPage(1); // Reset to first page when filter changes
    };

    // Handle search
    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setPage(1); // Reset to first page when search changes
    };

    // Handle pagination
    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    // Filter options
    const exerciseTypes = ['strength', 'cardio', 'flexibility', 'balance'];
    const muscleGroups = [
        'chest',
        'back',
        'shoulders',
        'arms',
        'legs',
        'core',
        'full_body',
        'cardio',
    ];

    return (
        <div className="exercises-page">
            <header className="exercises-header">
                <h1>Exercise Library</h1>
                <p className="exercises-subtitle">
                    Browse and search for exercises to add to your workouts
                </p>
            </header>

            <div className="filters-section">
                <form className="search-form" onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search exercises..."
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                    <button type="submit" className="search-btn">
                        Search
                    </button>
                </form>

                <div className="filter-controls">
                    <div className="filter-group">
                        <label htmlFor="exerciseType">Exercise Type</label>
                        <select
                            id="exerciseType"
                            value={selectedType}
                            onChange={e => handleFilterChange('type', e.target.value)}
                        >
                            <option value="">All Types</option>
                            {exerciseTypes.map(type => (
                                <option key={type} value={type}>
                                    {type.charAt(0).toUpperCase() + type.slice(1)}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label htmlFor="muscleGroup">Muscle Group</label>
                        <select
                            id="muscleGroup"
                            value={selectedMuscleGroup}
                            onChange={e => handleFilterChange('muscleGroup', e.target.value)}
                        >
                            <option value="">All Muscle Groups</option>
                            {muscleGroups.map(group => (
                                <option key={group} value={group}>
                                    {group
                                        .split('_')
                                        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                                        .join(' ')}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {isLoading ? (
                <div className="loading-state">Loading exercises...</div>
            ) : isError ? (
                <div className="error-state">Failed to load exercises. Please try again.</div>
            ) : exercises.length === 0 ? (
                <div className="empty-state">
                    <p>No exercises found matching your criteria.</p>
                    <button
                        className="clear-filters-btn"
                        onClick={() => {
                            setSelectedType('');
                            setSelectedMuscleGroup('');
                            setSearchQuery('');
                            setPage(1);
                        }}
                    >
                        Clear Filters
                    </button>
                </div>
            ) : (
                <>
                    <div className="exercises-grid">
                        {exercises.map(exercise => (
                            <div className="exercise-card" key={exercise.id}>
                                <div className="exercise-header">
                                    <h3 className="exercise-name">{exercise.name}</h3>
                                    <div className="exercise-tags">
                                        <span className="exercise-type">{exercise.type}</span>
                                        <span className="muscle-group">
                                            {exercise.primaryMuscleGroup}
                                        </span>
                                    </div>
                                </div>

                                {exercise.imageUrl && (
                                    <div className="exercise-image">
                                        <img src={exercise.imageUrl} alt={exercise.name} />
                                    </div>
                                )}

                                {exercise.description && (
                                    <p className="exercise-description">{exercise.description}</p>
                                )}

                                {exercise.instructions && (
                                    <div className="exercise-instructions">
                                        <h4>Instructions</h4>
                                        <p>{exercise.instructions}</p>
                                    </div>
                                )}

                                {exercise.videoUrl && (
                                    <a
                                        href={exercise.videoUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="video-link"
                                    >
                                        Watch Video
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="pagination">
                            <button
                                className="pagination-btn prev"
                                disabled={page === 1}
                                onClick={() => handlePageChange(page - 1)}
                            >
                                Previous
                            </button>
                            <span className="pagination-info">
                                Page {page} of {totalPages}
                            </span>
                            <button
                                className="pagination-btn next"
                                disabled={page === totalPages}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default ExercisesPage;
