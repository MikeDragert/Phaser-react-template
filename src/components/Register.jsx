import React from 'react';

const Register = ({handleRegister, setUsername, setPassword, isRegistered, handleCheckEmail}) => {
    return (
        <div>
          {!isRegistered ? (
            <div>
              <h2>Register</h2>
              <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
              </div>
              <div>
                <label>Email:</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} onBlur={handleCheckEmail} />
                {isEmailChecked && emailExists && <div style={{ color: 'red' }}>Email already exists</div>}
              </div>
              <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div>
                <label>Confirm Password:</label>
                <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
              <div>
                <button onClick={handleRegister}>Register</button>
              </div>
              {error && <div style={{ color: 'red' }}>{error}</div>}
            </div>
          ) : (
            <div>
              <h2>Registration successful!</h2>
            </div>
          )}
        </div>
      );
    }

export default Register;
