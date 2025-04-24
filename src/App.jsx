import React, { useEffect, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from 'react-markdown';

const App = () => {
  const [count, setCount] = useState(0);
  const [message, setMessage] = useState([
    {
      role: "model",
      content: "Hello, how can I help you today?",
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const API_KEY = "AIzaSyB2Q6KSWxA1QHyhHzZ7PIc5T3MopPaiLRo";
  const genAI = new GoogleGenerativeAI(API_KEY);

  const handleSubmit = async () => {
    if (!inputText.trim()) return;

    setIsLoading(true);
    // Add user message
    setMessage((prev) => [...prev, { role: "user", content: inputText }]);

    try {
      // Generate content using Gemini
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-pro-latest" },
        { apiVersion: "v1beta" }
      );

      const result = await model.generateContent(inputText);
      const response = await result.response;
      const text = response.text();

      // Add model response
      setMessage((prev) => [...prev, { role: "model", content: text }]);
      setInputText("");
    } catch (error) {
      console.error("Error generating response:", error);
      setMessage((prev) => [...prev, { role: "model", content: "Sorry, there was an error generating the response." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg">
        <div className="h-[500px] md:h-[600px] lg:h-[700px] flex flex-col w-full p-4 overflow-y-auto">
          {message.map((message, index) => (
            <div
              key={index}
              className={`mb-4 p-4 rounded-lg ${
                message.role === "model" ? "self-start bg-blue-50 border border-blue-200" : "self-end bg-gray-50 border border-gray-200"
              } max-w-[80%] sm:max-w-[70%] md:max-w-[60%] break-words overflow-wrap-anywhere`}
            >
              <div className={`prose prose-sm sm:prose lg:prose-lg ${message.role === "model" ? "text-blue-800" : "text-gray-800"} overflow-hidden`}>
                <ReactMarkdown
                  components={{
                    code: ({node, inline, className, children, ...props}) => (
                      <code className="bg-gray-800 text-white p-2 rounded text-sm sm:text-base break-all whitespace-pre-wrap" {...props}>
                        {children}
                      </code>
                    ),
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="self-start bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <div className="flex items-center space-x-2">
                <div className="animate-bounce h-2 w-2 bg-blue-500 rounded-full"></div>
                <div className="animate-bounce h-2 w-2 bg-blue-500 rounded-full" style={{animationDelay: '0.2s'}}></div>
                <div className="animate-bounce h-2 w-2 bg-blue-500 rounded-full" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 flex gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Send a message..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
            onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
            disabled={isLoading}
          />
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <svg className="animate-spin h-5 w-5 sm:h-6 sm:w-6" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                className="sm:w-6 sm:h-6"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M7 11L12 6L17 11M12 18V7"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default App;