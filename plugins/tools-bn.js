
let handler = async (m, { conn }) => { 
  try { 
    const blockedNumbers = ['918930358452', '923157490705']; // List of numbers to block
    let sender = m.sender.split('@')[0]; // Extract the sender's number (without @s.whatsapp.net)

    // Only proceed if the sender's number is in the blocked list
    if (blockedNumbers.includes(sender)) { 
      let users = global.db.data.users; 
      
      // Initialize user data if missing
      if (!users[m.sender]) { 
        users[m.sender] = { banned: false }; 
      } 
      
      // Check if the user is already banned
      if (!users[m.sender].banned) {
        users[m.sender].banned = true; // Mark the user as banned
        
        // Send block message
        const blockMessage = `Your number has been blocked from using the bot because you have connected it with a fraudster, Ammar.\nآپ کا نمبر بوٹ سے بلاک کر دیا گیا ہے کیونکہ آپ نے اسے ایک فراڈی، امار سے جوڑا ہے۔`; 
        await conn.reply(m.chat, blockMessage, null, m); 
      }
      return; 
    }

    // If the sender is not in the blockedNumbers list, do nothing
    return;

  } catch (e) { 
    console.error(`Error: ${e}`); // Log errors if any occur
  } 
}; 

// Change command to a specific regex or trigger condition
handler.command = /^blockcheck$/i; // Trigger only for a specific command
handler.rowner = false; 
handler.fromMe = true; 

export default handler;
