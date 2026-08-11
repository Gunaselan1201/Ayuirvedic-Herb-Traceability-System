// src/components/Login.tsx
import React, { useState } from 'react';
import { MANUFACTURERS } from '../data/mock';

const Login: React.FC = () => {
  const [manufacturerId, setManufacturerId] = useState<string>('');

  const handleLogin = () => {
    const id = Number(manufacturerId); // convert string to number
    if (!MANUFACTURERS[id]) {
      console.error("Invalid manufacturerId");
      return;
    }

    console.log(`Logged in as: ${MANUFACTURERS[id]}`);
    // Proceed with login logic
  };

  return (
    <div>
      <h1>Manufacturer Login</h1>
      <input
        type="text"
        value={manufacturerId}
        onChange={(e) => setManufacturerId(e.target.value)}
        placeholder="Enter manufacturer ID (0, 1, 2)"
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
};

export default Login;

