# Authentication

By default, the boilerplate utilizes a sign-in strategy and sign-up via email and password, but you can add more strategies like Google sign-in and others. It also employs an OIDC provider to ensure secure client authentication.

## Table of Contents

- [Configure Authentication](#configure-authentication)

---

## Getting Started

1. Generate a secret key

```bash
node -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
```

2. Go to `/.env` and change value in `AUTH_JWT_SECRET`
```
AUTH_JWT_SECRET=HERE_SECRET_KEY_FROM_STEP_1
```
