import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@shared/lib/storeHooks';
import {
  ProfileEditForm,
  type ProfileEditFormValues,
} from '@features/profile/ui/profile-edit-form';
import { updateProfile } from '@features/profile/model/profileSlice';
import { selectDb } from '@app/store/db/selectors';

const toYYYYMMDD = (d: Date) => {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

const isoToDate = (iso: string | null) => {
  if (!iso) return null;
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, (m ?? 1) - 1, d ?? 1);
};

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const db = useAppSelector(selectDb);

  const profile = useAppSelector((s) => s.profile.profile);
  const avatarSrc = useAppSelector((s) => s.profile.profile.avatarSrc);

  const genderOptions = useMemo(
    () => [
      { value: '', label: 'Не указан' },
      { value: 'm', label: 'Мужской' },
      { value: 'f', label: 'Женский' },
    ],
    [],
  );

  const cityOptions = useMemo(() => {
    if (!db) return [];
    return db.cities.map((c) => ({ value: String(c.id), label: c.name }));
  }, [db]);

  const initialFromStore = useMemo<ProfileEditFormValues>(
    () => ({
      email: profile.email ?? '',
      name: profile.name ?? '',
      birthDate: isoToDate(profile.birthDate),
      gender: profile.gender ?? '',
      city: profile.city ? String(profile.city) : null,
      about: profile.about ?? '',
    }),
    [profile],
  );
  const [values, setValues] = useState<ProfileEditFormValues>(initialFromStore);

  useEffect(() => {
    setValues(initialFromStore);
  }, [initialFromStore]);

  return (
    <div>
      <h1 className="visually-hidden">Личные данные</h1>
      <ProfileEditForm
        values={values}
        onEmailChange={(v) => setValues((prev) => ({ ...prev, email: v }))}
        onNameChange={(v) => setValues((prev) => ({ ...prev, name: v }))}
        onBirthDateChange={(v) => setValues((prev) => ({ ...prev, birthDate: v }))}
        onGenderChange={(v) => setValues((prev) => ({ ...prev, gender: v }))}
        onCityChange={(v) => setValues((prev) => ({ ...prev, city: v }))}
        onAboutChange={(v) => setValues((prev) => ({ ...prev, about: v }))}
        onSave={() => {
          dispatch(
            updateProfile({
              email: values.email,
              name: values.name,
              birthDate: values.birthDate ? toYYYYMMDD(values.birthDate) : null,
              gender: values.gender,
              city: values.city ?? '',
              about: values.about,
              avatarSrc,
            }),
          );
        }}
        onChangePassword={() => {}}
        onAvatarChange={() => {}}
        genderOptions={genderOptions}
        cityOptions={cityOptions}
        avatarSrc={avatarSrc}
      />
    </div>
  );
}
