import { Outlet } from 'react-router-dom';
import { ProfileSidebar } from '@widgets/profile-sidebar';
import styles from './ProfileLayout.module.css';

export const ProfileLayout = () => {
  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <ProfileSidebar />
      </aside>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  );
};
