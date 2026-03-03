import { Amplify } from "aws-amplify";

// Configure Amplify for Cognito
Amplify.configure({
  Auth: {
    Cognito: {
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || "",
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || "",
      loginWith: {
        oauth: {
          domain:
            import.meta.env.VITE_COGNITO_DOMAIN ||
            "smarthire-auth-dev.auth.ap-southeast-1.amazoncognito.com",
          scopes: [
            "email",
            "openid",
            "profile",
            "aws.cognito.signin.user.admin",
          ],
          redirectSignIn: [window.location.origin + "/"],
          redirectSignOut: [window.location.origin + "/login"],
          responseType: "code",
        },
      },
    },
  },
});
