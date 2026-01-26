import { X } from 'lucide-react';
import styles from './AddApplicationModal.module.scss';
import modalStyles from '../Common/Modal.module.scss';
import { useAddApplication } from '../../hooks/useAddApplication';

interface AddApplicationModalProps {
  onClose: () => void;
}

export function AddApplicationModal({ onClose }: AddApplicationModalProps) {
  const { formData, updateField, handleSubmit } = useAddApplication();

  const onSubmit = (e: React.FormEvent) => {
    handleSubmit(e, onClose);
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

        <form onSubmit={onSubmit} className={styles.addApplicationModal__form}>
          <div className={styles.addApplicationModal__field}>
            <label className={styles.addApplicationModal__label}>
              Company Name *
            </label>
            <input
              type="text"
              required
              value={formData.company}
              onChange={(e) => updateField('company', e.target.value)}
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
              onChange={(e) => updateField('role', e.target.value)}
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
              onChange={(e) => updateField('location', e.target.value)}
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
              onChange={(e) => updateField('dateApplied', e.target.value)}
              className={styles.addApplicationModal__input}
            />
          </div>

          <div className={styles.addApplicationModal__field}>
            <label className={styles.addApplicationModal__label}>
              Status
            </label>
            <select
              value={formData.result}
              onChange={(e) => updateField('result', e.target.value)}
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

