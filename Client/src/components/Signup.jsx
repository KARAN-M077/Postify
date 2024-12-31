import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("https://postify-rdf5.onrender.com/signup", {
        username,
        email,
        password,
      });
      alert("User registered successfully!");
      navigate("/login");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-200">
      <div className="w-3/6 shadow-lg px-6 py-7 rounded overflow-hidden bg-white">
        <h2 className="text-2xl uppercase font-medium mb-1">Signup</h2>
        <p className="text-gray-600 mb-6 text-sm">
          Create your account to get started!
        </p>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="space-y-2">
            <div>
              <label
                htmlFor="username"
                className="text-gray-600 mb-2 block"
              ></label>
              Username
              <input
                type="text"
                name="username"
                id="username"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-teal-500 placeholder-gray-400"
                placeholder="Your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <label
                htmlFor="email"
                className="text-gray-600 mb-2 block"
              ></label>
              Email address
              <input
                type="email"
                name="email"
                id="email"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-teal-500 placeholder-gray-400"
                placeholder="youremail@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <div>
              <label
                htmlFor="password"
                className="text-gray-600 mb-2 block"
              ></label>
              Password
              <input
                type="password"
                name="password"
                id="password"
                className="block w-full border border-gray-300 px-4 py-3 text-gray-600 text-sm rounded focus:ring-0 focus:border-teal-500 placeholder-gray-400"
                placeholder="***********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              type="submit"
              className="block w-full py-2 text-center text-white bg-teal-500 border border-teal-500 rounded hover:bg-transparent hover:text-teal-500 transition uppercase font-roboto font-medium"
            >
              Signup
            </button>
            <div className="flex gap-2 pt-5">
              <p className="text-gray-600 text-sm">Already have an account?</p>
              <a className="text-gray-600 text-sm underline" href="/login">
                Login here
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signup;
