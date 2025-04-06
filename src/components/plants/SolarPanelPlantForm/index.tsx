import React, { useState, useEffect } from 'react';
import styles from './SolarPlantForm.module.css';
import { PlantFormProps } from '@/types';

const SolarPlantForm = ({ solarPlant, onSubmit, onCancel }: PlantFormProps) => {
  const [name, setName] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (solarPlant) {
      setName(solarPlant.name);
    }
  }, [solarPlant]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      setError('Plant name is required');
      return;
    }

    onSubmit({ name });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.formGroup}>
      <label htmlFor="name" className={styles.label}>
        {solarPlant ? 'Entry' : 'New Entry'}
      </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            if (error) setError('');
          }}
          className={styles.input}
          placeholder="Name"
        />
        {error && <div className={styles.errorMessage}>{error}</div>}
      </div>

      {solarPlant && (
        <div className={styles.formGroup}>
          <label htmlFor="id" className={styles.label}>
            Solar Panel Plant ID
          </label>
          <input
            type="text"
            id="id"
            value={solarPlant.id}
            disabled
            className={styles.input}
          />
        </div>
      )}

      <div className={styles.formActions}>
        <button
          type="button"
          className={styles.cancelButton}
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className={styles.submitButton}>
          {solarPlant ? 'Update Plant' : 'Add Plant'}
        </button>
      </div>
    </form>
  );
};

export default SolarPlantForm;
