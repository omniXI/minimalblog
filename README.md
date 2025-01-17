# minimalblog gruvbox
## [DEMO SITE](https://demo.minimalscreen.com/)
A simple, yet overcomplicated blog with a gruvbox theme.

## features
- create blog articles
- markdown > html support for posting blog content
- user authentication for blog post creation
- automatic post updates and directory watching

**features that may or may not be added**
- edit blog posts on site
- easily change theme
- tags and categories
- rss feed
- proper contact page

## setup

### prerequisities

- Node.js
- npm

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

## Pictures

### Home page
![](https://raw.githubusercontent.com/omniXI/minimalblog/main/images/home.png)

### Blog page
![](https://raw.githubusercontent.com/omniXI/minimalblog/main/images/blog.png)

### Create post page
![](https://raw.githubusercontent.com/omniXI/minimalblog/main/images/create-post.png)

### About me page
![](https://raw.githubusercontent.com/omniXI/minimalblog/main/images/about.png)


## License

[MIT](https://choosealicense.com/licenses/mit/)

## Contributing
- If you have any issues or improvements that need to be made, please open an issue or submit a pull request.


I'm sure there are a million things to that can be improved, but it works

