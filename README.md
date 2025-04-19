# 🔐 OAuth 2.0 Mock Authentication System

This project demonstrates a mock OAuth 2.0 authentication system designed for educational and security testing purposes. It simulates the Authorization Code Flow using a simple frontend and a backend authorization server. The system also showcases a **token reuse attack** to highlight the importance of secure token handling and role-based validation.

## 📘 What is OAuth (Open Authorization)?

OAuth 2.0 is an open standard protocol that allows third-party applications to access user data without exposing their passwords. It issues **access tokens** to clients after user consent and authentication, allowing secure delegated access to protected resources (like user profiles, settings, etc.).

Example: When you "Log in with Google" to another app, OAuth is being used behind the scenes.

## 🚀 How to Run the Auth Server

1. Navigate to the `auth-server` directory:
   ```bash
   cd auth-server
   npm init -y
   npm install express body-parser cors

