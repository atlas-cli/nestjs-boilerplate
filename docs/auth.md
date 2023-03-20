# Auth

By default boilerplate used sign in and sign up via email and password.

```mermaid
sequenceDiagram
    participant A as Fronted App (Web, Mobile, Desktop)
    participant B as Backend App

    A->>B: 1. Sign up via email and password
    A->>B: 2. Sign in via email and password
    B->>A: 3. Get a JWT token
    A->>B: 4. Make any requests using a JWT token
```

Also you can sign up via another external services or social networks like Apple, Facebook, Google, and Twitter.

```mermaid
sequenceDiagram
    participant B as External Auth Services (Apple, Google, etc)
    participant A as Fronted App (Web, Mobile, Desktop)
    participant C as Backend App

    A->>B: 1. Sign in through an external service
    B->>A: 2. Get Access Token
    A->>C: 3. Send Access Token to auth endpoint
    C->>A: 4. Get a JWT token
    A->>C: 5. Make any requests using a JWT token
```

## Table of Contents

- [Configure Auth](#configure-auth)

---

## Configure Auth

1. Generate secret key

   ```bash
   node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
   ```

1. Go to `/.env` and change value in `AUTH_JWT_SECRET`

   ```text
   AUTH_JWT_SECRET=HERE_SECRET_KEY_FROM_STEP_1
   ```

Next: [Serialization](serialization.md)

GitHub: https://github.com/slingui-dev/server-side
