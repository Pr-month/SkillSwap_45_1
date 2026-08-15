import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import styles from './LoginPage.module.css';
import LoginBoardImage from '@shared/assets/images/auth/registration_lightbulb.svg';
import { ContentSection } from '@shared/ui/content-section/ContentSection';
import { AuthForm } from '@features/auth/ui/auth-form/AuthForm';
import { useAppDispatch, useAppSelector } from '@shared/lib/storeHooks';
import { loginThunk } from '@features/auth/model/authThunks';
import { clearAuthError } from '@features/auth/model';
import {
  selectAuthError,
  selectAuthStatus,
  selectIsAuthenticated,
} from '@features/auth/model/selectors';

export const LoginPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? '/';

  const isAuth = useAppSelector(selectIsAuthenticated);
  const status = useAppSelector(selectAuthStatus);
  const error = useAppSelector(selectAuthError);

  useEffect(() => {
    if (isAuth) {
      navigate(from, { replace: true });
    }
  }, [isAuth, from, navigate]);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  const heroText = (
    <div className={styles.heroContainer}>
      <h2 className={styles.heroTitle}>С возвращением в SkillSwap!</h2>
      <p>Обменивайтесь знаниями и навыками с другими людьми</p>
    </div>
  );

  return (
    <>
      <h2 className={styles.title}>Вход</h2>
      <ContentSection
        main={
          <>
            <AuthForm
              mode="login"
              onSubmit={(data) => dispatch(loginThunk(data))}
              isLoading={status === 'loading'}
              infoText={error ?? ''}
            />
          </>
        }
        heroText={heroText}
        heroImage={<img src={LoginBoardImage} alt="Картинка" />}
      />
    </>
  );
};
