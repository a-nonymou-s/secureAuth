# secureAuth: Robust Authentication System
secureAuth is a powerful authentication system designed for modern web applications. Utilizing JWT (JSON Web Tokens), nodemailer for email services, and MongoDB as a database, this system provides a comprehensive solution for user authentication. It includes features like registration, login, email verification, and password reset functionality.

## Features
- User Registration and Login System
- Email Verification on Registration
- Password Reset Functionality
- JWT for secure and efficient authentication
- MongoDB for robust data storage

## Technologies
- Node.js
- Express.js (REST API Framework)
- MongoDB (Database)
- bcrypt (Password Hashing)
- JWT (JSON Web Tokens)
- nodemailer (Email Service)

## Getting Started
These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.
### Prerequisites
- Node.js
- MongoDB
- Git (Optional)
### Installation
1. Clone the Repository (Optional)
```bash
git clone https://github.com/yourusername/secureAuth.git
cd secureAuth
```
2. Install Dependencies
```bash
npm install
```
3. Environment Setup
Create a `.env` file in the root directory of the project and add the following:
```makefile
PORT=YourPortNumber
MONGODB_URI=YourMongoDBURI
JWT=YourSecretKeyForJWT
GUSER=YourGmailUsername
GPASS=YourGmailPassword
```
4. Run the server
```bash
npm run dev
```
The server will start on the port specified in your `.env` file.  

## Usage
### Endpoints
1. User Registration
```
POST /auth/register
```
2. User Login
```
POST /auth/login
```
3. Email Verification
```
GET /auth/verify/:token
```
4. Send Reset Password Email
```
GET /auth/resetpassword
```
5. Reset Password
```
POST /auth/reset/:token
```
### Request and response Examples
1. User Registration 
    - Request Body
    ```json
    {
        "name": "John Doe",
        "email": "john@example.com",
        "password": "password123"
    }
    ```
    - Response Body ( Success )
    ```json
    {
        "error": false,
        "success": true,
        "result": {
            "_id": "UserID",
            "name": "John Doe",
            "email": "john@example.com",
            "isVerified": false
        },
        "message": "User created successfully, please check your email for verification."
    }
    ```
2. User Login
    - Request Body
    ```json
    {
        "email": "john@example.com",
        "password": "password123"
    }

    ```
    - Response Body ( Success )
    ```json
    {
        "accessToken": "GeneratedJWTToken",
        "userID": "UserID",
        "message": "Logged In Successfully"
    }
    ```
3. Email Verification
    - Request Body
    ```json
    {}
    ```
    - Response Body ( Success )
    ```json
    {
        "error": false,
        "message": "Email Verified Successfully"
    }
    ```
4. Send Reset Password Email
    - Request Header
    ```json
    {
        "Authorization": "Bearer GeneratedJWTToken"
    }

    ```
    - Response Body ( Success )
    ```json
    {
        "error": false,
        "message": "Password Reset Link Successfully Sent."
    }
    ```    
5. Reset Password
    - Request Header
    ```json
    {
        "newPassword": "newPassword123"
    }

    ```
    - Response Body ( Success )
    ```json
    {
        "error": false,
        "message": "Password Changed Successfully"
    }
    ```  
## Customization
To customize secureAuth, modify the controllers, models, or routes according to your project's requirements. The MVC pattern makes it easy to adapt and extend.

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

### License
This project is licensed under the MIT License - see the LICENSE.md file for details.



