import {Data} from 'auth0';

const getCreateClientData = (orgName: string): Data => {
  return {
    "is_token_endpoint_ip_header_trusted": false,
    "name": orgName,
    "is_first_party": true,
    "oidc_conformant": true,
    "sso_disabled": false,
    "cross_origin_auth": false,
    "allowed_clients": [],
    "callbacks": [
      "https://" + orgName + ".dashboard.datanchor.io/callback",
      "https://anchormydata.us.auth0.com/mobile",
      "Datanchor.DAtAnchorMobileApp://anchormydata.us.auth0.com/ios/Datanchor.DAtAnchorMobileApp/callback",
      "datanchor://anchormydata.us.auth0.com/android/io.datanchor.datmobile/callback",
      "com.datanchor.DemoApp://anchormydata.us.auth0.com/ios/com.datanchor.DemoApp/callback",
      "datanchor://anchormydata.us.auth0.com/android/io.datanchor.deosr/callback",
    ],
    "native_social_login": {
      "apple": {
        "enabled": false
      },
      "facebook": {
        "enabled": false
      }
    },
    "refresh_token": {
      "expiration_type": "non-expiring",
      "idle_token_lifetime": 1296000,
      "infinite_idle_token_lifetime": true,
      "infinite_token_lifetime": true,
      "leeway": 0,
      "token_lifetime": 2592000,
      "rotation_type": "non-rotating"
    },
    "logo_uri": "https://storage.googleapis.com/client-logo-images/Logo%20Files/PNG/Logo%20Mark/Anchor-Logo-Mark-Blue.png",
    "allowed_logout_urls": [
      "https://anchormydata.us.auth0.com/mobile",
      "datanchor://anchormydata.us.auth0.com/android/io.datanchor.datmobile/callback",
      "demo://anchormydata.us.auth0.com/android/io.datanchor.deosr/callback",
      "https://anchormydata.us.auth0.com/v2/logout?federated",
      "com.datanchor.DemoApp://anchormydata.us.auth0.com/ios/com.datanchor.DemoApp/callback",
      "Datanchor.DAtAnchorMobileApp://anchormydata.us.auth0.com/ios/Datanchor.DAtAnchorMobileApp/callback",
      "https://" + orgName + ".dashboard.datanchor.io",
    ],
    "allowed_origins": [
      "https://" + orgName + ".dashboard.datanchor.io",
    ],
    "jwt_configuration": {
      "alg": "RS256",
      "lifetime_in_seconds": 36000,
      "secret_encoded": false
    },
    "client_aliases": [],
    "token_endpoint_auth_method": "none",
    "app_type": "regular_web",
    "grant_types": [
      "authorization_code",
      "implicit",
      "refresh_token",
      "http://auth0.com/oauth/grant-type/passwordless/otp"
    ],
    "web_origins": [
      "https://*.dashboard.datanchor.io/"
    ],
    "custom_login_page_on": true
  }
}
export default getCreateClientData;
