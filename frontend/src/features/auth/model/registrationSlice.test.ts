import registrationReducer, {
  saveStep1,
  saveStep2,
  saveStep3,
  resetRegistrationDraft,
} from './registrationSlice';

describe('registrationSlice', () => {
  const initial = { step1: null, step2: null, step3: null };

  it('saveStep1', () => {
    const state = registrationReducer(initial, saveStep1({ email: 'a', password: 'b' }));
    expect(state.step1).toEqual({ email: 'a', password: 'b' });
  });

  it('saveStep2', () => {
    const state = registrationReducer(
      initial,
      saveStep2({
        name: 'n',
        birthDate: null,
        gender: '',
        city: null,
        categorySkill: [],
        subcategorySkill: [],
      }),
    );
    expect(state.step2).toEqual({
      name: 'n',
      birthDate: null,
      gender: '',
      city: null,
      categorySkill: [],
      subcategorySkill: [],
    });
  });

  it('saveStep3', () => {
    const state = registrationReducer(
      initial,
      saveStep3({ skillName: 's', categorySkill: [], subcategorySkill: [], description: '' }),
    );
    expect(state.step3).toEqual({
      skillName: 's',
      categorySkill: [],
      subcategorySkill: [],
      description: '',
    });
  });

  it('resetRegistrationDraft', () => {
    const filled = {
      step1: { email: 'a', password: 'b' },
      step2: {
        name: 'n',
        birthDate: null,
        gender: '',
        city: null,
        categorySkill: [],
        subcategorySkill: [],
      },
      step3: { skillName: 's', categorySkill: [], subcategorySkill: [], description: '' },
    };

    const state = registrationReducer(filled, resetRegistrationDraft());
    expect(state).toEqual(initial);
  });
});
