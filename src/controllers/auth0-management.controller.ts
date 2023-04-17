
import {service} from '@loopback/core';
import {post, requestBody} from '@loopback/rest';
import {Client} from 'auth0';
import {Auth0ApplicationService, Auth0ConnectionService, Auth0UserService} from '../services';

export class Auth0ManagementController {
  constructor(
    @service(Auth0ApplicationService)
    private appService: Auth0ApplicationService,
    @service(Auth0ConnectionService)
    private connectionService: Auth0ConnectionService,
    @service(Auth0UserService)
    private userService: Auth0UserService
  ) { }

  @post('/internal/v1/onboard/auth0')
  async addClientOnGrafana(
    @requestBody()
    body: {
      orgId: string,
      adminEmail: string
    }
  ): Promise<any> {
    try {
      const {orgId: anchorOrgId, adminEmail} = body;
      const {isCreated, client: application}: {
        isCreated: boolean,
        client: Client
      } = await this.appService.createApplication(anchorOrgId);

      const clientId = application?.client_id ?? "";
      const connections = await this.connectionService.createConnections("sarin", "DPSyz9sh9Mi3jC5XkqMsBSJCCGVqUdO8");
      await this.connectionService.updateConnectionEnabledClients(connections, "DPSyz9sh9Mi3jC5XkqMsBSJCCGVqUdO8");
      await this.userService.createUser("sarin@datanchor.io", "sarin");

    } catch (error) {
      console.log(error);
    }
  }
}
