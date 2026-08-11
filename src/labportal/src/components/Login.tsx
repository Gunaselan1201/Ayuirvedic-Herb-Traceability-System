import React, { useState } from 'react';

export default function Login({ onLogin }: { onLogin: (labId: string) => void }) {
  const [manufacturerId, setManufacturerId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!manufacturerId.trim()) {
      setError('Lab ID is required');
      return;
    }
    if (!password) {
      setError('Password is required');
      return;
    }
    // For Lab Portal, accept any Lab ID
    onLogin(manufacturerId);
  }

  return (
    <div className="mx-auto max-w-md">
      <form onSubmit={handleSubmit} className="space-y-4 border rounded-lg p-6 shadow-sm" noValidate>
        <div>
          <label htmlFor="manufacturerId" className="block text-sm font-medium text-gray-700">Lab ID</label>
          <input
            id="manufacturerId"
            name="manufacturerId"
            value={manufacturerId}
            onChange={(e) => setManufacturerId(e.target.value.toUpperCase())}
            className="mt-1 block w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue border-gray-400 rounded"
            placeholder="LAB001"
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
            className="mt-1 block w-full px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-blue border-gray-400 rounded"
            autoComplete="current-password"
          />
        </div>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <button
          type="submit"
          className="w-full rounded text-white px-4 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue bg-gradient-to-r from-[#76b852] to-[#8dc26f] hover:from-[#5e9c45] hover:to-[#79b85b]"
        >
          Login
        </button>
      </form>
    </div>
  );
}


