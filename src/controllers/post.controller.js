const postService = require("../services/post.service");
const interactionService = require("../services/interaction.service");
const jwt = require("jsonwebtoken");
const env = require("../configs/env.config");

const getCurrentUserId = (req) => {
  if (req.user) return req.user.id;
  const authHeader = req.headers.authorization;
  if (authHeader) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, env.jwt.accessSecret);
      return decoded.id;
    } catch (e) {}
  }
  if (req.query.currentUserId) return parseInt(req.query.currentUserId);
  return null;
};

const getAll = async (req, res, next) => {
  try {
    const page = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const currentUserId = getCurrentUserId(req);

    const result = await postService.getAllPosts(page, pageSize, currentUserId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const currentUserId = getCurrentUserId(req);

    const post = await postService.getPostById(id, currentUserId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(200).json(post);
  } catch (error) {
    next(error);
  }
};

const getByUserId = async (req, res, next) => {
  try {
    const userId = parseInt(req.params.userId);
    const page = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const currentUserId = getCurrentUserId(req);

    const result = await postService.getPostsByUserId(
      userId,
      page,
      pageSize,
      currentUserId
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const getByCompanyId = async (req, res, next) => {
  try {
    const companyId = parseInt(req.params.companyId);
    const page = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const currentUserId = getCurrentUserId(req);

    const result = await postService.getPostsByCompanyId(
      companyId,
      page,
      pageSize,
      currentUserId
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const create = async (req, res, next) => {
  try {
    const userId = getCurrentUserId(req);

    if (!userId && !req.body.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const postData = {
      content: req.body.content,
      userId: req.body.userId ? parseInt(req.body.userId) : userId || 0,
      companyId: req.body.companyId ? parseInt(req.body.companyId) : null,
    };

    const result = await postService.createPost(postData, req.files);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const update = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const userId = getCurrentUserId(req);

    const postData = {
      content: req.body.content,
      userId: req.body.userId || userId,
      companyId: req.body.companyId,
    };

    let keepImageUrls = [];
    
    if (req.body.keepImageUrls) {
      keepImageUrls = Array.isArray(req.body.keepImageUrls)
        ? req.body.keepImageUrls
        : [req.body.keepImageUrls];
    } else if (req.body["keepImageUrls[]"]) {
      keepImageUrls = Array.isArray(req.body["keepImageUrls[]"])
        ? req.body["keepImageUrls[]"]
        : [req.body["keepImageUrls[]"]];
    }

    const result = await postService.updatePost(id, postData, req.files, keepImageUrls);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);

    const result = await postService.deletePost(id);
    if (!result) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

const getComments = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const page = parseInt(req.query.pageNumber) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    const result = await interactionService.getCommentsByPostId(
      id,
      page,
      pageSize
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const toggleLike = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const userId = getCurrentUserId(req);

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    const result = await interactionService.toggleLike(id, userId);
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const addComment = async (req, res, next) => {
  try {
    const id = parseInt(req.params.id);
    const userId = req.body.userId || getCurrentUserId(req);
    const content = req.body.content;

    if (!content) {
      return res.status(400).json({ message: "Comment content is required" });
    }
    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    const result = await interactionService.addComment(
      id,
      userId,
      content,
      req.files
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const updateComment = async (req, res, next) => {
  try {
    const commentId = parseInt(req.params.commentId);
    const userId = req.body.userId || getCurrentUserId(req);
    const content = req.body.content;
    // keepImageUrls is sent as array: keepImageUrls[]
    const keepImageUrls = req.body["keepImageUrls[]"]
      ? Array.isArray(req.body["keepImageUrls[]"])
        ? req.body["keepImageUrls[]"]
        : [req.body["keepImageUrls[]"]]
      : [];

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    const result = await interactionService.updateComment(
      commentId,
      userId,
      content,
      req.files,
      keepImageUrls
    );
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

const deleteComment = async (req, res, next) => {
  try {
    const commentId = parseInt(req.params.commentId);
    const userId = parseInt(req.query.userId) || getCurrentUserId(req);

    if (!userId) {
      return res.status(400).json({ message: "UserId is required" });
    }

    const result = await interactionService.deleteComment(commentId, userId);
    if (!result) {
      return res.status(404).json({
        message: "Comment not found or you don't have permission to delete",
      });
    }
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAll,
  getById,
  getByUserId,
  getByCompanyId,
  create,
  update,
  deletePost,
  getComments,
  toggleLike,
  addComment,
  updateComment,
  deleteComment,
};
