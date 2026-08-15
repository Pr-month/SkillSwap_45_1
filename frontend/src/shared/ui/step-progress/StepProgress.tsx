import React from 'react';
import clsx from 'clsx';
import styles from './StepProgress.module.css';

interface StepProgressProps {
  currentStep: number;
  totalSteps?: number;
  className?: string;
}

export const StepProgress: React.FC<StepProgressProps> = ({
  className,
  currentStep,
  totalSteps = 3,
}) => {
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className={clsx(styles.stepProgress, className)}>
      <h2 className={styles.stepTitle}>
        Шаг {currentStep} из {totalSteps}
      </h2>
      <div className={styles.progressBar}>
        {steps.map((step) => (
          <div
            key={step}
            className={clsx(styles.stepIndicator, {
              [styles.active]: step === currentStep || step < currentStep,
            })}
          />
        ))}
      </div>
    </div>
  );
};
