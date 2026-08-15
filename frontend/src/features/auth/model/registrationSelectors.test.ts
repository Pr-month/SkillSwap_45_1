import {
  selectRegistrationStep1,
  selectRegistrationStep2,
  selectRegistrationStep3,
} from './registrationSelectors';
import type { RootState } from '@app/store/store';

describe('registrationSelectors', () => {
  it('select step1', () => {
    const state = {
      registration: { step1: { email: 'a', password: 'b' } },
    } as RootState;

    expect(selectRegistrationStep1(state)).toEqual({ email: 'a', password: 'b' });
  });

  it('select step2', () => {
    const state = {
      registration: { step2: { name: 'n' } },
    } as RootState;

    expect(selectRegistrationStep2(state)).toEqual({ name: 'n' });
  });

  it('select step3', () => {
    const state = {
      registration: { step3: { skillName: 's' } },
    } as RootState;

    expect(selectRegistrationStep3(state)).toEqual({ skillName: 's' });
  });
});
