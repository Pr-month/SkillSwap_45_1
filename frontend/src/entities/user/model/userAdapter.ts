import { BackendUser } from '../../../api/skillSwapApi';
import { User, GenderOption } from './types';

export const mapBackendUserToUser = (user: BackendUser): User => ({
  _id: user.id,
  name: user.name,
  email: user.email,
  image: user.avatar ?? '',
  city: user.city ?? '',
  gender: user.gender === 'male' || user.gender === 'female'
    ? user.gender
    : 'any',
  birthdayDate: user.birthdate ?? '',
  description: user.about ?? '',
  likes: [],
  createdAt: new Date().toISOString(),

  canTeach: {
    category: '',
    subcategory: '',
    subcategoryId: '',
    name: '',
    description: '',
    image: [],
    customSkillId: '',
  },

  wantsToLearn: [],
});