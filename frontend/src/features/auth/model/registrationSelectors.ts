import type { RootState } from '@app/store/store';

export const selectRegistrationStep1 = (s: RootState) => s.registration.step1;
export const selectRegistrationStep2 = (s: RootState) => s.registration.step2;
export const selectRegistrationStep3 = (s: RootState) => s.registration.step3;
