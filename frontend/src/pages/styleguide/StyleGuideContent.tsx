import { useState, useRef } from 'react';
import clsx from 'clsx';
import { Button } from '@shared/ui/Button';
import { IconButton } from '@shared/ui/icon-button';
import { Input } from '@shared/ui/input';
import { SearchInput } from '@shared/ui/search-input';
import { PasswordInput } from '@shared/ui/password-input';
import { RadioGroup } from '@shared/ui/radio-group';
import { Modal } from '@shared/ui/Modal';
import { Popover } from '@shared/ui/Popover';
import styles from './StyleGuidePage.module.css';

/** Контент стайл-гайда. Подгружается только в dev через React.lazy. */
export function StyleGuideContent() {
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [passwordValue, setPasswordValue] = useState('');
  const [radioValue, setRadioValue] = useState('a');
  const [modalOpen, setModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverAnchorRef = useRef<HTMLButtonElement>(null);

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Style Guide (DEV)</h1>
        <p className={styles.subtitle}>
          Витрина токенов и компонентов. Доступна только в dev-режиме.
        </p>
      </header>

      {/* Токен preview */}
      <section className={styles.section} aria-labelledby="tokens-heading">
        <h2 id="tokens-heading" className={styles.sectionTitle}>
          Tokens preview
        </h2>
        <p className={styles.sectionSubtitle}>
          Цвета и типографика из <code>tokens.css</code>
        </p>

        <h3 className={styles.demoBlockTitle}>Цвета</h3>
        <div className={styles.tokensGrid}>
          <div className={styles.colorSwatch}>
            <div className={styles.colorBox} style={{ backgroundColor: 'var(--color-bg)' }} />
            <span className={styles.colorLabel}>--color-bg</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.colorBox} style={{ backgroundColor: 'var(--color-text)' }} />
            <span className={styles.colorLabel}>--color-text</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.colorBox} style={{ backgroundColor: 'var(--color-primary)' }} />
            <span className={styles.colorLabel}>--color-primary</span>
          </div>
          <div className={styles.colorSwatch}>
            <div
              className={styles.colorBox}
              style={{ backgroundColor: 'var(--color-secondary)' }}
            />
            <span className={styles.colorLabel}>--color-secondary</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.colorBox} style={{ backgroundColor: 'var(--color-accent)' }} />
            <span className={styles.colorLabel}>--color-accent</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.colorBox} style={{ backgroundColor: 'var(--color-error)' }} />
            <span className={styles.colorLabel}>--color-error</span>
          </div>
          <div className={styles.colorSwatch}>
            <div className={styles.colorBox} style={{ backgroundColor: 'var(--color-hover)' }} />
            <span className={styles.colorLabel}>--color-hover</span>
          </div>
          <div className={styles.colorSwatch}>
            <div
              className={styles.colorBox}
              style={{ backgroundColor: 'var(--color-disable-button)' }}
            />
            <span className={styles.colorLabel}>--color-disable-button</span>
          </div>
        </div>

        <h3 className={styles.demoBlockTitle}>Типографика</h3>
        <div className={styles.typographyRow}>
          <div className={styles.typographyLabel}>--font-size-h1 (заголовок)</div>
          <div style={{ fontSize: 'var(--font-size-h1)', fontWeight: 'var(--font-weight-bold)' }}>
            Заголовок H1
          </div>
        </div>
        <div className={styles.typographyRow}>
          <div className={styles.typographyLabel}>--font-size-h2</div>
          <div style={{ fontSize: 'var(--font-size-h2)', fontWeight: 'var(--font-weight-medium)' }}>
            Заголовок H2
          </div>
        </div>
        <div className={styles.typographyRow}>
          <div className={styles.typographyLabel}>--font-size-base (body)</div>
          <div style={{ fontSize: 'var(--font-size-base)' }}>
            Основной текст (body). Шрифт: var(--font-family-base).
          </div>
        </div>
        <div className={styles.typographyRow}>
          <div className={styles.typographyLabel}>--font-size-sm</div>
          <div style={{ fontSize: 'var(--font-size-sm)' }}>Мелкий текст (caption)</div>
        </div>
        <div className={styles.typographyRow}>
          <div className={styles.typographyLabel}>--font-size-xs</div>
          <div style={{ fontSize: 'var(--font-size-xs)' }}>Подпись (xs)</div>
        </div>
      </section>

      {/* Buttons */}
      <section className={styles.section} aria-labelledby="buttons-heading">
        <h2 id="buttons-heading" className={styles.sectionTitle}>
          Button
        </h2>
        <div className={styles.demoBlock}>
          <div className={styles.demoBlockTitle}>Варианты</div>
          <div className={styles.demoRow}>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="ghost">Ghost</Button>
          </div>
        </div>
        <div className={styles.demoBlock}>
          <div className={styles.demoBlockTitle}>Disabled / fullWidth</div>
          <div className={styles.demoRow}>
            <Button variant="primary" disabled>
              Disabled
            </Button>
            <Button variant="primary" fullWidth>
              Full width
            </Button>
          </div>
        </div>
      </section>

      {/* IconButton */}
      <section className={styles.section} aria-labelledby="iconbutton-heading">
        <h2 id="iconbutton-heading" className={styles.sectionTitle}>
          IconButton
        </h2>
        <div className={styles.demoRow}>
          <IconButton icon={<span aria-hidden>🔍</span>} aria-label="Поиск" variant="ghost" />
          <IconButton icon={<span aria-hidden>♥</span>} aria-label="Избранное" variant="solid" />
          <IconButton
            icon={<span aria-hidden>♥</span>}
            aria-label="Активная"
            variant="ghost"
            isActive
          />
          <IconButton
            icon={<span aria-hidden>○</span>}
            aria-label="Disabled"
            variant="ghost"
            disabled
          />
        </div>
      </section>

      {/* Inputs */}
      <section className={styles.section} aria-labelledby="inputs-heading">
        <h2 id="inputs-heading" className={styles.sectionTitle}>
          Input / SearchInput / PasswordInput
        </h2>
        <div className={styles.demoStack}>
          <Input
            label="Обычный инпут"
            value={inputValue}
            onChange={setInputValue}
            placeholder="Плейсхолдер"
          />
          <Input
            label="С ошибкой"
            value={inputValue}
            onChange={setInputValue}
            errorText="Обязательное поле"
          />
          <Input label="Disabled" value="Недоступно" onChange={() => {}} disabled />
        </div>
        <div className={clsx(styles.demoStack, styles.demoBlock)}>
          <div className={styles.demoBlockTitle}>SearchInput</div>
          <SearchInput value={searchValue} onChange={setSearchValue} placeholder="Искать..." />
        </div>
        <div className={clsx(styles.demoStack, styles.demoBlock)}>
          <div className={styles.demoBlockTitle}>PasswordInput (default / error / disabled)</div>
          <PasswordInput
            label="Пароль"
            value={passwordValue}
            onChange={setPasswordValue}
            placeholder="Введите пароль"
          />
          <PasswordInput
            label="Пароль с ошибкой"
            value={passwordValue}
            onChange={setPasswordValue}
            placeholder="Пароль"
            errorText="Минимум 6 символов"
          />
          <PasswordInput
            label="Пароль disabled"
            value=""
            onChange={() => {}}
            placeholder="Пароль"
            disabled
          />
        </div>
      </section>

      {/* RadioGroup */}
      <section className={styles.section} aria-labelledby="radio-heading">
        <h2 id="radio-heading" className={styles.sectionTitle}>
          RadioGroup
        </h2>
        <div className={styles.demoStack}>
          <RadioGroup
            name="demo"
            value={radioValue}
            onChange={setRadioValue}
            options={[
              { value: 'a', label: 'Вариант A' },
              { value: 'b', label: 'Вариант B' },
              { value: 'c', label: 'Вариант C' },
            ]}
          />
          <RadioGroup
            name="demo2"
            value="x"
            onChange={() => {}}
            options={[{ value: 'x', label: 'Disabled option' }]}
            disabled
          />
          <RadioGroup
            name="demo3"
            value=""
            onChange={() => {}}
            options={[{ value: 'e', label: 'С ошибкой' }]}
            errorText="Выберите значение"
          />
        </div>
      </section>

      {/* Modal */}
      <section className={styles.section} aria-labelledby="modal-heading">
        <h2 id="modal-heading" className={styles.sectionTitle}>
          Modal
        </h2>
        <div className={styles.demoRow}>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            Открыть модалку
          </Button>
        </div>
        <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <div style={{ padding: 'var(--space-24)', minWidth: 280 }}>
            <h3 style={{ marginTop: 0 }}>Пример модалки</h3>
            <p>Закройте по Escape или клику по оверлею.</p>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Закрыть
            </Button>
          </div>
        </Modal>
      </section>

      {/* Popover */}
      <section className={styles.section} aria-labelledby="popover-heading">
        <h2 id="popover-heading" className={styles.sectionTitle}>
          Popover
        </h2>
        <div className={styles.demoRow}>
          <span ref={popoverAnchorRef}>
            <Button variant="secondary" onClick={() => setPopoverOpen((v) => !v)}>
              {popoverOpen ? 'Закрыть поповер' : 'Открыть поповер'}
            </Button>
          </span>
        </div>
        <Popover
          isOpen={popoverOpen}
          onClose={() => setPopoverOpen(false)}
          anchorRef={popoverAnchorRef}
          placement="bottom-start"
        >
          <div style={{ padding: 'var(--space-16)', minWidth: 200 }}>
            Контент поповера. Закрытие по клику снаружи или Escape.
          </div>
        </Popover>
      </section>
    </div>
  );
}
