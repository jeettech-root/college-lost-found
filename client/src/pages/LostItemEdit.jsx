import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import LostItemForm from '../components/LostItemForm';

export default function LostItemEdit() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const ownerId = item?.ownerId?._id || item?.ownerId;
  const isOwner = Boolean(user?._id && ownerId && ownerId.toString() === user._id.toString());

  useEffect(() => {
    const loadItem = async () => {
      setLoading(true);
      setError('');

      try {
        const { data } = await api.get(`/lost/${id}`);
        setItem(data.item);
      } catch (requestError) {
        setError(requestError.response?.data?.message || 'Unable to load lost item');
      } finally {
        setLoading(false);
      }
    };

    loadItem();
  }, [id]);

  const handleSubmit = async (formData) => {
    setSaving(true);

    try {
      await api.put(`/lost/${id}`, formData);
      navigate(`/lost/${id}`);
    } finally {
      setSaving(false);
    }
  };

  if (!loading && item && !isOwner) {
    return (
      <div className="space-y-4 rounded-[2rem] border border-rose-400/20 bg-rose-500/10 p-6 text-rose-200">
        <p>You can only edit your own lost items.</p>
        <button
          type="button"
          onClick={() => navigate(`/lost/${id}`)}
          className="inline-flex rounded-2xl bg-rose-200 px-4 py-2 font-medium text-rose-950"
        >
          Back to details
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="rounded-[2rem] border border-white/10 bg-white/5 px-6 py-12 text-center text-slate-300 shadow-glow backdrop-blur">
        Loading lost item...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[2rem] border border-rose-400/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-200">
        {error}
      </div>
    );
  }

  return (
    <LostItemForm
      title="Edit lost item"
      subtitle="Update the report details while ownership stays tied to your account."
      submitLabel="Save changes"
      initialValues={item}
      onSubmit={handleSubmit}
      submitting={saving}
    />
  );
}