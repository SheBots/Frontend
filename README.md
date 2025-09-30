# Chatbot UI

A modern, minimal chatbot interface built with React and Vite. Features real-time streaming responses, dark theme, and mobile-responsive design.

## Features

- **Real-time Streaming**: Server-sent events (SSE) for token-by-token response rendering
- **Modern UI**: Dark theme with rounded message bubbles and smooth animations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Accessibility**: ARIA live regions, keyboard navigation, and screen reader support
- **Connection Status**: Real-time backend connection monitoring
- **Copy to Clipboard**: Easy copying of assistant responses
- **Keyboard Shortcuts**: Enter to send, Shift+Enter for new lines
- **Error Handling**: Graceful fallbacks when backend is unavailable

## Quick Start

1. **Install dependencies:**

    ```bash
    npm install
    ```

2. **Start development server:**

    ```bash
    npm run dev
    ```

3. **Open your browser:**
    Navigate to [http://localhost:5173](http://localhost:5173)

## Configuration

### Environment Variables

Create a `.env` file in the root directory to configure the API endpoint:

```env
VITE_API_BASE=http://localhost:3000
```

If not set, defaults to `http://localhost:3000`.

### Backend API Requirements

The frontend expects a backend API with the following endpoints:

#### Health Check (Optional)

```http
GET /api/health
```

Returns 200 OK when backend is available.

#### Chat Endpoint

```http
POST /api/chat
Content-Type: application/json
Accept: text/event-stream

{
  "message": "Hello!",
  "messages": [...] // Previous conversation history
}
```

**Response**: Server-sent events stream

```text
data: {"token": "Hello"}
data: {"token": " there"}
data: {"token": "!"}
data: [DONE]
```

## Project Structure

```text
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── vite.config.js          # Vite configuration
├── src/
│   ├── main.jsx           # React app initialization
│   ├── App.jsx            # Main chat component
│   └── styles.css         # Complete styling
└── README.md              # This file
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Browser Support

- Chrome/Edge 88+
- Firefox 85+
- Safari 14+
- Mobile browsers with ES2020 support

## Accessibility Features

- ARIA live regions for screen reader announcements
- Semantic HTML structure
- Keyboard navigation support
- High contrast mode support
- Reduced motion preferences respected
- Focus management and visual indicators

## Customization

### Styling

All styles are in `src/styles.css`. Key CSS custom properties for theming:

- Background colors: `#0d1117`, `#161b22`, `#21262d`
- Text colors: `#e6edf3`, `#f0f6fc`, `#8b949e`
- Accent color: `#1f6feb`
- Error color: `#f85149`
- Success color: `#3fb950`

### API Integration

Modify the `handleSubmit` function in `App.jsx` to customize:

- Request format
- Response parsing
- Error handling
- Message history management

## Troubleshooting

### Backend Connection Issues

- Verify `VITE_API_BASE` is set correctly
- Check that backend server is running
- Ensure CORS is properly configured on backend
- Check browser console for network errors

### Styling Issues

- Clear browser cache after style changes
- Check for CSS specificity conflicts
- Verify viewport meta tag is present

### Performance

- Messages are stored in component state (will reset on refresh)
- Consider implementing pagination for long conversations
- Use React DevTools to monitor re-renders
