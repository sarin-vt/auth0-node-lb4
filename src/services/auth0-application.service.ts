import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {Client} from 'auth0';
import getCreateClientData from '../schema/client-schema';
import {Auth0Service} from './auth0.service';

@injectable({scope: BindingScope.REQUEST})
export class Auth0ApplicationService {
  constructor(
    @service(Auth0Service)
    private auth0Service: Auth0Service,
  ) { }

  public async createApplication(orgName: string): Promise<{
    isCreated: boolean,
    client: Client
  }> {
    try {
      const clientOld = await this.checkIfAuthApplicationExists(orgName);
      if (clientOld.exists) {
        console.log(`Delete the existing client with name - ${orgName}`);
        const clientId = clientOld.clientId;
        await this.deleteAuthClient(clientId);
      }

      console.log('creating new client');
      const client: Client = await this.createAuthClient(orgName);
      if (client?.client_id) {
        return {
          isCreated: true,
          client: client
        }
      }

      return {
        isCreated: false,
        client: {}
      }
    } catch (error) {
      console.log(`Error while creating auth0 client`, error);
      return {
        isCreated: false,
        client: {}
      }
    }
  }

  public async createAuthClient(orgName: string): Promise<Client> {
    const management = await this.auth0Service.getAuth0ManagementClient();
    const clientData = getCreateClientData(orgName);
    const client: Client = await management.createClient(clientData);
    console.log(`New client created. clientId - ${client.client_id}`);
    return client;
  }

  public async deleteAuthClient(clientId: string): Promise<void> {
    const management = await this.auth0Service.getAuth0ManagementClient();
    await management.deleteClient({client_id: clientId});
    console.log(`Client deleted. clientId - ${clientId}`);
  }

  public async checkIfAuthApplicationExists(orgName: string): Promise<{
    exists: boolean,
    clientId: string,
  }> {
    const management = await this.auth0Service.getAuth0ManagementClient();
    const clients: Client[] = await management.getClients({
      fields: ['name', 'client_id'],
      include_fields: true
    });

    const clientId = clients.find(({name}) => {
      return name == orgName
    })?.client_id;

    if (clientId) {
      console.log(`client exists with name ${orgName}, clientId - ${clientId}`);
      return {
        exists: true,
        clientId: clientId
      };
    }

    return {
      exists: false,
      clientId: ""
    }
  }
}
