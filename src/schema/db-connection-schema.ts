import {CreateConnection} from 'auth0';

const getDatabaseConnectionData = (orgName: string, clientId: string): CreateConnection => {
  return {
    name: `database-${orgName}`,
    strategy: "auth0",
    options: {
      'mfa': {
        'active': true,
        'return_enroll_settings': true
      },
      'import_mode': false,
      'configuration': {},
      'disable_signup': true,
      'passwordPolicy': 'good',
      'password_history': {
        'size': 5,
        'enable': false
      },
      'strategy_version': 2,
      'requires_username': false,
      'password_dictionary': {
        'enable': false,
        'dictionary': []
      },
      'brute_force_protection': true,
      'password_no_personal_info': {
        'enable': false
      },
      'password_complexity_options': {
        'min_length': 8
      },
      'enabledDatabaseCustomization': false
    },
    "is_domain_connection": false,
    "realms": [
      orgName
    ],
    metadata: {},
    enabled_clients: [clientId]
  };
}

export default getDatabaseConnectionData;
