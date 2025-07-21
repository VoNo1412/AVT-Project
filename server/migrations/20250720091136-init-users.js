module.exports = {
  async up(db, client) {
    await db.collection('categories').insertMany([
      { name: 'Politics', description: 'Political news and updates' },
      { name: 'Business', description: 'Business and economy news' },
      { name: 'Technology', description: 'Tech innovations and trends' },
      { name: 'Entertainment', description: 'Movies, music, and celebrities' },
      { name: 'Sports', description: 'Sports events and highlights' },
    ]);

    const bcrypt = require('bcryptjs');
    const users = await db.collection('users').insertMany([
      {
        email: 'admin@example.com',
        password: await bcrypt.hash('admin123', 10),
        role: 'admin',
        preferences: { categories: ['Politics', 'Business'], notifications: true },
      },
      {
        email: 'editor@example.com',
        password: await bcrypt.hash('editor123', 10),
        role: 'editor',
        preferences: { categories: ['Technology'], notifications: true },
      },
      {
        email: 'user@example.com',
        password: await bcrypt.hash('user123', 10),
        role: 'registered',
        preferences: { categories: ['Sports'], notifications: false },
      },
    ]);

    const articles = await db.collection('articles').insertMany([
      {
        title: 'New Political Reform Announced',
        author: 'John Doe',
        category: 'Politics',
        tags: ['politics', 'reform'],
        content: 'A major political reform was announced today by the government...',
        featuredImage: 'https://images.unsplash.com/photo-1682687221006-b7fd60cf9dd0?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDF8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwxfHx8ZW58MHx8fHx8',
        seo: {
          title: 'Political Reform 2025',
          description: 'Read about the latest political reform in 2025.',
          keywords: ['politics', 'reform', '2025'],
        },
      },
      {
        title: 'Tech Breakthrough in AI',
        author: 'Jane Smith',
        category: 'Technology',
        tags: ['ai', 'technology'],
        content: 'A new AI breakthrough has revolutionized the industry...',
        featuredImage: 'https://plus.unsplash.com/premium_photo-1752658399836-07566560b88f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxmZWF0dXJlZC1waG90b3MtZmVlZHwyfHx8ZW58MHx8fHx8',
        seo: {
          title: 'AI Breakthrough 2025',
          description: 'Latest AI innovations in 2025.',
          keywords: ['ai', 'technology', 'innovation'],
        },
      },
    ]);

    const comments = await db.collection('comments').insertMany([
      {
        article: articles.insertedIds[0],
        user: users.insertedIds[2],
        content: 'Great article! Looking forward to more updates.',
        approved: true,
      },
      {
        article: articles.insertedIds[1],
        user: users.insertedIds[1],
        content: 'Interesting insights on AI. Needs more details.',
        approved: false,
      },
    ]);

    // Cập nhật tham chiếu bài viết với bình luận
    await db.collection('articles').updateMany(
      { _id: { $in: [articles.insertedIds[0], articles.insertedIds[1]] } },
      { $push: { comments: { $each: [comments.insertedIds[0], comments.insertedIds[1]] } } }
    );
  },

  async down(db, client) {
    await db.collection('comments').deleteMany({});
    await db.collection('articles').deleteMany({});
    await db.collection('users').deleteMany({});
    await db.collection('categories').deleteMany({});
  },
};