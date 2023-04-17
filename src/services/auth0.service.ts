import { /* inject, */ BindingScope, injectable} from '@loopback/core';
import {ManagementClient, ManagementClientOptions} from 'auth0';
require('auth0').ManagementClient as ManagementClient;

@injectable({scope: BindingScope.REQUEST})
export class Auth0Service {
  protected managementClientOptions: ManagementClientOptions;

  constructor() {
    this.managementClientOptions = {
      domain: 'datanchorio.auth0.com',
      clientId: 'v0JbI6z8Y02YvPuZmN3KDoOExnCMGZoL',
      clientSecret: 'DjaUTMebrcBm3AFZzxlzrPNYfLCie66s8DNyypKAMojfg6WFOHkgna5IAV1bdv2U',
      audience: 'https://datanchorio.auth0.com/api/v2/',
      scope: 'read:users create:users delete:users read:users create:users delete:users',
    };
  }

  public async getAuth0ManagementClient(): Promise<ManagementClient> {
    const auth0: ManagementClient = new ManagementClient(this.managementClientOptions);
    return auth0;
  }
}
