# minimalblog gruvbox
## [DEMO SITE](https://minimalscreen.com/)
A simple, yet overcomplicated blog with a gruvbox theme.

## features
- create blog articles
- markdown > html support for posting blog content
- user authentication for blog post creation
- automatic post updates and directory watching

## setup

### prerequisities

- Node.js
- npm
- python3 (3.12.4)

### installation

1. **clone repository**
`git clone https://github.com/omniXI/minimalblog.git && cd minimalblog`

2. **install dependencies**
`npm install`

3. **Generate a session secret and add it to your .env file**
```
npm run gensecret
cp .env.example .env
```
replace contents of **SESSION_SECRET** with the key you generated.

Change ADMIN_USERNAME & ADMIN_PASSWORD to your liking.

4. **Start server**
`npm start`

- visit `http://localhost:3000` to see the application
- create a blog post on `http://localhost:3000/create-post` (use your login credentials from .env file)

## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contributing
- If you have any issues or improvements that need to be made, please open an issue or submit a pull request.


I'm sure there are a million things to that can be improved, but it works

