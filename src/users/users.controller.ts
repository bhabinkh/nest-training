import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import bcrypt from 'bcrypt';
import { LocalAuthGuard } from 'src/auth/local.auth.guard';
import { AuthenticatedGuard } from 'src/auth/authenticated.guard';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    //post / signup
    @Post('/signup')
    async addUser(
        @Body('username') userName: string,
        @Body('password') userPassword: string,
    ) {
        const hashedPassword = await bcrypt.hash(userPassword, 12);
        const result = await this.usersService.insertUser(
            userName,
            hashedPassword,
        );
        return {
            msg: 'User successfully registered',
            userId: result.id,
            userName: result.username
        };
    }

    //Post / Login
    @UseGuards(LocalAuthGuard)
    @Post('/login')
    login(@Request() req): any {
        return {
            User: req.user,
            msg: 'User logged in'
        };
    }

    @UseGuards(AuthenticatedGuard)
    @Get('/protected')
    getHello(@Request() req): string {
        return req.user;
    }

    @Get('/logout')
    logout(@Request() req): any {
        req.session.destroy();
        return { msg: 'The user session has ended' }
    }
}