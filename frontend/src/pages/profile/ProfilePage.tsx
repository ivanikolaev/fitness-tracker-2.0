import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
    useGetUserProfileQuery,
    useUpdateUserProfileMutation,
    useChangePasswordMutation,
} from '../../api/userApiSlice';
import './ProfilePage.css';

// Define validation schemas
const profileSchema = z.object({
    firstName: z
        .string()
        .min(2, 'First name must be at least 2 characters')
        .max(100, 'First name must be at most 100 characters'),
    lastName: z
        .string()
        .min(2, 'Last name must be at least 2 characters')
        .max(100, 'Last name must be at most 100 characters'),
    email: z.string().email('Invalid email address'),
    profilePicture: z.string().optional(),
    height: z.number().positive('Height must be a positive number').optional(),
    weight: z.number().positive('Weight must be a positive number').optional(),
    dateOfBirth: z.string().optional(),
});

const passwordSchema = z
    .object({
        currentPassword: z.string().min(6, 'Current password must be at least 6 characters'),
        newPassword: z.string().min(6, 'New password must be at least 6 characters'),
        confirmPassword: z.string().min(6, 'Confirm password must be at least 6 characters'),
    })
    .refine(data => data.newPassword === data.confirmPassword, {
        message: 'Passwords do not match',
        path: ['confirmPassword'],
    });

type ProfileFormData = z.infer<typeof profileSchema>;
type PasswordFormData = z.infer<typeof passwordSchema>;

