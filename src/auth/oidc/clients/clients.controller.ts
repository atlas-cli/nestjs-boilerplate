import { Controller, Get, Param } from '@nestjs/common';
import { ClientsService } from './clients.service';

@Controller('clients')
export class ClientsController {
  constructor(public clientsService: ClientsService) {}

  @Get(':clientId')
  getClientIdInformation(
    @Param('clientId')
    clientId: string,
  ) {
    const client = this.clientsService.getClient(clientId);
    delete client.client_secret;
    return client;
  }
}
