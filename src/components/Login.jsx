import React from 'react';

const Login = ({handleLogin, setUsername, setPassword, isLoggedIn}) => {
    return (
        <div>
          {!isLoggedIn ? (
            <div>
              <h2>Login</h2>
              <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                <button onClick={handleLogin}>Login</button>
              </div>
              {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
          ) : (
            <div>
              <h2>Welcome, {username}!</h2>
            </div>
          )}
        </div>
      );
    }

export default Login;
