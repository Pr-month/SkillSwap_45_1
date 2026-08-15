import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from '@widgets/header';
import { Footer } from '@widgets/Footer';
import styles from './MainLayout.module.css';

const MainLayout: React.FC = () => {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles.main}>
        <div className={styles.mainInner}>
          <Outlet /> {/* Здесь подставляется содержимое страниц */}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MainLayout;
