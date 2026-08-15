import { type FC, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { Button } from '@shared/ui/Button';
import { Input } from '@shared/ui/input';
import { PasswordInput } from '@shared/ui/password-input';
import styles from './AuthForm.module.css';

import googleIcon from '@shared/assets/images/auth/login_google.svg';
import appleIcon from '@shared/assets/images/auth/login_apple.svg';

export type AuthFormMode = 'login' | 'register';

export type AuthFormData = {
  email: string;
  password: string;
};

export interface AuthFormProps {
  mode: AuthFormMode;
  onSubmit?: (data: AuthFormData) => void;
  initialValues?: Partial<AuthFormData>;
  className?: string;
  infoText?: string;
  isLoading?: boolean;
  isDisabled?: boolean;
}

export const AuthForm: FC<AuthFormProps> = ({
  mode,
  onSubmit,
  className,
  infoText,
  isLoading = false,
  isDisabled = false,
  initialValues,
}) => {
  const navigate = useNavigate();
  const [showInfoText, setShowInfoText] = useState(false);
  const isLogin = mode === 'login';

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<AuthFormData>({
    mode: 'onChange',
    defaultValues: {
      email: '',
      password: '',
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        email: initialValues.email ?? '',
        password: initialValues.password ?? '',
      });
    }
  }, [initialValues, reset]);

  const isFormDisabled = isLoading || isDisabled;

  const submitHandler = (data: AuthFormData) => {
    if (onSubmit) {
      onSubmit(data);
    }
    setShowInfoText(true);
  };

  return (
    <form
      className={`${styles.authForm} ${className || ''}`}
      onSubmit={handleSubmit(submitHandler)}
    >
      <div className={styles.authFormContent}>
        <div className={styles.informationFromUser}>
          <div className={styles.socialButtons}>
            <Button
              variant="ghost"
              fullWidth
              type="button"
              disabled={isFormDisabled}
              className={styles.socialButton}
            >
              <img src={googleIcon} alt="" className={styles.socialIcon} />
              <span>Продолжить с Google </span>
            </Button>
            <Button
              variant="ghost"
              fullWidth
              type="button"
              disabled={isFormDisabled}
              className={styles.socialButton}
            >
              <img src={appleIcon} alt="" className={styles.socialIcon} />
              <span>Продолжить с Apple </span>
            </Button>
          </div>

          <div className={styles.divider}>
            <span>или</span>
          </div>

          <div className={styles.inputsGroup}>
            <Controller
              name="email"
              control={control}
              rules={{
                required: 'Email обязателен',
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: 'Некорректный email',
                },
              }}
              render={({ field }) => (
                <Input
                  label="Email"
                  placeholder="Введите email"
                  {...field}
                  disabled={isFormDisabled}
                  errorText={errors.email?.message}
                />
              )}
            />

            <Controller
              name="password"
              control={control}
              rules={{
                required: 'Пароль обязателен',
                minLength: {
                  value: 8,
                  message: 'Пароль должен содержать не менее 8 символов',
                },
              }}
              render={({ field }) => (
                <PasswordInput
                  label="Пароль"
                  placeholder={isLogin ? 'Введите ваш пароль' : 'Придумайте надежный пароль'}
                  {...field}
                  disabled={isFormDisabled}
                  errorText={errors.password?.message}
                />
              )}
            />
          </div>
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={!isValid || isFormDisabled}>
          {isLogin ? 'Войти' : 'Далее'}
        </Button>

        {showInfoText && <div className={styles.infoText}>{infoText}</div>}

        {isLogin && (
          <div className={styles.registerLink}>
            <button
              type="button"
              className={styles.linkButton}
              disabled={isFormDisabled}
              onClick={() => navigate('/auth/register/step-1')}
            >
              Зарегистрироваться
            </button>
          </div>
        )}
      </div>
    </form>
  );
};
