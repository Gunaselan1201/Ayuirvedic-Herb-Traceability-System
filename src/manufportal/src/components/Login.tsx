import React, { useState } from 'react';
import { MANUFACTURERS } from '../data/mock';

export default function Login({ onLogin }: { onLogin: (manufacturerId: string) => void }) {
  const [manufacturerId, setManufacturerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!manufacturerId.trim()) {
      setError('Manufacturer ID is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    if (!MANUFACTURERS[manufacturerId]) {
      setError('Unknown Manufacturer ID');
      return;
    }
    onLogin(manufacturerId);
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="text-2xl font-semibold mb-6">Login</h1>
      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="manufacturerId" className="block text-sm font-medium text-gray-700">Manufacturer ID</label>
          <input
            id="manufacturerId"
            name="manufacturerId"
            value={manufacturerId}
            onChange={(e) => setManufacturerId(e.target.value.toUpperCase())}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            placeholder="MFG001"
            autoComplete="username"
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1 block w-full rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue"
            autoComplete="current-password"
          />
        </div>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          className="w-full rounded bg-gradient-to-r from-brand-green to-brand-blue text-white px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}


