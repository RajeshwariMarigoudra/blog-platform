// controllers/blogController.js
const Blog = require('../models/Blog');

// Create a new blog
const createBlog = async (req, res) => {
    const { title, content } = req.body;

    try {
        const blog = new Blog({
            title,
            content,
            author: req.user._id,
        });
        await blog.save();
        res.status(201).json(blog);
    } catch (error) {
        res.status(400).json({ message: 'Blog creation failed' });
    }
};

// Get all blogs
const getAllBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find().populate('author', 'username');
        res.json(blogs);
    } catch (error) {
        res.status(400).json({ message: 'Failed to retrieve blogs' });
    }
};

// Get a single blog
const getBlogById = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id).populate('author', 'username');
        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: 'Blog not found' });
    }
};

// Update a blog
const updateBlog = async (req, res) => {
    const { title, content } = req.body;

    try {
        const blog = await Blog.findById(req.params.id);

        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        blog.title = title;
        blog.content = content;
        await blog.save();

        res.json(blog);
    } catch (error) {
        res.status(400).json({ message: 'Blog update failed' });
    }
};

// Delete a blog
const deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);

        if (blog.author.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        await blog.remove();
        res.json({ message: 'Blog deleted' });
    } catch (error) {
        res.status(400).json({ message: 'Blog deletion failed' });
    }
};

module.exports = { createBlog, getAllBlogs, getBlogById, updateBlog, deleteBlog };
