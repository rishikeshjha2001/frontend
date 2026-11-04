'use client';
import { useState } from 'react';

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, content: string}[]>([
    { role: 'assistant', content: 'Hi there! I am your happylokam AI assistant. How can I help you plan your celebration today?' }
  ]);
  const [input, setInput] = useState('');

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    try {
      const res = await fetch('/api/v1/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg.content }),
      });
      const data = await res.json();
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply || data.response || 'I am here to help you plan your perfect event!' }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Oops! Something went wrong.' }]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div className="bg-white rounded-2xl shadow-xl w-80 h-96 mb-4 flex flex-col border border-gray-100 overflow-hidden">
          <div className="bg-rose-600 text-white p-4 font-semibold flex justify-between items-center">
            <span>happylokam AI</span>
            <button onClick={() => setIsOpen(false)} className="text-white hover:text-rose-200">&times;</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3">
            {messages.map((msg, i) => (
              <div key={i} className={`p-3 rounded-lg max-w-[85%] text-sm ${msg.role === 'user' ? 'bg-rose-600 text-white self-end' : 'bg-white border text-gray-800 self-start'}`}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="p-3 bg-white border-t flex gap-2">
            <input 
              className="flex-1 border rounded-full px-4 py-2 text-sm focus:outline-none focus:border-rose-600" 
              placeholder="Ask me anything..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button onClick={sendMessage} className="bg-rose-600 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-rose-700">Send</button>
          </div>
        </div>
      )}
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-14 h-14 bg-rose-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-rose-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-7 h-7">
          {isOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
          )}
        </svg>
      </button>
    </div>
  );
}
