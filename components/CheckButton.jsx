'use client';
import { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function CheckButton({ sourceId }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheck = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/sources/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceId })
      });
      await res.json();
      router.refresh();
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <button 
      onClick={handleCheck} 
      disabled={loading}
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-md text-sm font-medium transition-colors disabled:opacity-50"
    >
      <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
      پشکنین
    </button>
  );
}
