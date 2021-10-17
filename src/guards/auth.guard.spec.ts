import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { AuthService } from '../modules/auth/services/auth.service';
import { UnauthorizedException } from 'src/exceptions/';

describe('AuthGuard', () => {
  describe('AuthGuard', () => {
    it('AuthGuard return true', async () => {
      const authService: AuthService = jest.createMockFromModule(
        '../modules/auth/services/auth.service',
      );
      authService.isValidToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve(true));

      const authGuard = new AuthGuard(authService);
      const context: ExecutionContext =
        jest.createMockFromModule('@nestjs/common');

      context.switchToHttp = jest.fn().mockImplementation(() => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer token',
          },
        }),
      }));

      const result = await authGuard.canActivate(context);
      expect(result).toBe(true);
    });

    it('AuthGuard return error', async () => {
      const authService: AuthService = jest.createMockFromModule(
        '../modules/auth/services/auth.service',
      );
      authService.isValidToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve(false));

      const authGuard = new AuthGuard(authService);
      const context: ExecutionContext =
        jest.createMockFromModule('@nestjs/common');

      context.switchToHttp = jest.fn().mockImplementation(() => ({
        getRequest: () => ({
          headers: {
            authorization: 'token',
          },
        }),
      }));

      await expect(async () => {
        await authGuard.canActivate(context);
      }).rejects.toThrow(UnauthorizedException);
    });

    it('AuthGuard return error if do not have token access', async () => {
      const authService: AuthService = jest.createMockFromModule(
        '../modules/auth/services/auth.service',
      );
      authService.isValidToken = jest
        .fn()
        .mockImplementation(() => Promise.resolve(false));

      const authGuard = new AuthGuard(authService);
      const context: ExecutionContext =
        jest.createMockFromModule('@nestjs/common');

      context.switchToHttp = jest.fn().mockImplementation(() => ({
        getRequest: () => ({
          headers: {
            authorization: null,
          },
        }),
      }));

      await expect(async () => {
        await authGuard.canActivate(context);
      }).rejects.toThrow(UnauthorizedException);
    });
  });
});
