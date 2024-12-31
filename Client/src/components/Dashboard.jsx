import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate , Link } from "react-router-dom";
import { Send, Globe2, Lock, User } from "lucide-react";

function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const navigate = useNavigate();

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("https://postify-karan.onrender.com/view-posts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPosts(response.data.posts);
    } catch (err) {
      alert("Error fetching posts");
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://postify-karan.onrender.com/create-post",
        { content, isPublic },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setContent("");
      fetchPosts();
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);
  const Logout = () =>{
    localStorage.clear();
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <div className="flex items-center space-x-4">
            <Link to="/">
            <button className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500" onClick={Logout}>
              <User className="w-4 h-4 mr-2" />
              LogOut
            </button>
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
          <form onSubmit={handleCreatePost}>
            <textarea
              placeholder="What's on your mind?"
              className="w-full p-4 text-gray-700 bg-gray-50 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition duration-200 resize-none"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            ></textarea>
            <div className="flex items-center justify-between mt-4">
              <label className="flex items-center space-x-2 text-sm text-gray-600 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                />
                <span>Make this post public</span>
                {isPublic ? (
                  <Globe2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-500" />
                )}
              </label>
              <button
                type="submit"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Send className="w-4 h-4 mr-2" />
                Post
              </button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-gray-900">Recent Posts</h2>
          {posts.map((post) => (
            <div
              key={post._id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 transition duration-200 hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                      {post.userId.username.charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {post.userId.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date().toLocaleDateString()}
                    </p>
                  </div>
                </div>
                {post.isPublic ? (
                  <Globe2 className="w-4 h-4 text-green-500" />
                ) : (
                  <Lock className="w-4 h-4 text-gray-500" />
                )}
              </div>
              <p className="mt-4 text-gray-700 whitespace-pre-wrap">
                {post.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;