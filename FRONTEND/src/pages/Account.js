import React, { useContext, useState } from 'react';
import { AuthContext } from '../AuthContext';
import './Auth.css';

const Account = () => {
  const { user, logout, deleteAccount, updateProfile, loading, error } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [permanent, setPermanent] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [localError, setLocalError] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLocalError('');

    try {
      await updateProfile(name, phone, address);
      setIsEditing(false);
    } catch (err) {
      setLocalError(err.message);
    }
  };

  const handleDeleteAccount = async () => {
    setLocalError('');

    try {
      await deleteAccount(permanent);
      // Redirect to home or login after deletion
    } catch (err) {
      setLocalError(err.message);
    }
  };

  if (!user) {
    return <div className="container"><p>Please login first</p></div>;
  }

  return (
    <div className="container account-container">
      <div className="account-card">
        <h2>My Account</h2>

        {(error || localError) && (
          <div className="error-message">{error || localError}</div>
        )}

        {!isEditing ? (
          <div className="account-info">
            <div className="info-row">
              <span className="label">Name:</span>
              <span className="value">{user.name}</span>
            </div>
            <div className="info-row">
              <span className="label">Email:</span>
              <span className="value">{user.email}</span>
            </div>
            {user.phone && (
              <div className="info-row">
                <span className="label">Phone:</span>
                <span className="value">{user.phone}</span>
              </div>
            )}
            {user.address && (
              <div className="info-row">
                <span className="label">Address:</span>
                <span className="value">{user.address}</span>
              </div>
            )}
            <div className="info-row">
              <span className="label">Member Since:</span>
              <span className="value">{new Date(user.createdAt).toLocaleDateString()}</span>
            </div>

            <div className="button-group">
              <button
                className="btn-primary"
                onClick={() => setIsEditing(true)}
                disabled={loading}
              >
                Edit Profile
              </button>
              <button
                className="btn-danger"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </button>
              <button
                className="btn-secondary"
                onClick={logout}
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleUpdateProfile}>
            <div className="form-group">
              <label>Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Address:</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                disabled={loading}
              />
            </div>
            <div className="button-group">
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsEditing(false)}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Delete Account</h3>
            <p>Are you sure you want to delete your account?</p>

            <div className="form-group">
              <label>
                <input
                  type="checkbox"
                  checked={permanent}
                  onChange={(e) => setPermanent(e.target.checked)}
                />
                Permanently delete all data (cannot be recovered)
              </label>
            </div>

            {localError && <div className="error-message">{localError}</div>}

            <div className="button-group">
              <button
                className="btn-danger"
                onClick={handleDeleteAccount}
                disabled={loading}
              >
                {loading ? 'Deleting...' : 'Delete Account'}
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  setShowDeleteModal(false);
                  setPermanent(false);
                }}
                disabled={loading}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Account;
