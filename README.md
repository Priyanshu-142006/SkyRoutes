# Sky Routes — Travel Booking Web App
## Overview:
- Sky Routes is a full-stack travel booking web application that allows users to explore destinations, register/login securely, and book trips with real-time pricing.
It integrates a modern frontend with a Node.js backend and IBM Cloudant NoSQL database.

# Features:
## Destination Explorer
- 15+ destinations with images and descriptions
- Categories: Beach, Mountain, City, Adventure
- Search and filter functionality
## Authentication System
- User registration and login
- Duplicate email prevention
- Secure backend validation
## Booking System
- Flight booking form
- Auto-fill destination from cards
- Stores bookings in database
## Dynamic Pricing
- Price updates based on:
- Cabin class (Economy → First Class)
- Number of passengers
- Includes taxes and service fee
## Database Integration
- Uses IBM Cloudant (NoSQL)
- Two collections:
- users
- bookings

# Tech Stack:
## Frontend
- HTML5
- CSS (Tailwind)
- JavaScript (Vanilla)
## Backend
- Node.js
- Express.js
## Database
- IBM Cloudant (NoSQL)

# API Endpoints:
## POST /register
- Register a new user
- Checks duplicate email
## POST /login
- Validates user credentials
- Returns user data
## POST /booking
- Saves booking details
## GET /bookings
- Fetch all bookings from database

# How It Works:
- User registers → stored in Cloudant
- User logs in → verified from database
- User selects destination → auto-filled
- Price updates dynamically
- Booking submitted → stored in Cloudant

# Team Members:
- Priyanshu Tirkey
- Anshu Sahay
- Sanchita Kesari
- Anand Ganjhu

# Database (Cloudant):
## Users Collection:
{
  name,
  email,
  password
}
## Bookings Collection:
{
  fname,
  lname,
  email,
  from,
  to,
  dep,
  cabin,
  passengers,
  total,
  bookedAt
}

# Future Improvements:
- Password encryption (bcrypt)
- JWT authentication
- Payment gateway integration
- Deployment (Render / Vercel)
- Booking history for users

# Conclusion:
## Sky Routes simplifies travel booking into a single platform with:
- Clean UI
- Secure backend
- Real-time database storage

# Acknowledgements:
- IBM Cloudant
- Node.js & Express
- Tailwind CSS