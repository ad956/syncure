# Novu Setup for Chat Notifications

## 1. Create Novu Account
- Go to https://novu.co and create account
- Get your API key from Settings > API Keys

## 2. Environment Variables
Add to `.env.local`:
```
NOVU_API_KEY=your_api_key_here
```

## 3. Create Workflow in Novu Dashboard
1. Go to Workflows in Novu dashboard
2. Click "Create Workflow"
3. Choose "Blank Workflow"
4. Set workflow identifier: `chat-message`
5. Add "In-App" step:
   - Subject: `New message from {{senderName}}`
   - Body: `{{message}}`
6. Save workflow

## 4. Test
- Send a message in chat
- Check Novu dashboard Activity Feed for triggered notifications
- Notifications will appear in Novu's notification center