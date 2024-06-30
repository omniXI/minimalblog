import os
import json
from datetime import datetime

current_dir = os.path.dirname(os.path.abspath(__file__))
blog_posts_dir = os.path.join(current_dir, 'public', 'blog', 'posts')
posts = []

for post_dir in sorted(os.listdir(blog_posts_dir)):
    post_path = os.path.join(blog_posts_dir, post_dir, 'index.html')
    if os.path.isfile(post_path):
        with open(post_path, 'r') as file:
            content = file.read()
            title = content.split('<h1>')[1].split('</h1>')[0]
            excerpt = content.split('<aside>')[1].split('</aside>')[0]
            timestamp = os.path.getmtime(post_path)
            date = datetime.fromtimestamp(timestamp).strftime('%d %b %y')
            posts.append({
                'title': title,
                'date': date,
                'excerpt': excerpt,
                'path': f'{post_dir}/'
            })

with open(os.path.join(current_dir, 'public', 'blog', 'posts.json'), 'w') as file:
    json.dump(posts, file, indent=4)

