import { Amplify } from "aws-amplify";

// Configure Amplify for Cognito
Amplify.configure({
  Auth: {
    Cognito: {
      //  Amazon Cognito User Pool ID
      userPoolId: import.meta.env.VITE_AWS_USER_POOL_ID || "",
      // OPTIONAL - Amazon Cognito Web Client ID (26-char alphanumeric string)
      userPoolClientId: import.meta.env.VITE_AWS_USER_POOL_CLIENT_ID || "",
    },
  },
});
