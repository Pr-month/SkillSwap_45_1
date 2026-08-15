import { finishRegistration, finishRegistrationFromStep3 } from './registrationThunks';
import { loginStart, loginSuccess, loginFailure } from './authSlice';
import { createProfile } from '../../profile/model/profileSlice';

jest.mock('../../profile/model/profileSlice');
const mockedCreateProfile = jest.mocked(createProfile);

describe('registrationThunks', () => {
  const dispatch = jest.fn();
  const getState = jest.fn();

  beforeEach(() => {
    dispatch.mockClear();
    getState.mockClear();
    mockedCreateProfile.mockClear();
  });

  describe('finishRegistration', () => {
    it('fail if steps missing', async () => {
      getState.mockReturnValue({ registration: {} });

      const res = await finishRegistration()(dispatch, getState, undefined);

      expect(res.type).toContain('rejected');
      expect(dispatch).toHaveBeenCalledWith(loginFailure(expect.stringContaining('не все шаги')));
    });

    it('create profile and login', async () => {
      getState.mockReturnValue({
        registration: {
          step1: { email: 'a', password: 'b' },
          step2: {
            name: 'User',
            birthDate: null,
            gender: '',
            city: null,
            categorySkill: [],
            subcategorySkill: [],
          },
          step3: {
            skillName: 'Skill',
            categorySkill: ['cat'],
            subcategorySkill: ['sub'],
            description: '',
          },
        },
      });

      mockedCreateProfile.mockReturnValue({
        type: 'profile/createProfile',
        payload: {
          profile: {
            email: '',
            name: '',
            birthDate: null,
            gender: '',
            city: '',
            about: '',
            avatarSrc: undefined,
          },
          skill: {
            title: '',
            description: '',
            category: '',
            images: [],
            tags: [],
            isPublic: false,
          },
        },
      });

      const res = await finishRegistration()(dispatch, getState, undefined);

      expect(dispatch).toHaveBeenCalledWith(loginStart());
      expect(dispatch).toHaveBeenCalledWith(loginSuccess(expect.any(Object)));
      expect(res.type).toContain('fulfilled');
    });
  });

  describe('finishRegistrationFromStep3', () => {
    it('reject if invalid form', async () => {
      const form = {
        skillName: '',
        category: [] as string[],
        subcategory: [] as string[],
        description: '',
        photos: [] as File[],
      };

      const res = await finishRegistrationFromStep3(form)(dispatch, getState, undefined);

      expect(res.type).toContain('rejected');
    });
  });
});
