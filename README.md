# Heaven Games

A comprehensive full-stack gaming platform built with React frontend and Node.js/Express backend. It offers a seamless experience for gamers to download games, participate in events, watch trailers and videos, browse and purchase products, and manage user profiles. Admins can manage content, users, and orders through a dedicated panel.

## Project Structure

```
heaven-games/
├── backend/
│   ├── index.js                 # Main server file with API routes
│   ├── package.json             # Backend dependencies and scripts
│   ├── my_database.db           # SQLite database file
│   └── upload_game_file/        # Directory for uploaded game files
├── frontend/
│   ├── public/                  # Static assets
│   ├── src/
│   │   ├── components/          # Reusable React components
│   │   │   ├── AdminHeader/     # Admin navigation header
│   │   │   ├── AllProductsSection/ # Product listing section
│   │   │   ├── AudiencePage/    # Live game audience view
│   │   │   ├── Cart/            # Shopping cart components
│   │   │   ├── Downloads/       # Game download page
│   │   │   ├── Event/           # Event listing and details
│   │   │   ├── Header/          # Main navigation header
│   │   │   ├── Home/            # Homepage dashboard
│   │   │   ├── LoginForm/       # User login form
│   │   │   ├── Products/        # Product catalog page
│   │   │   ├── ProfilePage/     # User profile management
│   │   │   ├── RegisterForm/    # User registration form
│   │   │   ├── Video/           # Video content page
│   │   │   ├── WatchTrailer/    # Trailer viewing component
│   │   │   └── ...              # Additional components
│   │   ├── context/             # React context for state management
│   │   ├── App.js               # Main React application component
│   │   └── index.js             # React application entry point
│   └── package.json             # Frontend dependencies and scripts
├── README.md                    # Project documentation
└── TODO.md                      # Project task list
```

## Features

- **User Authentication**: Secure login and registration with JWT tokens
- **Game Downloads**: Upload, download, and manage game files
- **Event Management**: Create, view, and register for gaming events
- **Video Trailers**: Upload and watch game trailers
- **Product Marketplace**: Browse, filter, and purchase gaming products
- **Admin Panel**: Manage users, orders, events, and content
- **User Profiles**: View personal events and order history
- **Cart Functionality**: Add products to cart and place orders

## Tech Stack

### Frontend
- React 17.0.1
- React Router DOM for routing
- React Context for state management
- FontAwesome for icons
- ZegoCloud for video conferencing
- React Player for video playback

### Backend
- Node.js with Express.js
- SQLite database
- JWT for authentication
- bcrypt for password hashing
- Multer for file uploads
- CORS for cross-origin requests

## Installation

### Prerequisites
- Node.js (version 10.13 or higher)
- npm or yarn

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the backend server:
   ```bash
   npm run dev
   ```
   The server will run on http://localhost:3001

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```
   The app will open at http://localhost:3000

## Usage

1. Register a new account or login with existing credentials
2. Browse games, events, trailers, and products
3. Download games or register for events
4. Add products to cart and place orders
5. Admins can access additional management features

## API Endpoints

### Authentication
- `POST /register` - User registration
- `POST /login` - User login

### Events
- `GET /event/` - Get all events
- `GET /event/:eventId/` - Get specific event
- `POST /event` - Create new event (admin)
- `PUT /event/:eventId` - Update event (admin)
- `DELETE /event/:eventId` - Delete event (admin)
- `POST /event/register/` - Register for event

### Trailers
- `GET /trailer/` - Get all trailers
- `GET /trailer/:trailerId/` - Get specific trailer
- `POST /trailer/` - Upload trailer (admin)
- `PUT /trailer/:trailerId/` - Update trailer (admin)
- `DELETE /trailer/:trailerId/` - Delete trailer (admin)

### Videos
- `GET /video/` - Get all videos
- `GET /video/:videoId/` - Get specific video
- `POST /video/` - Upload video (admin)
- `PUT /video/:videoId/` - Update video (admin)
- `DELETE /video/:videoId/` - Delete video (admin)

### Games
- `GET /games` - Get all games
- `GET /download/:id` - Download game file
- `POST /upload` - Upload game (admin)
- `PUT /upload/:id` - Update game (admin)
- `DELETE /games/:id` - Delete game (admin)

### Products
- `GET /products` - Get all products (with filtering)
- `GET /products/:id` - Get product details
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Orders
- `POST /orders` - Place order
- `GET /myorders/` - Get user orders
- `GET /admin/orders` - Get all orders (admin)
- `PUT /admin/orders/:id` - Update order status (admin)

### User Management
- `GET /myprofile/` - Get user profile
- `GET /myevent/` - Get user's registered events
- `GET /admin/users` - Get all users (admin)
- `PUT /admin/users/:user_id/role` - Update user role (admin)

## Screenshots Of UI

- <img width="1858" height="908" alt="Screenshot 2025-03-29 003125" src="https://github.com/user-attachments/assets/7d015498-063f-4d24-8500-459ecccd9df1" />
- <img width="1862" height="909" alt="Screenshot 2025-03-29 003303" src="https://github.com/user-attachments/assets/8351a14e-9497-45e1-a683-85619fb65fed" />
- <img width="1900" height="912" alt="Screenshot 2025-03-29 003952" src="https://github.com/user-attachments/assets/d050c4d6-82f9-4b40-8e5f-6e6fcf805dca" />
- <img width="1885" height="967" alt="Screenshot 2025-03-29 004840" src="https://github.com/user-attachments/assets/ad8e91b2-030a-4941-8670-abe2e5c286f6" />
- <img width="1868" height="896" alt="Screenshot 2025-03-29 004923" src="https://github.com/user-attachments/assets/2d001795-cd06-418b-abde-8558d180cb20" />
- <img width="816" height="882" alt="Screenshot 2025-03-29 010657" src="https://github.com/user-attachments/assets/b5be9c24-0e28-4453-969d-e4676fabe048" />
- <img width="1203" height="364" alt="Screenshot 2025-03-29 011142" src="https://github.com/user-attachments/assets/102323e0-c592-43d6-853f-57494c89fd36" />
- <img width="1872" height="924" alt="Screenshot 2025-03-29 005632" src="https://github.com/user-attachments/assets/64934b38-a280-4e77-b931-4665a74b41b6" />
- <img width="1870" height="897" alt="Screenshot 2025-03-29 005732" src="https://github.com/user-attachments/assets/377e6d23-3330-4789-adc5-e7cc252ccf52" />
- <img width="1590" height="898" alt="Screenshot 2025-03-29 005810" src="https://github.com/user-attachments/assets/240a43cd-2144-4efa-9b8c-3c088dd96b47" />
- <img width="1867" height="815" alt="Screenshot 2025-03-29 010035" src="https://github.com/user-attachments/assets/d7acf11b-fc4b-4f1f-8e87-86e97bb31f1e" />
- <img width="1863" height="898" alt="Screenshot 2025-03-29 010226" src="https://github.com/user-attachments/assets/dccc6050-9789-4267-868b-b00832276c3a" />
- <img width="1196" height="894" alt="Screenshot 2025-11-27 025413" src="https://github.com/user-attachments/assets/e630b84c-7012-45a4-bcda-4c9f6591b6d7" />

## Database Schema

The application uses SQLite with the following main tables:
- users
- event
- eventregistration
- trailers
- videos
- games
- products
- similar_products
- orders


