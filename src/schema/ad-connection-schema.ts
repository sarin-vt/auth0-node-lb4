import {CreateConnection} from 'auth0';

const getActiveDirectoryConnectionData = (orgName: string, clientId: string): CreateConnection => {
  return {
    name: `active-directory-${orgName}`,
    strategy: 'waad',
    options: {
      "use_wsfed": false,
      "useCommonEndpoint": false,
      "basic_profile": false,
      "ext_profile": false,
      "ext_groups": false,
      "ext_nested_groups": false,
      "api_enable_users": false,
      "waad_protocol": "openid-connect",
      "identity_api": "microsoft-identity-platform-v2.0",
      "should_trust_email_verified_connection": "always_set_emails_as_verified",
      "domain": "datanchorio.sharepoint.com",
      "tenant_domain": "datanchorio.sharepoint.com",
      "client_id": "755045b8-2e45-4eb9-95cf-af1fd15708e9",
      "client_secret": "BBp8Q~sWGJWG3ouECRjIUNTdTy06BmpPMoAWxb~E"
    },
    enabled_clients: [clientId]
  }
}

export default getActiveDirectoryConnectionData;
