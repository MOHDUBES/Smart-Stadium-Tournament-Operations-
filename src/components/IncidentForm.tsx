import React, { useState } from 'react';
import { useAppStore } from '../store/useStore';
import { translations } from '../data/translations';
import { AlertTriangle } from 'lucide-react';
import { sanitizeInput } from '../utils/sanitize';

interface Props {
  onClose: () => void;
}

const IncidentForm: React.FC<Props> = ({ onClose }) => {
  const { language, addIncident } = useAppStore();
  const t = translations[language];

  const [title, setTitle] = useState('');
  const [type, setType] = useState('medical');
  const [desc, setDesc] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = sanitizeInput(title);
    if (cleanTitle.trim()) {
      addIncident(cleanTitle, type); // Assuming type is from select, safe. desc not currently stored in mock, but could be sanitized too.
      onClose();
    }
  };

  return (
    <div className="glass-panel p-6 border-t-4 border-t-red-500">
      <div className="flex items-center gap-2 mb-4 text-red-500">
        <AlertTriangle size={24} />
        <h3 className="text-xl font-semibold text-brand-text">{t.reportIncident}</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label
            htmlFor="incident-title"
            className="block text-sm font-medium text-brand-text/70 mb-1"
          >
            {t.incidentTitle}
          </label>
          <input
            id="incident-title"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full bg-black/40 border border-brand-text/10 rounded-xl p-3 text-brand-text focus:outline-none focus:border-red-500"
            placeholder="e.g. Spilled drink at Gate 2"
          />
        </div>

        <div>
          <label
            htmlFor="incident-type"
            className="block text-sm font-medium text-brand-text/70 mb-1"
          >
            {t.incidentType}
          </label>
          <select
            id="incident-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full bg-black/40 border border-brand-text/10 rounded-xl p-3 text-brand-text focus:outline-none focus:border-red-500"
          >
            <option value="medical">Medical</option>
            <option value="security">Security</option>
            <option value="maintenance">Maintenance</option>
            <option value="crowd">Crowd Control</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="incident-desc"
            className="block text-sm font-medium text-brand-text/70 mb-1"
          >
            {t.incidentDesc}
          </label>
          <textarea
            id="incident-desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            className="w-full bg-black/40 border border-brand-text/10 rounded-xl p-3 text-brand-text focus:outline-none focus:border-red-500 min-h-[80px]"
          />
        </div>

        <div className="flex justify-end gap-3 mt-2">
          <button
            type="button"
            onClick={onClose}
            className="btn btn-glass px-4 py-2"
            aria-label={t.cancel}
          >
            {t.cancel}
          </button>
          <button
            type="submit"
            className="btn bg-red-600 text-white hover:bg-red-700 px-6 py-2"
            aria-label={t.submit}
          >
            {t.submit}
          </button>
        </div>
      </form>
    </div>
  );
};

export default IncidentForm;
