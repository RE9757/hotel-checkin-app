# Hotel Check-in App

A simple hotel check-in management system built with Spring Boot and plain JavaScript.

## Features

- Guest check-in form with validation
- View all check-in records in a styled table
- Edit and delete existing records
- Toggle record table visibility
- Responsive Bootstrap-based UI

## Tech Stack

- Java 21 + Spring Boot
- PostgreSQL (or any JPA-compatible DB)
- HTML, CSS, JavaScript
- Bootstrap 5 (CDN)

## Getting Started

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/hotel-checkin-app.git
   cd hotel-checkin-app
2. Configure database in application.properties:
   ```spring.datasource.url=jdbc:postgresql://localhost:5432/hotel
   spring.datasource.username=your_user
   spring.datasource.password=your_password
   ```
3. Run the application:
   ```./mvnw spring-boot:run```
4. Open in browser:
   ```http://localhost:8080/```
