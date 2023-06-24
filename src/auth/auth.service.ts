import { ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuthDto } from './dto';
import { hash } from 'argon2';
import { verify } from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}

  // REGISTER
  async signup(dto: AuthDto) {
    try {
      // Generate the hash password
      const hashPassword = await hash(dto.password);

      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash: hashPassword,
        },
      });
      delete user.hash;

      // Save the new user in the database
      return { user };
    } catch (error) {
      // Handle the error here
      throw new ForbiddenException('Failed to sign in');
    }
  }

  // LOGIN
  async signin(dto: AuthDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });

    if (!user) throw new ForbiddenException('Credentials incorrect');

    const pwMatch = await verify(user.hash, dto.password);
    if (!pwMatch) throw new ForbiddenException('Credentials incorrect');

    return this.signToken(user.id, user.email);
  }

  // GENERATE TOKEN
  async signToken(
    userId: number,
    email: string,
  ): Promise<{ access_token: string }> {
    const payload = {
      sub: userId,
      email,
    };

    const access_token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret: this.config.get('JWT'),
    });

    return { access_token };
  }
}
