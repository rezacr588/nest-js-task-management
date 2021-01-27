import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { User } from './user.entity';
import { UserRepository } from './user.repository';
import * as bcrypt from 'bcryptjs';
const mockCredentialsDTO = { username: 'reza', password: 'mahmood' };
describe('UserRepository', () => {
  let userRepository;
  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserRepository],
    }).compile();
    userRepository = await module.get<UserRepository>(UserRepository);
  });
  describe('signUp', () => {
    let save;
    beforeEach(() => {
      save = jest.fn();
      userRepository.create = jest.fn().mockReturnValue({ save });
    });
    it('sign up the user', () => {
      save.mockResolvedValue(undefined);
      expect(userRepository.signUp(mockCredentialsDTO)).resolves.not.toThrow();
    });

    it('throws a conflict exception as username already exists', () => {
      save.mockRejectedValue({ code: '23505' });
      expect(userRepository.signUp(mockCredentialsDTO)).rejects.toThrow(
        ConflictException,
      );
    });
    it('throws a conflict exception as username already exists', () => {
      save.mockRejectedValue({ code: '321312' });
      expect(userRepository.signUp(mockCredentialsDTO)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
  describe('validate user password', () => {
    let user;
    beforeEach(() => {
      userRepository.findOne = jest.fn();
      user = new User();
      user.username = 'Test Username';
      user.validatePassword = jest.fn();
    });
    it('it returns a user as validation is successfully', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(true);
      const result = await userRepository.validatePassword(mockCredentialsDTO);
      expect(result).toEqual('Test Username');
    });
    it('it returns null as user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);
      const result = await userRepository.validatePassword(mockCredentialsDTO);
      expect(user.validatePassword).not.toHaveBeenCalled();
      expect(result).toBeNull();
    });
    it('it returns null as password is incurrect', async () => {
      userRepository.findOne.mockResolvedValue(user);
      user.validatePassword.mockResolvedValue(false);
      const result = await userRepository.validatePassword(mockCredentialsDTO);
      expect(user.validatePassword).toHaveBeenCalled();
      expect(result).toBeNull();
    });
  });
  describe('hashPassword', () => {
    it('it call bcrypt.hash to generate a hash password', async () => {
      bcrypt.hash = jest.fn().mockResolvedValue('testHash');
      expect(bcrypt.hash).not.toHaveBeenCalled();
      const result = await userRepository.genPassword(
        'testPassword',
        'testSult',
      );
      expect(bcrypt.hash).toHaveBeenCalledWith('testPassword', 'testSult');
      expect(result).toEqual('testHash');
    });
  });
});
