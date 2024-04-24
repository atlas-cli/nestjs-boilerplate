import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientMetadata } from 'oidc-provider';
import { buildClientsDataSource } from './clients.data-source';

@Injectable()
export class ClientsService {
  constructor(private configService: ConfigService) {}
  buildClients(): ClientMetadata[] {
    return buildClientsDataSource(this.configService);
  }
  async getClients() {
    return this.buildClients();
  }
  getClient(clientId: string) {
    return this.buildClients().find((client) => client.client_id === clientId);
  }
}
