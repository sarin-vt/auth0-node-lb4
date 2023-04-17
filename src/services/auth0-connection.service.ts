import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {Connection, CreateConnection, GetConnectionsOptions} from 'auth0';
import getActiveDirectoryConnectionData from '../schema/ad-connection-schema';
import getDatabaseConnectionData from '../schema/db-connection-schema';
import {Auth0Service} from './auth0.service';

@injectable({scope: BindingScope.REQUEST})
export class Auth0ConnectionService {
  constructor(
    @service(Auth0Service)
    private auth0Service: Auth0Service,) {
  }
  public async createConnections(orgName: string, clientId: string): Promise<(string | undefined)[]> {
    try {
      console.log('creating connections');
      const dbConnResponse: {
        isCreated: boolean,
        connection: Connection
      } = await this.createDatabaseConnection(orgName, clientId);

      const adConnResponse: {
        isCreated: boolean,
        connection: Connection
      } = await this.createActiveDirectoryConnection(orgName, clientId);

      const connections = [adConnResponse?.connection?.id, dbConnResponse?.connection?.id];
      return connections;
    } catch {
      return []
    }
  }

  public async updateConnectionEnabledClients(connectionIds: (string | undefined)[], clientId: string) {
    const management = await this.auth0Service.getAuth0ManagementClient();
    const googleAuthConnectionId = "con_lF0XfsGBwZwhYsyZ";

    console.log(`clientId - ${clientId}`)

    const connections = await management.getConnections(
      {
        fields: ['name', 'id', 'enabled_clients'],
        include_fields: true,
      }
    );

    console.log("newly created connections + google auth connection - ", connectionIds);
    console.log("all existing connections - ", connections);

    var connectionsToRemove = connections.filter(connection =>
      !connectionIds.some(connectionId => connectionId === connection?.id));

    console.log("connections to remove from client - ", connectionsToRemove);

    connectionsToRemove.forEach(async connection => {
      if (connection?.id !== googleAuthConnectionId) {
        console.log("removing clientId from connection - ", connection.name);
        connection.enabled_clients = connection?.enabled_clients?.filter(
          client => client !== clientId);
      } else {
        console.log("adding clientId to connection - ", connection.name);
        connection.enabled_clients = [...new Set([...connection?.enabled_clients ?? [], clientId])];
      }

      await management.updateConnection({
        id: connection.id ?? ""
      }, {
        enabled_clients: connection.enabled_clients
      });
    });

    console.log("clientId removed from the connections - ", connectionsToRemove);
  }

  public async createDatabaseConnection(orgName: string, clientId: string): Promise<{
    isCreated: boolean,
    connection: Connection
  } | any> {
    try {
      console.log('starting database connection creation');
      const oldDbConn = await this.checkIfDatabaseConnectionExists(orgName);
      if (oldDbConn.exists) {
        console.log(`Delete the existing DB connection with id - ${oldDbConn.connectionId}`);
        const connectionId = oldDbConn.connectionId;
        await this.deleteDatabaseConnection(connectionId ?? "");
      }

      console.log('creating new database connection');
      const connection: Connection = await this.createDbConnection(orgName, clientId);
      if (connection?.id) {
        return {
          isCreated: true,
          connection: connection
        }
      }

      return {
        isCreated: false,
        client: {}
      }
    } catch {

    }
  }

  public async createActiveDirectoryConnection(orgName: string, clientId: string): Promise<{
    isCreated: boolean,
    connection: Connection
  } | any> {
    try {
      console.log('starting AD connection creation');
      const oldAdConn = await this.checkIfActiveDirectoryConnectionExists(orgName);
      if (oldAdConn.exists) {
        console.log(`Delete the existing AD connection with id - ${oldAdConn.connectionId}`);
        const connectionId = oldAdConn.connectionId;
        await this.deleteActiveDirectoryConnection(connectionId ?? "");
      }

      console.log('creating new active directory connection');
      const connection: Connection = await this.createAdConnection(orgName, clientId);
      if (connection?.id) {
        return {
          isCreated: true,
          connection: connection
        }
      }

      return {
        isCreated: false,
        client: {}
      }
    } catch {

    }
  }

  public async deleteActiveDirectoryConnection(connectionId: string): Promise<void> {
    const management = await this.auth0Service.getAuth0ManagementClient();
    await management.deleteConnection({
      id: connectionId
    });
    console.log(`AD Connection  ${connectionId} deleted.`);
  }

  public async deleteDatabaseConnection(connectionId: string): Promise<void> {
    const management = await this.auth0Service.getAuth0ManagementClient();
    await management.deleteConnection({
      id: connectionId
    });
    console.log(`Database Connection  ${connectionId} deleted.`);
  }

  public async createAdConnection(orgName: string, clientId: string): Promise<Connection> {
    const management = await this.auth0Service.getAuth0ManagementClient();
    const adConnData: CreateConnection = getActiveDirectoryConnectionData(orgName, clientId);
    const connection: Connection = await management.createConnection(adConnData);
    console.log(`ActiveDirectory Connection - [${connection?.id}] created for client - ${clientId}`);
    return connection;
  }

  public async createDbConnection(orgName: string, clientId: string): Promise<Connection> {
    const management = await this.auth0Service.getAuth0ManagementClient();
    const dbConnData: CreateConnection = getDatabaseConnectionData(orgName, clientId);
    const connection: Connection = await management.createConnection(dbConnData);
    console.log(`Database Connection - [${connection?.id}] created for client - ${clientId}`);
    return connection;
  }

  public async checkIfDatabaseConnectionExists(orgName: string): Promise<{
    exists: boolean,
    connectionId: string | undefined,
  }> {
    console.log('checking if a db connection exists');
    const management = await this.auth0Service.getAuth0ManagementClient();
    const connOptions: GetConnectionsOptions = {
      fields: ['name', 'id'],
      include_fields: true,
      strategy: 'auth0',
      name: `database-${orgName}`
    };

    const connections: Connection[] = await management.getConnections(connOptions);
    if (connections.length > 0) {
      console.log(`A database connection already exists - ${connections[0].id}`)
      return {
        exists: true,
        connectionId: connections[0].id
      }
    }

    return {
      exists: false,
      connectionId: ""
    }
  }


  public async checkIfActiveDirectoryConnectionExists(orgName: string): Promise<{
    exists: boolean,
    connectionId: string | undefined,
  }> {
    console.log('checking if a AD connection exists');
    const management = await this.auth0Service.getAuth0ManagementClient();
    const connOptions: GetConnectionsOptions = {
      fields: ['name', 'id'],
      include_fields: true,
      strategy: 'waad',
      name: `active-directory-${orgName}`
    };

    const connections: Connection[] = await management.getConnections(connOptions);
    if (connections.length > 0) {
      console.log(`A AD connection already exists - ${connections[0].id}`)
      return {
        exists: true,
        connectionId: connections[0].id
      }
    }

    return {
      exists: false,
      connectionId: ""
    }
  }
}


