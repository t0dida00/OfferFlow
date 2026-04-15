import { X } from 'lucide-react';
import { useState } from 'react';
import styles from './AddApplicationModal.module.scss';
import modalStyles from '../../components/Modal.module.scss';

interface AddApplicationModalProps {
  onClose: () => void;
}

export function AddApplicationModal({ onClose }: AddApplicationModalProps) {
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    location: '',
    dateApplied: new Date().toISOString().split('T')[0],
    result: 'Applied',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production with Supabase, this would save to database
    console.log('Adding application:', formData);
    onClose();
  };

  return (
    <div className={modalStyles['modal__overlay']} onClick={onClose}>
      <div className={styles.addApplicationModal__dialog} onClick={(e) => e.stopPropagation()}>
        <div className={styles.addApplicationModal__header}>
          <h2 className={styles.addApplicationModal__title}>Add New Application</h2>
          <button
            onClick={onClose}
            className={styles.addApplicationModal__closeButton}
            type="button"
            aria-label="Close modal"
          >
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.addApplicationModal__form}>
          <div className={styles.addApplicationModal__field}>
            <label className={styles.addApplicationModal__label}>
              Company Name *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              className={styles.addApplicationModal__input}
              placeholder="e.g., Google"
            />
          </div>

          <div className={styles.addApplicationModal__field}>
            <label className={styles.addApplicationModal__label}>
              Role *
            </label>
            <input
              type="text"
              required
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className={styles.addApplicationModal__input}
              placeholder="e.g., Senior Software Engineer"
            />
          </div>

          <div className={styles.addApplicationModal__field}>
            <label className={styles.addApplicationModal__label}>
              Location *
            </label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className={styles.addApplicationModal__input}
              placeholder="e.g., San Francisco, CA"
            />
          </div>

          <div className={styles.addApplicationModal__field}>
            <label className={styles.addApplicationModal__label}>
              Date Applied *
            </label>
            <input
              type="date"
              required
              value={formData.dateApplied}
              onChange={(e) => setFormData({ ...formData, dateApplied: e.target.value })}
              className={styles.addApplicationModal__input}
            />
          </div>

          <div className={styles.addApplicationModal__field}>
            <label className={styles.addApplicationModal__label}>
              Status
            </label>
            <select
              value={formData.result}
              onChange={(e) => setFormData({ ...formData, result: e.target.value })}
              className={styles.addApplicationModal__select}
            >
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className={styles.addApplicationModal__footer}>
            <button
              type="button"
              onClick={onClose}
              className={styles.addApplicationModal__cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.addApplicationModal__submitButton}
            >
              Add Application
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}