import React, { useState } from 'react';

const ChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');

  const toggleChat = () => setOpen(!open);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    try {
      // Đẩy tin nhắn người dùng vào trước
      setMessages(prev => [...prev, { from: 'user', text: input }]);

      const res = await fetch('https://localhost:7235/api/Ai/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(input)
      });

      const data = await res.json();
      
      // Lấy phần trả lời từ API
      const aiReply = data.candidates[0].content.parts[0].text;

      // Đẩy tin nhắn AI vào
      setMessages(prev => [...prev, { from: 'ai', text: aiReply }]);
      setInput('');
    } catch (err) {
      console.error("Server trả lỗi:", err);
    }
  };

  return (
    <>
      {open && (
        <div style={{
          position: 'fixed',
          bottom: 80,
          right: 20,
          width: 400,
          height: 550,
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.3s ease-out',
          zIndex: 9999,
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            padding: '16px 20px',
            fontSize: '16px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={toggleChat}
              style={{
                background: 'none',
                border: 'none',
                color: '#fff',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px',
                borderRadius: '4px',
                opacity: 0.8
              }}
            >
              ×
            </button>
          </div>

          {/* Messages Area */}
          <div style={{ 
            flex: 1, 
            padding: '20px', 
            overflowY: 'auto',
            background: '#f8fafc'
          }}>
            {messages.length === 0 && (
              <div style={{
                textAlign: 'center',
                color: '#64748b',
                fontSize: '14px',
                marginTop: '40px'
              }}>
                Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?
              </div>
            )}
            {messages.map((msg, idx) => (
              <div key={idx} style={{
                display: 'flex',
                marginBottom: 16,
                justifyContent: msg.from === 'user' ? 'flex-end' : 'flex-start'
              }}>
                {msg.from === 'ai' && (
                  <div style={{
                    width: 32,
                    height: 32,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '50%',
                    marginRight: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#fff',
                    fontSize: '14px',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    AI
                  </div>
                )}
                <div style={{
                  maxWidth: '75%',
                  padding: '12px 16px',
                  borderRadius: msg.from === 'user' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                  background: msg.from === 'user' 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : '#fff',
                  color: msg.from === 'user' ? '#fff' : '#1e293b',
                  fontSize: '14px',
                  lineHeight: '1.4',
                  boxShadow: msg.from === 'user' 
                    ? '0 2px 8px rgba(102, 126, 234, 0.3)'
                    : '0 2px 8px rgba(0, 0, 0, 0.1)',
                  wordWrap: 'break-word'
                }}>
                  {msg.text}
                </div>
                {msg.from === 'user' && (
                  <div style={{
                    width: 32,
                    height: 32,
                    background: '#e2e8f0',
                    borderRadius: '50%',
                    marginLeft: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#64748b',
                    fontSize: '14px',
                    fontWeight: '600',
                    flexShrink: 0
                  }}>
                    You
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Input Area */}
          <div style={{ 
            display: 'flex', 
            padding: '16px 20px', 
            borderTop: '1px solid #e2e8f0',
            background: '#fff'
          }}>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Nhập tin nhắn của bạn..."
              onKeyPress={(e) => e.key === 'Enter' && sendMessage(e)}
              style={{
                flex: 1,
                padding: '12px 16px',
                borderRadius: '24px',
                border: '2px solid #e2e8f0',
                marginRight: 8,
                fontSize: '14px',
                outline: 'none',
                fontFamily: 'inherit',
                transition: 'border-color 0.2s',
                background: '#f8fafc'
              }}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
            <button onClick={sendMessage} style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              border: 'none',
              borderRadius: '24px',
              padding: '12px 20px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              transition: 'transform 0.2s, box-shadow 0.2s',
              fontFamily: 'inherit',
              boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 2px 8px rgba(102, 126, 234, 0.3)';
            }}
            >
              Gửi
            </button>
          </div>
        </div>
      )}

      <button
        onClick={toggleChat}
        style={{
          position: 'fixed',
          bottom: 20,
          right: 20,
          width: 64,
          height: 64,
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 8px 16px rgba(102, 126, 234, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 0,
          zIndex: 9999,
          transition: 'transform 0.2s, box-shadow 0.2s'
        }}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.05)';
          e.target.style.boxShadow = '0 12px 24px rgba(102, 126, 234, 0.4)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 16px rgba(102, 126, 234, 0.3)';
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="32" width="32" fill="#fff" viewBox="0 0 24 24">
          <path d="M12 3C6.48 3 2 6.97 2 12c0 1.86.63 3.58 1.69 5L2 21l4.34-1.38C8.42 20.37 10.16 21 12 21c5.52 0 10-3.97 10-9s-4.48-9-10-9z"/>
        </svg>
      </button>

      <style>{`
        @keyframes fadeIn {
          from { 
            opacity: 0; 
            transform: translateY(20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
      `}</style>
    </>
  );
};

export default ChatWidget;