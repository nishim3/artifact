import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './index.css';

const UserProfile = () => {
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    gender: '',
    location: '',
    interest1: '',
    interest2: '',
    email: '',
    username: '',
    displayName: '',
    avatarUri: ''
  });

  useEffect(() => {
    const storedProfile = JSON.parse(localStorage.getItem('profile'));
    if (storedProfile) {
      setProfile(storedProfile);
    } else {
      // Load JSON from local file
      fetch('/user.json')
        .then(response => response.json())
        .then(data => setProfile(data));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('profile', JSON.stringify(profile));
  }, [profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prevProfile => ({ ...prevProfile, [name]: value }));
  };

  const fetchLocation = () => {
    axios.get('https://ipgeolocation.abstractapi.com/v1/?api_key=2e2755e5ecb84390ab7bd1bbb829a066')
      .then(response => {
        setProfile(prevProfile => ({
          ...prevProfile,
          location: response.data.city
        }));
      })
      .catch(error => console.error('Error fetching location', error));
  };

  const fetchUserInfo = () => {
    axios.get('https://api-staging-0.gotartifact.com/v2/users/me', {
      headers: {
        Authorization: `Bearer YOUR_AUTH_TOKEN`
      }
    })
    .then(response => {
      const { email, username, display_name, avatar_uri } = response.data.profile;
      setProfile(prevProfile => ({
        ...prevProfile,
        email,
        username,
        displayName: display_name,
        avatarUri: avatar_uri
      }));
    })
    .catch(error => console.error('Error fetching user info', error));
  };

  return (
    <div className="container">
      <h1>User Profile</h1>
      <form>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" value={profile.name} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Age</label>
          <input type="number" name="age" value={profile.age} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Gender</label>
          <input type="text" name="gender" value={profile.gender} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Location</label>
          <input type="text" name="location" value={profile.location} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Interest 1</label>
          <input type="text" name="interest1" value={profile.interest1} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Interest 2</label>
          <input type="text" name="interest2" value={profile.interest2} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" value={profile.email} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Username</label>
          <input type="text" name="username" value={profile.username} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Display Name</label>
          <input type="text" name="displayName" value={profile.displayName} onChange={handleChange} />
        </div>
        <div className="form-group">
          <label>Avatar</label>
          {profile.avatarUri && <img src={profile.avatarUri} alt="Avatar" className="avatar" />}
          <input type="text" name="avatarUri" value={profile.avatarUri} onChange={handleChange} />
        </div>
      </form>
      <div className="buttons">
        <button type="button" onClick={fetchLocation}>Fetch Location</button>
        <button type="button" onClick={fetchUserInfo}>Fetch User Info</button>
      </div>
    </div>
  );
};

export default UserProfile;
