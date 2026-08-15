import { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import MainLayout from '../layouts/MainLayout';
import { ProfileLayout } from '../layouts/profile-layout';
import MainPage from '@pages/main-page/MainPage';
import SkillPage from '@pages/skill-page/SkillPage';
import ProfilePage from '@pages/profile/ProfilePage';
import FavoritesPage from '@pages/favorites/FavoritesPage';
import { ErrorPage404 } from '@pages/error404/ErrorPage404';
import { ErrorPage500 } from '@pages/error500/ErrorPage500';
import { RequireAuth } from './RequireAuth';
import { AuthLayout } from '../layouts/AuthLayout';
import { LoginPage } from '@pages/auth/login/LoginPage';
import { RegisterStep1Page } from '@pages/auth/register/register-step-1/RegisterStep1Page';
import { RegisterStep2Page } from '@pages/auth/register/register-step-2/RegisterStepPage2';
import { RegisterStep3Page } from '@pages/auth/register/register-step-3/RegisterStep3Page';

const StyleGuidePage = lazy(() =>
  import('@pages/styleguide/StyleGuidePage').then((m) => ({ default: m.StyleGuidePage })),
);

export default function AppRouter() {
  return (
    <Routes>
      {/* Style Guide: только в dev, в проде редирект на /; динамический импорт — не в прод-бандле */}
      <Route
        path="/__ui"
        element={
          <Suspense fallback={null}>
            <StyleGuidePage />
          </Suspense>
        }
      />
      <Route
        path="/styleguide"
        element={
          <Suspense fallback={null}>
            <StyleGuidePage />
          </Suspense>
        }
      />

      {/* Auth-ветка без Header/Footer */}
      <Route path="/auth" element={<AuthLayout />}>
        {/* если зашли на /auth */}
        <Route index element={<Navigate to="/auth/login" replace />} />

        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<Navigate to="/auth/register/step-1" replace />} />
        <Route path="register/step-1" element={<RegisterStep1Page />} />
        <Route path="register/step-2" element={<RegisterStep2Page />} />
        <Route path="register/step-3" element={<RegisterStep3Page />} />
      </Route>

      {/* Основная часть с Header/Footer */}
      <Route path="/" element={<MainLayout />}>
        {/* Главная */}
        <Route index element={<MainPage />} />

        {/* Основные страницы */}
        <Route path="skill/:id" element={<SkillPage />} />
        <Route
          path="profile"
          element={
            <RequireAuth>
              <ProfileLayout />
            </RequireAuth>
          }
        >
          <Route index element={<ProfilePage />} />
          <Route path="favorites" element={<FavoritesPage />} />
        </Route>

        {/* Страницы ошибок */}
        <Route path="404" element={<ErrorPage404 />} />
        <Route path="500" element={<ErrorPage500 />} />

        {/* Неизвестные URL */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Route>
    </Routes>
  );
}
