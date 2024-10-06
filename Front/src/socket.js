let ws = null;

export const connectWebSocket = (onMessageCallback) => {
    try
    {
        const wsConnected = localStorage.getItem('wsConnected') === 'true';
        
        if(!wsConnected || ws === null || ws.readyState === WebSocket.CLOSED)
        {
            ws = new WebSocket('ws://localhost:8081');
            localStorage.setItem('wsConnected', true);
        }

        ws.onmessage = (event) =>
            {
                const message = JSON.parse(event.data);
                console.log('WebSocket received message:', message);
                if (onMessageCallback)
                {
                    onMessageCallback(message); 
                }
            }
        
        ws.onclose = () => {
            localStorage.removeItem('ws');
            console.log('WebSocket connection closed');
        };
        
        ws.onerror = (error) => {
            console.error('WebSocket error:', error);
        };
    }
    catch(error)
    {
        console.error('WebSocket error:', error);
    }
    
  return true;
};

export const closeWebSocket = () => {
  if (ws) {
    ws.close();
    ws = null;
  }
};

export const sendWebSocketMessage = (message) => {
  if (ws) {
    ws.send(JSON.stringify(message));
    console.log('WebSocket sent message:', message);
  }
};