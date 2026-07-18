'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';
import { FiCpu, FiSend, FiRefreshCw, FiTag, FiMessageCircle } from 'react-icons/fi';

export default function AIPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('generate');
  const [topic, setTopic] = useState('');
  const [length, setLength] = useState('medium');
  const [content, setContent] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [classification, setClassification] = useState(null);
  const [classifying, setClassifying] = useState(false);

  // Check session
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await authClient.getSession();
        if (!data) {
          router.push('/login');
          return;
        }
        setSession(data);
      } catch (error) {
        console.error('Session check error:', error);
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, [router]);

  const handleGenerateContent = async () => {
    if (!topic) return;
    setGenerating(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/generate-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          type: 'description',
          length
        }),
      });
      const data = await response.json();
      setContent(data);
    } catch (error) {
      console.error('Error generating content:', error);
    } finally {
      setGenerating(false);
    }
  };

  const handleChat = async () => {
    if (!chatMessage) return;
    setChatLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: chatMessage,
          history: chatHistory
        }),
      });
      const data = await response.json();
      setChatHistory([...chatHistory, { role: 'user', content: chatMessage }, { role: 'assistant', content: data.reply }]);
      setChatMessage('');
    } catch (error) {
      console.error('Error in chat:', error);
    } finally {
      setChatLoading(false);
    }
  };

  const handleClassify = async () => {
    if (!topic) return;
    setClassifying(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai/classify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: topic,
          description: content?.description || 'Sample description'
        }),
      });
      const data = await response.json();
      setClassification(data);
    } catch (error) {
      console.error('Error in classification:', error);
    } finally {
      setClassifying(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-16 min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="pt-16 min-h-screen bg-gray-50">
      <div className="container-custom py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">AI Tools</h1>
          <p className="text-gray-600 mt-2">Powered by artificial intelligence</p>
        </div>

        <div className="flex flex-wrap gap-2 mb-8 justify-center">
          {[
            { id: 'generate', label: 'Content Generator', icon: FiCpu },
            { id: 'chat', label: 'Chat Assistant', icon: FiMessageCircle },
            { id: 'classify', label: 'Classification', icon: FiTag }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content Generator */}
        {activeTab === 'generate' && (
          <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">AI Content Generator</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Topic
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter a topic..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Length
                </label>
                <select
                  value={length}
                  onChange={(e) => setLength(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
              <button
                onClick={handleGenerateContent}
                disabled={!topic || generating}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {generating ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FiSend className="w-5 h-5" />
                    <span>Generate Content</span>
                  </>
                )}
              </button>
            </div>

            {content && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold">{content.title}</h3>
                  <button
                    onClick={handleGenerateContent}
                    className="text-primary hover:text-primary/80"
                  >
                    <FiRefreshCw className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-gray-600">{content.description}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {content.tags?.map((tag, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chat Assistant */}
        {activeTab === 'chat' && (
          <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">AI Chat Assistant</h2>
            
            <div className="h-96 overflow-y-auto mb-4 p-4 bg-gray-50 rounded-lg">
              {chatHistory.length === 0 ? (
                <div className="text-center text-gray-500 py-12">
                  <FiMessageCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>Ask me anything about your projects!</p>
                </div>
              ) : (
                chatHistory.map((msg, index) => (
                  <div
                    key={index}
                    className={`mb-4 ${msg.role === 'user' ? 'text-right' : ''}`}
                  >
                    <div
                      className={`inline-block p-3 rounded-lg max-w-[80%] ${
                        msg.role === 'user'
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))
              )}
              {chatLoading && (
                <div className="text-left">
                  <div className="inline-block p-3 bg-gray-200 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleChat()}
                placeholder="Type your message..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                disabled={chatLoading}
              />
              <button
                onClick={handleChat}
                disabled={!chatMessage || chatLoading}
                className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Classification */}
        {activeTab === 'classify' && (
          <div className="bg-white rounded-xl shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-xl font-semibold mb-4">AI Auto Classification</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Item Title
                </label>
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="Enter item title..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              <button
                onClick={handleClassify}
                disabled={!topic || classifying}
                className="w-full bg-primary text-white py-3 rounded-lg font-semibold hover:bg-opacity-90 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              >
                {classifying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Classifying...</span>
                  </>
                ) : (
                  <>
                    <FiTag className="w-5 h-5" />
                    <span>Classify Item</span>
                  </>
                )}
              </button>
            </div>

            {classification && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Classification Result</h3>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm text-gray-500">Category:</span>
                    <div className="font-medium text-lg text-primary">{classification.category}</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Confidence:</span>
                    <div className="font-medium">{(classification.confidence * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">Tags:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {classification.tags.map((tag, index) => (
                        <span key={index} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}