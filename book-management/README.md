# Book Management System

This is a simple book management project made using HTML, CSS, JavaScript, Node.js and Express.

You can:
- View books
- Add a book
- Edit a book
- Delete a book

## How to run

1. Open the folder in VS Code.
2. Open the terminal.
3. Type `npm install` and press Enter.
4. Type `npm start` and press Enter.
5. Open `http://localhost:3000` in your browser.

## Files

- `server.js` - backend and book API
- `public/index.html` - page structure
- `public/style.css` - page design
- `public/script.js` - buttons and API calls

The books are stored in an array in `server.js`. Any changes will reset when the server is restarted.

API routes: GET `/books`, GET `/books/:id`, POST `/books`, PUT `/books/:id`, DELETE `/book/:id`.
