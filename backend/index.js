const express = require('express');
const path = require('path');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const multer = require('multer');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, 'my_database.db');
const uploadDir = path.join(__dirname, 'upload_game_file');


if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Upload directory created:', uploadDir);
}

const upload = multer({ dest: uploadDir });

let db = null;

const initializeDbAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3001, () => {
      console.log('Server Running at http://localhost:3001/');
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();


// Register
app.post('/register', async (request, response) => {
  const { username, fullname, password } = request.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const selectUserQuery = `SELECT * FROM users WHERE user_name = ?;`;
  const dbUser = await db.get(selectUserQuery, [username]);

  if (password.length < 6) {
    response.status(400).json({ message: 'Password is too short' });
  } else {
    if (dbUser === undefined) {
      const role = username === 'admin_01' ? 'admin' : 'user';

      const createUserQuery = `INSERT INTO 
          users (full_name, user_name, password, role) 
        VALUES 
          (?, ?, ?, ?)`;
      await db.run(createUserQuery, [fullname, username, hashedPassword, role]);
      
      const payload = { username, role };
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN');
      response.status(200).send({ jwt_token: jwtToken });
    } else {
      response.status(400).json({ message: 'User already exists' });
    }
  }
});


// Login  
app.post('/login', async (request, response) => {
  const { username, password } = request.body;
  const selectUserQuery = `SELECT * FROM users WHERE user_name = ?`;
  const dbUser = await db.get(selectUserQuery, [username]);

  if (dbUser === undefined) {
    response.status(400).json({ message: 'Invalid user' });
  } else {
    const isPasswordMatched = await bcrypt.compare(password, dbUser.password);
    if (isPasswordMatched) {
      const payload = { username, role: dbUser.role }; 
      const jwtToken = jwt.sign(payload, 'MY_SECRET_TOKEN');
      response.send({ jwt_token: jwtToken });
    } else {
      response.status(400).json({ message: 'Invalid password' });
    }
  }
});


// Authentication middleware
const authenticate = (request, response, next) => {
  let jwtToken;
  const authHeader = request.headers['authorization'];
  if (authHeader !== undefined) {
    jwtToken = authHeader.split(' ')[1];
  }
  if (jwtToken === undefined) {
    response.status(401);
    response.send('Invalid JWT Token');
  } else {
    jwt.verify(jwtToken, 'MY_SECRET_TOKEN', async (error, payload) => {
      if (error) {
        response.status(401);
        response.send('Invalid JWT Token');
      } else {
        request.username = payload.username;
        request.role = payload.role; 
        next();
      }
    });
  }
};


// Event api for both user and admin
app.get('/event/', authenticate, async (request, response) => {
  const getEventQuery = `
    SELECT 
      *
    FROM 
      event;`
  const eventList = await db.all(getEventQuery)
  response.send(eventList)
});

app.get('/event/:eventId/', authenticate, async (request, response) => {
  const {eventId} = request.params
  const getEventQuery = `
      SELECT 
        *
      FROM 
        event
      WHERE 
        event_id = ?;`;
    const eventIdList = await db.all(getEventQuery, [eventId]);
  response.send(eventIdList)
});

app.post('/event/register/', authenticate, async (request, response) => {
  let {username} = request
  const {
    eventId,
    eventTitle,
    eventGame,
    location,
    fullname,
    email,
    phone,
  } = request.body
  
  const checkRegistrationQuery = `
      SELECT *
      FROM eventregistration
      WHERE user_name = '${username}' AND event_id = ${eventId};
    `;

  const existingRegistration = await db.get(checkRegistrationQuery);

  if (existingRegistration) {
    return response.status(400).send('You have already registered for this event.');
  } else {
    const addRegisterQuery = `
    INSERT INTO
      eventregistration(event_id,user_name,full_name,email,phone_no,event_title,event_game,event_location)
    VALUES(
      ${eventId},
      '${username}',
      '${fullname}',
      '${email}',
      '${phone}',
      '${eventTitle}',
      '${eventGame}',
      '${location}'
    );`
    await db.run(addRegisterQuery)
    response.send('Event Registration is Done')
  }
});

app.post('/event', authenticate, async (request, response) => {
  const {
    eventName,
      eventImage,
      eventGameName,
      eventDate,
      eventLastDate,
      location,
  } = request.body

  if (
    !eventName ||
    !eventImage ||
    !eventGameName ||
    !eventDate ||
    !eventLastDate ||
    !location
  ) {
    return response.status(400).json({ message: 'All fields are required' })
  }

  try {
    const insertQuery = `
      INSERT INTO event (event_name, event_image, event_game_name, event_date, event_last_date, location)
      VALUES (?, ?, ?, ?, ?, ?);`

    const result = await db.run(insertQuery, [
      eventName, 
      eventImage, 
      eventGameName, 
      eventDate, 
      eventLastDate, 
      location
    ])

    response.status(201).json({
      message: 'Event created successfully',
      eventId: result.lastID,
    })
  } catch (error) {
    console.error('Error inserting event:', error)
    response.status(500).json({ message: 'Internal Server Error' })
  }
})

app.put('/event/:eventId', authenticate, async (request, response) => {
  const { eventId } = request.params
  const {
    eventName,
      eventImage,
      eventGameName,
      eventDate,
      eventLastDate,
      location,
  } = request.body

  if (
    !eventName ||
    !eventImage ||
    !eventGameName ||
    !eventDate ||
    !eventLastDate ||
    !location
  ) {
    return response.status(400).json({ message: 'All fields are required' })
  }

  try {
    const updateQuery = `
      UPDATE event
      SET event_name = ?, event_image = ?, event_game_name = ?, event_date = ?, event_last_date = ?, location = ?
      WHERE event_id = ?;`

    const result = await db.run(updateQuery, [
      eventName, 
      eventImage, 
      eventGameName, 
      eventDate, 
      eventLastDate, 
      location,
      eventId,
    ])

    if (result.changes > 0) {
      response.status(200).json({ message: 'Event updated successfully' })
    } else {
      response.status(404).json({ message: 'Event not found' })
    }
  } catch (error) {
    console.error('Error updating event:', error)
    response.status(500).json({ message: 'Internal Server Error' })
  }
})

app.delete('/event/:eventId', authenticate, async (request, response) => {
  const { eventId } = request.params

  try {
    const deleteQuery = `DELETE FROM event WHERE event_id = ?;`
    const result = await db.run(deleteQuery, [eventId])

    if (result.changes > 0) {
      response.status(200).json({ message: 'Event deleted successfully' })
    } else {
      response.status(404).json({ message: 'Event not found' })
    }
  } catch (error) {
    console.error('Error deleting event:', error)
    response.status(500).json({ message: 'Internal Server Error' })
  }
})


// Trailer api for both user and admin
app.get('/trailer/', authenticate, async (request, response) => {
  const getTrailerQuery = `
    SELECT 
      *
    FROM 
      trailers;`
  const trailerList = await db.all(getTrailerQuery)
  response.send(trailerList)
});

app.get('/trailer/:trailerId/', authenticate, async (request, response) => {
  const {trailerId} = request.params
  const getTrailerQuery = `
      SELECT 
        *
      FROM 
        trailers
      WHERE 
        trailer_id = ?;`;
    const trailerIdList = await db.all(getTrailerQuery, [trailerId]);
  response.send(trailerIdList)
});

app.post('/trailer/', authenticate, async (request, response) => {
  const { trailerTitle, trailerDescribe, trailerImage, trailerUrl, trailerDescription } = request.body;


  if (!trailerTitle || !trailerDescribe || !trailerImage || !trailerUrl || !trailerDescription) {
    return response.status(400).json({ message: 'All fields are required' });
  }

  try {
    const insertTrailerQuery = `
      INSERT INTO trailers (trailer_title, trailer_describe, trailer_image, trailer_url, trailer_description)
      VALUES (?, ?, ?, ?, ?);`;

    const result = await db.run(insertTrailerQuery, [
      trailerTitle, trailerDescribe, trailerImage, trailerUrl, trailerDescription
    ]);

    response.status(201).json({ trailerId: result.lastID, message: 'Trailer uploaded successfully' });
  } catch (error) {
    console.error('Error inserting trailer:', error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
});

app.put('/trailer/:trailerId/', authenticate, async (request, response) => {
  const { trailerId } = request.params;
  const { trailerTitle, trailerDescribe, trailerImage, trailerUrl, trailerDescription } = request.body;


  if (!trailerTitle || !trailerDescribe || !trailerImage || !trailerUrl || !trailerDescription) {
    return response.status(400).json({ message: 'All fields are required' });
  }

  try {
    const updateTrailerQuery = `
      UPDATE trailers
      SET trailer_title = ?, trailer_describe = ?, trailer_image = ?, trailer_url = ?, trailer_description = ?
      WHERE trailer_id = ?;`;

    const result = await db.run(updateTrailerQuery, [
      trailerTitle, trailerDescribe, trailerImage, trailerUrl, trailerDescription, trailerId
    ]);

    if (result.changes > 0) {
      response.status(200).json({ message: 'Trailer updated successfully' });
    } else {
      response.status(404).json({ message: 'Trailer not found' });
    }
  } catch (error) {
    console.error('Error updating trailer:', error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
});


app.delete('/trailer/:trailerId/', authenticate, async (request, response) => {
  const { trailerId } = request.params;

  try {
    const deleteTrailerQuery = `
      DELETE FROM trailers
      WHERE trailer_id = ?;`;

    const result = await db.run(deleteTrailerQuery, [trailerId]);

    if (result.changes > 0) {
      response.status(200).json({ message: 'Trailer deleted successfully' });
    } else {
      response.status(404).json({ message: 'Trailer not found' });
    }
  } catch (error) {
    console.error('Error deleting trailer:', error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
});


// Videos api for both user and admin
app.get('/video/', authenticate, async (request, response) => {
  const getVideoQuery = `
    SELECT 
      *
    FROM 
      videos;`
  const videoList = await db.all(getVideoQuery)
  response.send(videoList)
});

app.get('/video/:videoId/', authenticate, async (request, response) => {
  const {videoId} = request.params
  const getVideoQuery = `
      SELECT 
        *
      FROM 
        videos
      WHERE 
        video_id = ?;`;
    const videoIdList = await db.all(getVideoQuery, [videoId]);
  response.send(videoIdList)
});

app.post('/video/', authenticate, async (request, response) => {
  const { videoTitle, videoDescription, videoImage, videoUrl } = request.body;

  if (!videoTitle || !videoDescription || !videoImage || !videoUrl) {
    return response.status(400).json({ message: 'All fields are required' });
  }

  try {
    const insertVideoQuery = `
      INSERT INTO videos (video_title, video_description, video_image, video_url)
      VALUES (?, ?, ?, ?);`;

    const result = await db.run(insertVideoQuery, [
      videoTitle, videoDescription, videoImage, videoUrl
    ]);

    response.status(201).json({ videoId: result.lastID, message: 'Video uploaded successfully' });
  } catch (error) {
    console.error('Error inserting video:', error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
});


app.put('/video/:videoId/', authenticate, async (request, response) => {
  const { videoId } = request.params;
  const { videoTitle, videoDescription, videoImage, videoUrl } = request.body;

  if (!videoTitle || !videoDescription || !videoImage || !videoUrl) {
    return response.status(400).json({ message: 'All fields are required' });
  }

  try {
    const updateVideoQuery = `
      UPDATE videos
      SET video_title = ?, video_description = ?, video_image = ?, video_url = ?
      WHERE video_id = ?;`;

    const result = await db.run(updateVideoQuery, [
      videoTitle, videoDescription, videoImage, videoUrl, videoId
    ]);

    if (result.changes > 0) {
      response.status(200).json({ message: 'Video updated successfully' });
    } else {
      response.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    console.error('Error updating video:', error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
});

app.delete('/video/:videoId/', authenticate, async (request, response) => {
  const { videoId } = request.params;

  try {
    const deleteVideoQuery = `
      DELETE FROM videos
      WHERE video_id = ?;`;

    const result = await db.run(deleteVideoQuery, [videoId]);

    if (result.changes > 0) {
      response.status(200).json({ message: 'Video deleted successfully' });
    } else {
      response.status(404).json({ message: 'Video not found' });
    }
  } catch (error) {
    console.error('Error deleting video:', error);
    response.status(500).json({ message: 'Internal Server Error' });
  }
});


// Game Downloads api for both user and admin
app.get('/games',authenticate, async (request, response) => {
  try {
    const getAllGamesQuery = `SELECT * FROM games;`;
    const games = await db.all(getAllGamesQuery);
    response.status(200).json(games);
  } catch (error) {
    console.error('Error fetching games:', error);
    response.status(500).json({ message: 'Error fetching games', error: error.message });
  }
});


app.get('/download/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const getGameQuery = `SELECT * FROM games WHERE id = ?;`;
    const game = await db.get(getGameQuery, [id]);

    if (!game) {
      return res.status(404).send('Game not found');
    }

    const absolutePath = path.join(__dirname, game.filePath);
    console.log('File requested for download:', absolutePath);


    if (!fs.existsSync(absolutePath)) {
      return res.status(404).send('File not found on server');
    }

    res.setHeader('Content-Disposition', `attachment; filename="${game.game_name}.exe"`);

    res.setHeader('Content-Type', 'application/octet-stream');

    res.download(absolutePath, `${game.game_name}.exe`, (downloadErr) => {
      if (downloadErr) {
        console.error('Download error:', downloadErr.message);
        res.status(500).send('Error downloading file');
      }
    });
  } catch (error) {
    console.error('Unexpected error during download:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.post('/upload', authenticate, upload.single('file'), async (request, response) => {
  try {
    const { game_name, game_description, game_logo_url } = request.body; 
    const file = request.file;

    // Validate the request body
    if (!file || !game_name || !game_description || !game_logo_url) {
      return response.status(400).json({ message: 'Game name, description, logo URL, or file is missing' });
    }

    const filename = file.filename; 
    const originalname = file.originalname; 
    const filePath = path.join('upload_game_file', filename); 

    console.log('File uploaded:', {
      originalName: originalname,
      storedAs: filename,
      fullPath: path.join(__dirname, filePath),
    });

    const insertGameQuery = `
      INSERT INTO games (game_name, game_description, filePath, game_logo_url)
      VALUES (?, ?, ?, ?);
    `;
    await db.run(insertGameQuery, [game_name, game_description, filePath, game_logo_url]);

    response.status(200).json({ message: 'File uploaded and game details saved successfully' });
  } catch (error) {
    console.error('Unexpected error during upload:', error);
    response.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


app.put('/upload/:id', authenticate, upload.single('file'), async (request, response) => {
  try {
    const { id } = request.params;
    const { game_name, game_description, game_logo_url } = request.body; 
    const file = request.file;

    if (!game_name || !game_description || !game_logo_url) {
      return response.status(400).json({ message: 'Game name, description, or logo URL is missing' });
    }

    const getGameQuery = `SELECT * FROM games WHERE id = ?;`;
    const game = await db.get(getGameQuery, [id]);

    if (!game) {
      return response.status(404).json({ message: 'Game not found' });
    }

    const updatedGame = {
      game_name,
      game_description,
      game_logo_url,
      filePath: game.filePath, 
    };

    if (file) {
      const filename = file.filename;
      const filePath = path.join('upload_game_file', filename); 

      const oldFilePath = path.join(__dirname, game.filePath);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath); 
      }

      updatedGame.filePath = filePath;
    }

    const updateGameQuery = `
      UPDATE games
      SET game_name = ?, game_description = ?, game_logo_url = ?, filePath = ?
      WHERE id = ?;
    `;
    await db.run(updateGameQuery, [
      updatedGame.game_name,
      updatedGame.game_description,
      updatedGame.game_logo_url,
      updatedGame.filePath,
      id,
    ]);

    response.status(200).json({ message: 'Game updated successfully' });
  } catch (error) {
    console.error('Error updating game:', error);
    response.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.delete('/games/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const getGameQuery = `SELECT * FROM games WHERE id = ?;`;
    const game = await db.get(getGameQuery, [id]);

    if (!game) {
      return res.status(404).json({ message: 'Game not found' });
    }

    const deleteGameQuery = `DELETE FROM games WHERE id = ?;`;
    await db.run(deleteGameQuery, [id]);

    const filePath = path.join(__dirname, game.filePath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); 
    }

    res.status(200).json({ message: 'Game deleted successfully' });
  } catch (error) {
    console.error('Error deleting game:', error);
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});


// Products api for both user and admin
app.get('/products', authenticate, async (request, response) => {
  const { sort_by, category, title_search, rating } = request.query;

  let query = "SELECT * FROM products WHERE 1=1";
  const params = [];

  if (category) {
      query += " AND category = ?";
      params.push(category);
  }

  if (title_search) {
      query += " AND title LIKE ?";
      params.push(`%${title_search}%`);
  }

  if (rating) {
      query += " AND rating >= ?";
      params.push(parseFloat(rating));
  }

  if (sort_by === "PRICE_HIGH") {
      query += " ORDER BY price DESC";
  } else if (sort_by === "PRICE_LOW") {
      query += " ORDER BY price ASC";
  }

  
    const products = await db.all(query, params);
    response.json({ products });
  
});


app.get('/products/:id', authenticate, async (request, response) => {
  const { id } = request.params; 

  const getProductQuery = `
    SELECT 
      *
    FROM 
      products 
    WHERE 
      id = ?;`;

 
    const productData = await db.get(getProductQuery, [id]); 

    if (productData) {

      const getSimilarProductsQuery = `
        SELECT 
          *
        FROM 
          similar_products 
        WHERE 
          product_id = ?;`;

      const similarProducts = await db.all(getSimilarProductsQuery, [id]);

      response.send({
        productDetails: {
          ...productData,
          similar_products: similarProducts  
        }
      });
    } else {
      response.status(404).send({ message: 'Product not found' });
    }
 
});

app.post('/products', authenticate, async (request, response) => {
  const {
    title,
    description,
    price,
    imageUrl,
    brand,
    style,
    availability,
    rating,
    totalReviews,
    category,
  } = request.body;


  if (
    !title ||
    !description ||
    !price ||
    !imageUrl ||
    !brand ||
    !style ||
    !availability ||
    !rating ||
    !totalReviews ||
    !category
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const insertProductQuery = `
    INSERT INTO products (title, description, price, image_url, brand, style, availability, rating, total_reviews, category)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const params = [
    title,
    description,
    price,
    imageUrl,
    brand,
    style,
    availability,
    rating,
    totalReviews,
    category,
  ];

  try {
    const result = await db.run(insertProductQuery, params);
    response.status(201).json({ message: 'Product created successfully', productId: result.lastID });
  } catch (error) {
    console.error('Error creating product:', error);
    response.status(500).json({ message: 'Error creating product' });
  }
});


app.put('/products/:id', authenticate, async (request, response) => {
  const productId = req.params.id;
  const {
    title,
    description,
    price,
    imageUrl,
    brand,
    style,
    availability,
    rating,
    totalReviews,
    category,
  } = request.body;
 

  if (
    !title ||
    !description ||
    !price ||
    !imageUrl ||
    !brand ||
    !style ||
    !availability ||
    !rating ||
    !totalReviews ||
    !category
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const updateProductQuery = `
    UPDATE products
    SET title = ?, description = ?, price = ?, image_url = ?, brand = ?, style = ?, availability = ?, rating = ?, total_reviews = ?, category = ?
    WHERE id = ?
  `;

  const params = [
    title,
    description,
    price,
    imageUrl,
    brand,
    style,
    availability,
    rating,
    totalReviews,
    category,
    productId,
  ];

  try {
    const result = await db.run(updateProductQuery, params);

    if (result.changes === 0) {
      return response.status(404).json({ message: 'Product not found' });
    }

    response.json({ message: 'Product updated successfully' });
  } catch (error) {
    console.error('Error updating product:', error);
    response.status(500).json({ message: 'Error updating product' });
  }
});



app.delete('/products/:id', authenticate, async (request, response) => {
  const productId = request.params.id;

  const dbTransaction = async (productId) => {
    try {
      const deleteFromSimilarProductsQuery = 'DELETE FROM similar_products WHERE similar_product_id = ?';
      await db.run(deleteFromSimilarProductsQuery, [productId]);

      const deleteProductQuery = 'DELETE FROM products WHERE id = ?';
      const result = await db.run(deleteProductQuery, [productId]);

      if (result.changes === 0) {
        return { success: false, message: 'Product not found' };
      }

      return { success: true, message: 'Product and related similar products deleted successfully' };
    } catch (error) {
      console.error('Error during transaction:', error);
      throw new Error('Error deleting product and related similar products');
    }
  };

  try {
    const result = await dbTransaction(productId);

    if (!result.success) {
      return response.status(404).json({ message: result.message });
    }

    response.json({ message: result.message });
  } catch (error) {
    console.error('Error deleting product and related similar products:', error);
    response.status(500).json({ message: 'Error deleting product and related similar products' });
  }
});


// User Profile api
app.get('/myprofile/', authenticate, async (request, response) => {
  let {username} = request
  const getUserDetailsQuery = `
    SELECT full_name,user_name
      FROM users
      WHERE user_name = '${username}' AND role = 'user';`
  const userDetails = await db.get(getUserDetailsQuery)
  response.send(userDetails)
});


app.get('/myevent/', authenticate, async (request, response) => {
  const { username } = request;

  const getMyEventIdsQuery = `
    SELECT event_id
    FROM eventregistration
    WHERE user_name = ?;
  `;
  const eventIdRows = await db.all(getMyEventIdsQuery, [username]);

  const eventIds = eventIdRows.map(row => row.event_id);

  if (eventIds.length === 0) {
    return response.send([]); 
  }

  const placeholders = eventIds.map(() => '?').join(', ');

  const getUserEventsQuery = `
    SELECT *
    FROM event
    WHERE event_id IN (${placeholders});
  `;
  const userEvents = await db.all(getUserEventsQuery, eventIds);

  response.send(userEvents);
});


app.get('/myorders/', authenticate, async (request, response) => {
  const { username } = request;

  const getUserOrdersQuery = `
    SELECT * FROM orders WHERE user_name = ?;
  `;

  const userOrderList = await db.all(getUserOrdersQuery, [username]);

  const parsedOrders = userOrderList.map(order => ({
    ...order,
    order_items: JSON.parse(order.order_items),
  }));

  response.send(parsedOrders);
});


// Orders api only for admin
app.post('/orders', authenticate, async (request, response) => {
  const { name, address, phone, email, cartItems } = request.body;
  console.log( name, address, phone, email, cartItems )
  let totalAmount = 0;
  cartItems.forEach(item => {
    totalAmount += item.price * item.quantity;
  });

  let { username } = request;

  const orderItems = JSON.stringify(cartItems);

  try {
    const insertOrderQuery = `
      INSERT INTO orders (user_name, name, address, phone, email, total_amount, order_items)
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

    const result = await db.run(insertOrderQuery, [
      username, name, address, phone, email, totalAmount, orderItems
    ]);

    const orderId = result.lastID; 

    response.status(200).json({ orderId }); 
  } catch (error) {
    console.error('Error placing order:', error);
    response.status(500).json({ message: 'Error placing order. Please try again.' });
  }
});

app.get('/admin/orders', authenticate, async (request, response) => {
  const query = 'SELECT * FROM orders ORDER BY order_date DESC;';
  const orders = await db.all(query);
  response.status(200).json(orders);
});

app.put('/admin/orders/:id', authenticate, async (request, response) => {
  const { id } = request.params;
  const { name, address, status } = request.body;

  if (!name || !address || !status) {
    return response.status(400).json({ message: 'Name, address, and status are required.' });
  }

  const updateQuery = `
    UPDATE orders
    SET name = ?, address = ?, status = ?
    WHERE id = ?
  `;
  await db.run(updateQuery, [name, address, status, id]);
  response.status(200).json({ message: 'Order updated successfully' });
});


// Roles api manages by admin
app.get('/admin/users', authenticate, async (request, response) => {
  const users = await db.all(`SELECT * FROM users WHERE role = 'user'`);
  const admins = await db.all(
    `SELECT * FROM users WHERE role = 'admin' AND user_name != 'admin_01'`
  );
  response.json({ users, admins });
});

app.put('/admin/users/:user_id/role', authenticate, async (request, response) => {
  const { user_id } = request.params;
  const { newRole } = request.body;

  const user = await db.get(`SELECT * FROM users WHERE user_id = ?`, [user_id]);
  if (user.user_name === 'admin_01') {
    return response.status(403).json({ message: "Cannot change role of admin_01" });
  }

  if (newRole !== 'admin' && newRole !== 'user') {
    return response.status(400).json({ message: 'Invalid role specified' });
  }

  await db.run(`UPDATE users SET role = ? WHERE user_id = ?`, [newRole, user_id]);
  response.json({ message: 'Role updated successfully' });
});
