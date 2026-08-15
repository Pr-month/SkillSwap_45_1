# Style Guide — правила и конвенции проекта

Единый базовый стайл-гайд для одинаковых компонентов (отступы, типографика, состояния) и постепенного сокращения хардкода без массовых переделок.

---

## 1. Структура UI-слоёв

| Слой          | Путь             | Назначение                                                                             |
| ------------- | ---------------- | -------------------------------------------------------------------------------------- |
| **shared/ui** | `src/shared/ui/` | Переиспользуемые UI-компоненты без бизнес-логики: Button, Input, Modal, Popover и т.д. |
| **widgets**   | `src/widgets/`   | Сборные блоки из shared/ui и features: Header, Footer, модалки с контентом.            |
| **features**  | `src/features/`  | Логика и UI одной фичи (например, избранное, авторизация).                             |
| **entities**  | `src/entities/`  | Сущности предметной области (пользователь, навык, обмен).                              |
| **pages**     | `src/pages/`     | Страницы приложения: собирают widgets и features, роутятся в `app/router`.             |

**Что где хранить:**

- Новая кнопка/инпут/модалка → `shared/ui`.
- Новый блок шапки/футера/карточки страницы → `widgets`.
- Новый экран по роуту → `pages`, роут в `router.tsx`.

---

## 2. CSS-правила

### 2.1 Библиотека `clsx`

Используйте `clsx` для условных и множественных классов — так код читается лучше и меньше ошибок.

```tsx
import clsx from 'clsx';
import styles from './MyComponent.module.css';

<div className={clsx(styles.box, isActive && styles.active, className)} />;
```

### 2.2 Глобальные стили — только в `globals.css`

- В `src/app/styles/globals.css` — reset, базовые стили body, общие утилиты.
- Подключаются токены: `@import './tokens.css';`
- Не добавляйте глобальные классы «где попало»: только через `globals.css`.

### 2.3 Стили компонентов — только `*.module.css`

- У каждого UI-компонента свой файл: `Button.module.css`, `Input.module.css`.
- Импорт: `import styles from './Component.module.css';`
- Классы через объект: `styles.button`, `styles.primary` — без конфликтов имён между компонентами.

Пример:

```css
/* Button.module.css */
.button {
  font-family: var(--font-family-base);
  border-radius: var(--radius-large);
}
.primary {
  background-color: var(--color-primary);
}
```

---

## 3. Токены (design tokens)

### 3.1 Как использовать

Все общие значения (цвета, шрифты, отступы, радиусы) задаются в `src/app/styles/tokens.css` и подключаются в `globals.css`. В компонентах используйте только переменные:

```css
.myBlock {
  color: var(--color-text);
  padding: var(--space-16);
  border-radius: var(--radius-medium);
  font-size: var(--font-size-sm);
}
```

### 3.2 Если токена нет

1. Добавьте токен в `tokens.css` в подходящую секцию (цвета, типографика, размеры, z-index).
2. Используйте в компоненте через `var(--token-name)`.
3. Не вводите «разовый» хардкод вроде `#508826` или `14px` в `*.module.css` — это усложняет смену темы и единообразие.

Пример добавления токена:

```css
/* в tokens.css, секция «Цвета» */
--color-success: #2e7d32;
```

```css
/* в компоненте */
.status {
  color: var(--color-success);
}
```

---

## 4. Состояния UI

Оформляйте состояния в `*.module.css` компонента, не в глобальных стилях.

| Состояние         | Где делать                                           | Пример                                                                                  |
| ----------------- | ---------------------------------------------------- | --------------------------------------------------------------------------------------- |
| **hover**         | В модуле компонента                                  | `.button:hover:not(:disabled) { background: var(--color-primary-hover); }`              |
| **focus-visible** | В модуле (для кнопок, инпутов, ссылок)               | `.input:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` |
| **disabled**      | В модуле + атрибут `disabled` / `aria-disabled`      | `.disabled { cursor: not-allowed; opacity: 0.7; }` и `disabled` на элементе             |
| **error**         | Отдельный класс (например `.error`) + `aria-invalid` | `.error .input { border-color: var(--color-error); }`                                   |

Общее правило: не переопределять глобальный `:focus` — использовать `:focus-visible`, чтобы не показывать обводку при клике мышью.

---

## 5. Именование

| Что                         | Правило                                           | Пример                                          |
| --------------------------- | ------------------------------------------------- | ----------------------------------------------- |
| Компоненты (файлы, экспорт) | **PascalCase**                                    | `Button.tsx`, `SearchInput.tsx`, `Modal.tsx`    |
| Папки в `shared/ui`         | **camelCase** (или kebab-case для составных имён) | `icon-button`, `search-input`, `Input`, `Modal` |
| CSS-модули                  | Имя компонента + `.module.css`                    | `Button.module.css`, `SearchInput.module.css`   |
| Реэкспорт                   | Через `index.ts` в папке компонента               | `export { Button } from './Button';`            |

Импорт снаружи — из папки (через index):

```ts
import { Button } from '@/shared/ui/Button';
import { SearchInput } from '@/shared/ui/search-input';
```

---

## 6. Страница Style Guide (DEV-only)

- Роуты: **`/__ui`** и **`/styleguide`**.
- Доступна только в dev (`import.meta.env.DEV`). В проде — редирект на `/`.
- На странице: витрина токенов (цвета, типографика) и демо компонентов (Button, IconButton, Input, SearchInput, PasswordInput, RadioGroup, Modal, Popover).
- Файлы: `src/pages/styleguide/StyleGuidePage.tsx` (обёртка с проверкой DEV и редиректом), `StyleGuideContent.tsx` (контент страницы, подгружается через `React.lazy` только в dev — не попадает в прод-бандл), `StyleGuidePage.module.css`; роут в `src/app/router/router.tsx` через динамический импорт (`lazy`) и `Suspense`.

Используйте страницу как эталон: новые компоненты должны визуально и по состояниям совпадать с демо на стайл-гайде.
