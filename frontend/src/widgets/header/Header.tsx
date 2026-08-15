import cls from './Header.module.css';
import { HeaderBase } from '@widgets/header/ui/header-base';
import { HeaderActionsPublic } from '@widgets/header/ui/header-actions-public';
import { HeaderActionsUser } from '@widgets/header/ui/header-actions-user';
import { HeaderCenter } from '@widgets/header/ui/header-center/HeaderCenter';

import { useAppSelector } from '@shared/lib/storeHooks';
import { selectIsAuthenticated } from '@features/auth/model/selectors';

export const Header = () => {
  const isAuth = useAppSelector(selectIsAuthenticated);

  return (
    <header className={cls.header}>
      <div className={cls.container}>
        <div className={cls.baseHeader}>
          <HeaderBase />
        </div>

        <div className={cls.headerCenter}>
          <HeaderCenter />
        </div>

        <div className={cls.actions}>
          {isAuth ? <HeaderActionsUser /> : <HeaderActionsPublic />}
        </div>
      </div>
    </header>
  );
};
