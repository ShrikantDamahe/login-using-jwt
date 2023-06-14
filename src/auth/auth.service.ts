/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcrypt';
import { User } from './dto/auth.dto';
import { MongoClient, Db, Collection } from 'mongodb';
import { CreateDto, LoginDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
  private collection: Collection<User>;

  constructor(private readonly jwtService: JwtService) {
    this.initializeDatabase();
  }

  private async initializeDatabase(): Promise<void> {
    const client = await MongoClient.connect('mongodb://127.0.0.1:27017');
    const db: Db = client.db('mydata');
    this.collection = db.collection<User>('users');
  }

  async createUser(createUserDto: CreateDto): Promise<User> {
    const newUser: User = {
        email: createUserDto.email,
        password: createUserDto.password,
        id: 0
    };
    await this.collection.insertOne(newUser);
    return newUser;
  }

  async validateUser(loginUserDto: LoginDto): Promise<User | null> {
    const query = { email: loginUserDto.email };
    const user = await this.collection.findOne(query);
    if (!user) {
      return null;
    }

    const isPasswordValid = await compare(loginUserDto.password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  async login(user: User): Promise<string> {
    if (!user || !user.email) {
      throw new Error('Invalid user data');
    }

    const payload = { email: user.email, sub: user.id };
    return this.jwtService.sign(payload);
  }
}
