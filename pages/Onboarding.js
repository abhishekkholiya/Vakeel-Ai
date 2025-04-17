import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/router';
import styles from '../styles/Login.module.css';

const Onboarding = () => {
  const [formData, setFormData] = useState({
    username: '',
    dateOfBirth: '',
    profilePicture: null,
    previewUrl: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();
  const router = useRouter();

  // Redirect if user is not authenticated
  useEffect(() => {
    if (!currentUser) {
      router.push('/SignIn');
      return;
    }
    // Pre-fill email if available
    if (currentUser.email) {
      setFormData(prev => ({ ...prev, email: currentUser.email }));
    }
  }, [currentUser, router]);

  useEffect(() => {
    if (!currentUser) {
      router.push('/SignIn');
    }
  }, [currentUser, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image size should be less than 5MB');
        return;
      }
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setFormData(prev => ({
        ...prev,
        profilePicture: file,
        previewUrl: URL.createObjectURL(file)
      }));
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setError('');
      setLoading(true);

      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.username);
      formDataToSend.append('dateOfBirth', formData.dateOfBirth);
      formDataToSend.append('email', currentUser.email);
      if (formData.profilePicture) {
        formDataToSend.append('profilePicture', formData.profilePicture);
      }

      const response = await fetch('/api/onboarding', {
        method: 'POST',
        body: formDataToSend
      });

      if (!response.ok) {
        throw new Error('Failed to complete onboarding');
      }

      router.push('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.rightSection}>
        <div className={styles.loginCard}>
          <h2 className={styles.subtitle}>Complete Your Profile</h2>
          {error && <div className={styles.error}>{error}</div>}
          <form onSubmit={handleSubmit} className={styles.form}>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleInputChange}
              required
              minLength={3}
              maxLength={30}
              className={styles.input}
            />
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
              className={styles.input}
              max={new Date().toISOString().split('T')[0]}
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className={styles.input}
            />
            {formData.previewUrl && (
              <div className={styles.imagePreviewContainer}>
                <img
                  src={formData.previewUrl}
                  alt="Profile preview"
                  className={styles.imagePreview}
                />
              </div>
            )}
            <div className={styles.buttonContainer}>
              <button
                type="submit"
                disabled={loading}
                className={`${styles.button} ${styles.primaryButton}`}
              >
                {loading ? 'Processing...' : 'Complete Profile'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;