import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDTO } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  private logger = new Logger('AuthService');
  constructor(
    @InjectRepository(UserRepository)
    private userRepository: UserRepository,
    private jwtService: JwtService,
  ) {}
  async signUp(authCredentialsDTO: AuthCredentialsDTO): Promise<void> {
    return this.userRepository.signUp(authCredentialsDTO);
  }
  async signIn(
    authCredentialsDTO: AuthCredentialsDTO,
  ): Promise<{ accessToken: string }> {
    const username = await this.userRepository.validatePassword(
      authCredentialsDTO,
    );
    if (!username) throw new UnauthorizedException('Invalid credentials');
    const payload: JwtPayload = { username };
    this.logger.debug(
      `generated token with payload ${JSON.stringify(payload)}`,
    );
    const accessToken = await this.jwtService.sign(payload);
    return { accessToken };
  }
}
