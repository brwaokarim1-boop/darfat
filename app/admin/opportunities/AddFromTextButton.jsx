'use client';
import { useState } from 'react';
import { FileText, Plus, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function AddFromTextButton() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleExtract = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const res = await fetch('/api/admin/opportunities/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await res.json();
      if (data.success) {
        alert(`Successfully extracted ${data.count} opportunity(ies). They are saved as drafts.`);
        setOpen(false);
        setText('');
        router.refresh();
      } else {
        alert('Error: ' + data.error);
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
    setLoading(false);
  };

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium"
      >
        <Plus className="w-4 h-4" />
        زیادکردن لە دەقەوە
      </button>

      {open && (
        <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl shadow-xl">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <FileText className="w-5 h-5 text-orange-500" />
                دەق لێرە دابنێ بۆ دەرهێنانی دەرفەت بە AI
              </h2>
              <button onClick={() => setOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <textarea 
              className="w-full h-64 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:border-orange-500 mb-4 bg-slate-50"
              placeholder="دەقی ئیمەیڵ، پۆست، یان لاپەڕەیەک لێرە دابنێ..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={loading}
              dir="auto"
            />

            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setOpen(false)}
                className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg text-sm font-medium"
                disabled={loading}
              >
                پاشگەزبوونەوە
              </button>
              <button 
                onClick={handleExtract}
                disabled={loading || !text.trim()}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg text-sm font-medium hover:bg-orange-600 disabled:opacity-50 flex items-center gap-2"
              >
                {loading ? 'لە کارکردندایە...' : 'دەرهێنان'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
