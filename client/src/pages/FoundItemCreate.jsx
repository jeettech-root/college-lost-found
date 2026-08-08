import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import FoundItemForm from '../components/FoundItemForm';

export default function FoundItemCreate() {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (formData) => {
    setSaving(true);
    setError('');

    try {
      await api.post('/found', formData);
      navigate('/found');
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Unable to create found item');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      {error ? (
        <div className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
          {error}
        </div>
      ) : null}

      <FoundItemForm
        title="Create found item"
        subtitle="Only authenticated users can create a found item report."
        submitLabel="Create item"
        onSubmit={handleSubmit}
        submitting={saving}
      />
    </div>
  );
}