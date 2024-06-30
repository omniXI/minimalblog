const fs = require('fs');
const path = require('path');
const marked = require('marked');

// Function to update the posts.json file
const updatePosts = () => {
    const postsDir = path.join(__dirname, 'public', 'blog', 'posts');
    const postsFile = path.join(__dirname, 'public', 'blog', 'posts.json');

    fs.readdir(postsDir, (err, files) => {
        if (err) {
            console.error('Error reading posts directory:', err);
            return;
        }

        const posts = files.filter(file => fs.statSync(path.join(postsDir, file)).isDirectory())
                           .map(dir => {
                               const indexPath = path.join(postsDir, dir, 'index.html');
                               const content = fs.readFileSync(indexPath, 'utf-8');
                               const titleMatch = content.match(/<h1>(.*?)<\/h1>/);
                               const subheaderMatch = content.match(/<aside>(.*?)<\/aside>/);
                               return {
                                   title: titleMatch ? titleMatch[1] : 'Untitled',
                                   subheader: subheaderMatch ? subheaderMatch[1] : '',
                                   path: path.join(dir, 'index.html')
                               };
                           });

        fs.writeFile(postsFile, JSON.stringify(posts, null, 2), (err) => {
            if (err) {
                console.error('Error writing posts.json:', err);
                return;
            }
            console.log('posts.json updated successfully.');
        });
    });
};

// Export the function
module.exports = updatePosts;

