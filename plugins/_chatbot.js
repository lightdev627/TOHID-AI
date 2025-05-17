import fetch from "node-fetch";  // node-fetch for making API requests

export async function before(message, { conn }) {
  console.log("Chatbot feature is active.");
  
  try {
    console.log("Received message object:", JSON.stringify(message, null, 2));
    
    // Skip messages sent by the bot or system messages
    if (message.isBaileys || message.fromMe) {
      console.log("Message from bot itself or Baileys, skipping.");
      return true;
    }

    const irrelevantTypes = ["protocolMessage", "pollUpdateMessage", "reactionMessage", "stickerMessage"];
    
    // Skip irrelevant message types
    if (irrelevantTypes.includes(message.mtype)) {
      console.log("Irrelevant message type, skipping.");
      return true;
    }

    // Skip if there's no text content
    if (!message.text) {
      console.log("No text in the message.");
      return true;
    }

    // Fetch the chatbot settings for this chat
    const chatSettings = global.db.data.chats[message.chat] || {};
    const chatbotEnabled = chatSettings.chatbot || false;
    
    // Define the owner's number
    const ownerNumber = global.owner[0];

    // Only process if chatbot is enabled or the message is from the owner
    if (chatbotEnabled || message.sender === ownerNumber) {
      console.log("Processing message from user or owner.");
      const encodedMessage = encodeURIComponent(message.text);
      console.log("Message to process:", encodedMessage);

      // Function to send the message to the API
      const getAIResponse = async (userMessage) => {
        try {
          // Try the first NexOracle endpoint
          let response = await fetch(`https://api.nexoracle.com/ai/chatgpt?apikey=b9c265e5fd05f2e5f3&prompt=${encodeURIComponent(userMessage)}`);
          
          if (!response.ok) {
            console.log("First API endpoint failed, trying second endpoint...");
            // If first fails, try the second NexOracle endpoint
            response = await fetch(`https://api.nexoracle.com/ai/chatgpt-3?apikey=b9c265e5fd05f2e5f3&prompt=${encodeURIComponent(userMessage)}`);
            
            if (!response.ok) {
              throw new Error("Both API endpoints failed.");
            }
          }

          const aiResponse = await response.json();
          console.log("API response:", aiResponse);
          
          // Return the response based on the API structure
          return aiResponse.response || aiResponse.result || "I'm sorry, I couldn't process your request.";

        } catch (error) {
          console.error("Error during API request:", error.message);
          return "I'm sorry, I couldn't process your request at the moment. Please try again later.";
        }
      };

      // Get the AI response and reply
      const aiResponse = await getAIResponse(message.text);
      if (aiResponse) {
        await message.reply(aiResponse);
        console.log("Replied with:", aiResponse);
      } else {
        await message.reply("No suitable response from the API.");
        console.log("No suitable response from the API.");
      }
    } else {
      console.log("Chatbot is not enabled for this chat, skipping.");
    }

  } catch (error) {
    console.error("Error processing message:", error.message);
    await message.reply("An error occurred while processing your message.");
  }

  return true;
}