// Initialize Supabase client
const supabaseUrl = 'https://pqmdbwgounwvqbcsbpyw.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBxbWRid2dvdW53dnFiY3NicHl3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE2MTYwODQsImV4cCI6MjA1NzE5MjA4NH0.izRzh8ZybyYEAxNrFKImellKnE_1beVbdPZVG6bOJng'; // Replace with your Supabase API Key
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

// Get DOM elements
const sendButton = document.getElementById('send-btn');
const messageInput = document.getElementById('message');
const usernameInput = document.getElementById('username');
const messagesContainer = document.getElementById('messages-container');

// Function to display messages in the UI
function displayMessages(messages) {
  messagesContainer.innerHTML = ''; // Clear current messages
  messages.forEach(msg => {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message');
    messageElement.textContent = `${msg.username}: ${msg.content}`;
    messagesContainer.appendChild(messageElement);
  });
  messagesContainer.scrollTop = messagesContainer.scrollHeight; // Auto-scroll to the latest message
}

// Fetch messages from Supabase and display them
async function loadMessages() {
  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error loading messages:', error);
    return;
  }

  displayMessages(data);
}

// Function to send a new message
async function sendMessage() {
  const username = usernameInput.value.trim();
  const messageContent = messageInput.value.trim();

  if (!username || !messageContent) {
    alert('Please enter a username and a message.');
    return;
  }

  const { data, error } = await supabase
    .from('messages')
    .insert([{ username, content: messageContent }]);

  if (error) {
    console.error('Error sending message:', error);
  } else {
    messageInput.value = ''; // Clear message input
    loadMessages(); // Reload messages after sending
  }
}

// Event listener for send button
sendButton.addEventListener('click', sendMessage);

// Listen for new messages in real-time
supabase
  .from('messages')
  .on('INSERT', payload => {
    console.log('New message received:', payload.new);
    loadMessages(); // Reload messages on new insert
  })
  .subscribe();

// Load messages when the app starts
loadMessages();
