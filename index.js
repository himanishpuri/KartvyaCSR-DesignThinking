import express from "express";
import bodyParser from "body-parser";
import session from "express-session";

const app = express();
const port = 3000;

// Serve static files from public directory
app.use(express.static("public", {
    extensions: ['html', 'htm'],
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configure session middleware (optional for static files)

app.use(session({
    secret: 'your_secret_key', // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
}));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});
 
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