const ProfilePage = () => {
    const { user } = useSelector((state: RootState) => state.auth);
    const [activeTab, setActiveTab] = useState<'profile' | 'security'>('profile');
    const [profileUpdateSuccess, setProfileUpdateSuccess] = useState(false);
    const [passwordUpdateSuccess, setPasswordUpdateSuccess] = useState(false);

    // Fetch user profile
    const { data: profileData, isLoading: isLoadingProfile } = useGetUserProfileQuery();

    // Mutations
    const [updateProfile, { isLoading: isUpdatingProfile }] = useUpdateUserProfileMutation();
    const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

    // Profile form setup
    const {
        control: profileControl,
        handleSubmit: handleProfileSubmit,
        formState: { errors: profileErrors },
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: {
            firstName: user?.firstName || '',
            lastName: user?.lastName || '',
            email: user?.email || '',
            profilePicture: user?.profilePicture || '',
            height: user?.height || undefined,
            weight: user?.weight || undefined,
            dateOfBirth: user?.dateOfBirth
                ? new Date(user.dateOfBirth).toISOString().split('T')[0]
                : '',
        },
    });

    // Password form setup
    const {
        control: passwordControl,
        handleSubmit: handlePasswordSubmit,
        formState: { errors: passwordErrors },
        reset: resetPasswordForm,
    } = useForm<PasswordFormData>({
        resolver: zodResolver(passwordSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    // Handle profile update
    const onProfileSubmit = async (data: ProfileFormData) => {
        try {
            await updateProfile(data).unwrap();
            setProfileUpdateSuccess(true);
            setTimeout(() => setProfileUpdateSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to update profile:', err);
        }
    };

    // Handle password change
    const onPasswordSubmit = async (data: PasswordFormData) => {
        try {
            await changePassword(data).unwrap();
            setPasswordUpdateSuccess(true);
            resetPasswordForm();
            setTimeout(() => setPasswordUpdateSuccess(false), 3000);
        } catch (err) {
            console.error('Failed to change password:', err);
        }
    };

    if (isLoadingProfile) {
        return <div className="loading-state">Loading profile...</div>;
    }

    return (
        <div className="profile-page">
            <header className="profile-header">
                <h1>Your Profile</h1>
            </header>

            <div className="profile-tabs">
                <button
                    className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
                    onClick={() => setActiveTab('profile')}
                >
                    Profile Information
                </button>
                <button
                    className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
                    onClick={() => setActiveTab('security')}
                >
                    Security
                </button>
            </div>

            <div className="tab-content">
                {activeTab === 'profile' && (
                    <div className="profile-form-section">
                        <form
                            onSubmit={handleProfileSubmit(onProfileSubmit)}
                            className="profile-form"
                        >
                            <div className="form-grid">
                                <div className="form-group">
                                    <label htmlFor="firstName">First Name</label>
                                    <Controller
                                        name="firstName"
                                        control={profileControl}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                id="firstName"
                                                type="text"
                                                className={profileErrors.firstName ? 'error' : ''}
                                            />
                                        )}
                                    />
                                    {profileErrors.firstName && (
                                        <p className="error-message">
                                            {profileErrors.firstName.message}
                                        </p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="lastName">Last Name</label>
                                    <Controller
                                        name="lastName"
                                        control={profileControl}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                id="lastName"
                                                type="text"
                                                className={profileErrors.lastName ? 'error' : ''}
                                            />
                                        )}
                                    />
                                    {profileErrors.lastName && (
                                        <p className="error-message">
                                            {profileErrors.lastName.message}
                                        </p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email">Email</label>
                                    <Controller
                                        name="email"
                                        control={profileControl}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                id="email"
                                                type="email"
                                                className={profileErrors.email ? 'error' : ''}
                                            />
                                        )}
                                    />
                                    {profileErrors.email && (
                                        <p className="error-message">
                                            {profileErrors.email.message}
                                        </p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="profilePicture">
                                        Profile Picture URL (Optional)
                                    </label>
                                    <Controller
                                        name="profilePicture"
                                        control={profileControl}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                id="profilePicture"
                                                type="text"
                                                placeholder="https://example.com/profile.jpg"
                                            />
                                        )}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="height">Height (cm, Optional)</label>
                                    <Controller
                                        name="height"
                                        control={profileControl}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                id="height"
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                placeholder="175"
                                                onChange={e =>
                                                    field.onChange(
                                                        e.target.value
                                                            ? parseFloat(e.target.value)
                                                            : undefined
                                                    )
                                                }
                                                className={profileErrors.height ? 'error' : ''}
                                            />
                                        )}
                                    />
                                    {profileErrors.height && (
                                        <p className="error-message">
                                            {profileErrors.height.message}
                                        </p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="weight">Weight (kg, Optional)</label>
                                    <Controller
                                        name="weight"
                                        control={profileControl}
                                        render={({ field }) => (
                                            <input
                                                {...field}
                                                id="weight"
                                                type="number"
                                                step="0.1"
                                                min="0"
                                                placeholder="70"
                                                onChange={e =>
                                                    field.onChange(
                                                        e.target.value
                                                            ? parseFloat(e.target.value)
                                                            : undefined
                                                    )
                                                }
                                                className={profileErrors.weight ? 'error' : ''}
                                            />
                                        )}
                                    />
                                    {profileErrors.weight && (
                                        <p className="error-message">
                                            {profileErrors.weight.message}
                                        </p>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="dateOfBirth">Date of Birth (Optional)</label>
                                    <Controller
                                        name="dateOfBirth"
                                        control={profileControl}
                                        render={({ field }) => (
                                            <input {...field} id="dateOfBirth" type="date" />
                                        )}
                                    />
                                </div>
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={isUpdatingProfile}
                                >
                                    {isUpdatingProfile ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>

                            {profileUpdateSuccess && (
                                <div className="success-message">Profile updated successfully!</div>
                            )}
                        </form>
                    </div>
                )}

                {activeTab === 'security' && (
                    <div className="security-form-section">
                        <form
                            onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                            className="password-form"
                        >
                            <div className="form-group">
                                <label htmlFor="currentPassword">Current Password</label>
                                <Controller
                                    name="currentPassword"
                                    control={passwordControl}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            id="currentPassword"
                                            type="password"
                                            className={
                                                passwordErrors.currentPassword ? 'error' : ''
                                            }
                                        />
                                    )}
                                />
                                {passwordErrors.currentPassword && (
                                    <p className="error-message">
                                        {passwordErrors.currentPassword.message}
                                    </p>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="newPassword">New Password</label>
                                <Controller
                                    name="newPassword"
                                    control={passwordControl}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            id="newPassword"
                                            type="password"
                                            className={passwordErrors.newPassword ? 'error' : ''}
                                        />
                                    )}
                                />
                                {passwordErrors.newPassword && (
                                    <p className="error-message">
                                        {passwordErrors.newPassword.message}
                                    </p>
                                )}
                            </div>

                            <div className="form-group">
                                <label htmlFor="confirmPassword">Confirm New Password</label>
                                <Controller
                                    name="confirmPassword"
                                    control={passwordControl}
                                    render={({ field }) => (
                                        <input
                                            {...field}
                                            id="confirmPassword"
                                            type="password"
                                            className={
                                                passwordErrors.confirmPassword ? 'error' : ''
                                            }
                                        />
                                    )}
                                />
                                {passwordErrors.confirmPassword && (
                                    <p className="error-message">
                                        {passwordErrors.confirmPassword.message}
                                    </p>
                                )}
                            </div>

                            <div className="form-actions">
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={isChangingPassword}
                                >
                                    {isChangingPassword ? 'Changing...' : 'Change Password'}
                                </button>
                            </div>

                            {passwordUpdateSuccess && (
                                <div className="success-message">
                                    Password changed successfully!
                                </div>
                            )}
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProfilePage;
