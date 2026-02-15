'use client';

import { useState } from 'react';
import { format } from 'date-fns';

interface EntryModalProps {
  type: string;
  onClose: () => void;
  onSave: (data: any) => void;
}

export default function EntryModal({ type, onClose, onSave }: EntryModalProps) {
  const [formData, setFormData] = useState<any>({
    date: format(new Date(), 'yyyy-MM-dd'),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave(formData);
  }

  function renderFormFields() {
    switch (type) {
      case 'bailey_walks':
        return (
          <>
            <input
              type="number"
              placeholder="Duration (minutes)"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFormData({ ...formData, duration_minutes: parseInt(e.target.value) })}
            />
            <input
              type="number"
              step="0.1"
              placeholder="Distance (miles)"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFormData({ ...formData, distance_miles: parseFloat(e.target.value) })}
            />
            <textarea
              placeholder="Notes"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              rows={3}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </>
        );

      case 'meals':
        return (
          <>
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFormData({ ...formData, meal_type: e.target.value })}
            >
              <option value="">Select meal type</option>
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snack">Snack</option>
            </select>
            <input
              type="text"
              placeholder="What did you eat?"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
            <input
              type="text"
              placeholder="Location"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <input
              type="number"
              placeholder="Calories (optional)"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFormData({ ...formData, calories: parseInt(e.target.value) })}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Health Rating (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                className="w-full"
                onChange={(e) => setFormData({ ...formData, health_rating: parseInt(e.target.value) })}
              />
            </div>
          </>
        );

      case 'wins':
        return (
          <>
            <input
              type="text"
              placeholder="What did you accomplish?"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Details (optional)"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              rows={3}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <select
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="">Select category</option>
              <option value="work">Work</option>
              <option value="personal">Personal</option>
              <option value="health">Health</option>
              <option value="creative">Creative</option>
              <option value="social">Social</option>
            </select>
            <div>
              <label className="block text-sm font-medium mb-2">Impact Rating (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                className="w-full"
                onChange={(e) => setFormData({ ...formData, impact_rating: parseInt(e.target.value) })}
              />
            </div>
          </>
        );

      case 'challenges':
        return (
          <>
            <input
              type="text"
              placeholder="What's the challenge?"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
            <textarea
              placeholder="Details"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              rows={3}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div>
              <label className="block text-sm font-medium mb-2">Severity (1-5)</label>
              <input
                type="range"
                min="1"
                max="5"
                className="w-full"
                onChange={(e) => setFormData({ ...formData, severity: parseInt(e.target.value) })}
              />
            </div>
          </>
        );

      case 'mood_entries':
        return (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Mood Score (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                className="w-full"
                onChange={(e) => setFormData({ ...formData, mood_score: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Energy Level (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                className="w-full"
                onChange={(e) => setFormData({ ...formData, energy_level: parseInt(e.target.value) })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Stress Level (1-10)</label>
              <input
                type="range"
                min="1"
                max="10"
                className="w-full"
                onChange={(e) => setFormData({ ...formData, stress_level: parseInt(e.target.value) })}
              />
            </div>
            <textarea
              placeholder="Notes (optional)"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              rows={3}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </>
        );

      case 'work_hours':
        return (
          <>
            <input
              type="number"
              step="0.5"
              placeholder="Hours worked"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFormData({ ...formData, hours: parseFloat(e.target.value) })}
              required
            />
            <input
              type="text"
              placeholder="Project name"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              onChange={(e) => setFormData({ ...formData, project: e.target.value })}
            />
            <textarea
              placeholder="What did you work on?"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
              rows={3}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                defaultChecked
                onChange={(e) => setFormData({ ...formData, billable: e.target.checked })}
              />
              <span>Billable</span>
            </label>
          </>
        );

      default:
        return null;
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-2xl font-bold">Add {type.replace('_', ' ')}</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">
            ✕
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="date"
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500"
            required
          />
          {renderFormFields()}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-medium transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
