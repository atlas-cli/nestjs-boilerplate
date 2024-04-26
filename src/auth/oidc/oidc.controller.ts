import {
  All,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { AuthService } from './../auth.service';
import { LoginGuard } from './../guards/login.guard';

@Controller('auth/oidc')
export class OidcController {
  constructor(
    @Inject('OidcProvider')
    public oidcProvider,
    private configService: ConfigService,
    private authService: AuthService,
  ) {}

  @ApiBearerAuth()
  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  public async me(@Req() request) {
    const userProfile = await this.authService.me(request.user);

    return {
      ...userProfile,
      id: userProfile.id,
      sub: userProfile.id.toString(),
    };
  }

  @Get('interaction/:uuid')
  async interactionView(
    @Req() req: Request,
    @Res() res: Response,
    @Param('uuid') uuid: string,
  ) {
    req.url = req.originalUrl
      .toString()
      .replace('interaction/api', 'interaction')
      .replace('/auth/oidc', '');
    const { params, uid } = await this.oidcProvider.interactionDetails(
      req,
      res,
    );
    const response = {
      params: params,
      uid: uid,
      uuid,
    };
    const clientUrl = this.configService.get('app.frontendDomain');
    res.redirect(
      [
        clientUrl,
        `sign-in?session=${uuid}&clientId=${response.params.client_id}`,
      ].join('/'),
    );
  }

  @Get('/interaction/validate/:uuid')
  async interactionDetails(
    @Req() req,
    @Res() res,
    @Param('uuid') uuid: string,
  ) {
    req.url = req.originalUrl
      .toString()
      .replace('interaction/api', 'interaction')
      .replace('/auth/oidc', '')
      .replace('interaction/validate', 'interaction');
    req.headers.cookie = '_interaction=' + uuid;
    try {
      const { uid } = await this.oidcProvider.interactionDetails(req, res);
      res.send({ uid });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'invalid interaction' });
    }
  }

  @UseGuards(LoginGuard)
  @Post('interaction/:uuid')
  async loginInteraction(
    @Req() req,
    @Res() res: Response,
    @Param('uuid') uuid: string,
  ) {
    req.body = {
      email: '',
      password: '',
    };
    req.headers.cookie = '_interaction=' + uuid;
    req.url = req.originalUrl
      .replace('interaction/api', 'interaction')
      .replace('/auth/oidc', '');

    const session = {
      login: {
        accountId: req.user.id.toString(),
      },
    };
    const redirectToCallback = await this.oidcProvider.interactionResult(
      req,
      res,
      session,
      {
        mergeWithLastSubmission: true,
      },
    );
    res.send({ redirectToCallback });
  }

  @All('/*')
  public mountedOidc(@Req() req: Request, @Res() res: Response) {
    try {
      req.url = req.originalUrl.replace('/auth/oidc', '');
      this.oidcProvider.callback()(req, res);
    } catch (error) {
      console.log('Error on OIDC Controller', error);
    }
  }
}
