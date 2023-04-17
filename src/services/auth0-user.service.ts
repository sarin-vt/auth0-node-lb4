
import { /* inject, */ BindingScope, injectable, service} from '@loopback/core';
import {CreateUserData, User} from 'auth0';
import {getAuth0UserData} from '../schema/user-schema';
import {Auth0Service} from './auth0.service';

@injectable({scope: BindingScope.REQUEST})
export class Auth0UserService {
  constructor(
    @service(Auth0Service)
    private auth0Service: Auth0Service,
  ) { }

  public async createUser(email: string, orgId: string) {
    console.log('starting auth0 user account creation');
    const response = await this.checkIfUserExists(email);

    if (response.exists) {
      const userId = response.userId;
      await this.deleteUserAccount(userId);
    }

    await this.createAuth0User(email, orgId);
  }

  public async createAuth0User(email: string, orgId: string) {
    console.log(`creating a new auth0 user account for email - ${email},
     org - ${orgId}`);

    const userData: CreateUserData = getAuth0UserData(email, orgId);
    const management = await this.auth0Service.getAuth0ManagementClient();
    const user: User = await management.createUser(userData);

    console.log(`A new auth0 user account created. userId - ${user?._id}`);

    return user;
  }

  public async deleteUserAccount(userId: string): Promise<boolean> {
    console.log(`deleting the user account with userId - ${userId}`);
    const management = await this.auth0Service.getAuth0ManagementClient();
    await management.deleteUser({id: userId});
    return true;
  }

  public async checkIfUserExists(email: string): Promise<{
    exists: boolean,
    userId: string
  }> {
    console.log(`checking if a user account already exists for email - ${email}`);
    const management = await this.auth0Service.getAuth0ManagementClient();
    const users: Array<User> = await management.getUsersByEmail(email);
    if (users.length > 0) {
      console.log(`An auth0 user account exists for email - ${email}, userId = ${users[0]._id}`);
      return {
        exists: true,
        userId: users[0]._id ?? ""
      }
    }

    return {
      exists: false,
      userId: ""
    }
  }
}
