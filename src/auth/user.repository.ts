import { EntityRepository, Repository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from './user.entity';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    const { username, password } = authCredentialsDTO;
    const user = this.create();
    user.username = username;
    user.salt = await bcrypt.genSalt();
    user.password = await this.genPassword(password, user.salt);
    try {
      await user.save();
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }
  async validatePassword(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<string> {
    const { username, password } = authCredentialsDTO;
    const user = await this.findOne({ username });
    if (user && user.validatePassword(password)) {
      return user.username;
    } else {
      return null;
    }
  }
  private async genPassword(password: string, salt: string): Promise<string> {
    return await bcrypt.hash(password, salt);
  }
}
