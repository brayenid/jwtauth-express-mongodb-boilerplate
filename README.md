## API Endpoints

### 1. Create a New User

**Endpoint:** `POST /users`

Create a new user by sending the following payload:

```json
{
  "name": "User's Name",
  "username": "UserUsername",
  "password": "UserPassword"
}
```

### 2. User Login

**Endpoint:** `POST /auth`

Authenticate and log in a user by sending the following payload, will response an Access Token and Refresh Token (cookie):

```json
{
  "username": "UserUsername",
  "password": "UserPassword"
}
```

### 3. Get a New Token with Refresh Token

**Endpoint:** `GET /auth`

Request a new token using the refresh token stored in the cookie.

### 4. User Logout/Delete Refresh Token

**Endpoint:** `DELETE /auth`

Logout the user and delete the refresh token.

-

[Brayen Luhat](https://brayenluhat.xyz)
