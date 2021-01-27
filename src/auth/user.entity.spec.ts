import { User } from './user.entity';
import * as bcrypt from 'bcryptjs';
describe('User entity', () => {
  let user: User;
  beforeEach(() => {
    user = new User();
    user.password = 'testPassword';
    user.salt = 'testSalt';
    bcrypt.hash = jest.fn();
  });
  describe('Validate Password method', () => {
    it('it returns true if password is valid', async () => {
      bcrypt.hash.mockReturnValue('testPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('123456');
      expect(bcrypt.hash).toHaveBeenCalledWith(
        '123456',
        '72AE25495A7981C40622D49F9A52E4F1565C90F048F59027BD9C8C8900D5C3D8',
      );
      expect(result).toEqual(true);
    });
    it('it returns false if password is invalid', async () => {
      bcrypt.hash.mockReturnValue('wrongPassword');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await user.validatePassword('wrongPassword');
      expect(bcrypt.hash).toHaveBeenCalledWith(
        'wrongPassword',
        '72AE25495A7981C40622D49F9A52E4F1565C90F048F59027BD9C8C8900D5C3D8',
      );
      expect(result).toEqual(false);
    });
  });
});
