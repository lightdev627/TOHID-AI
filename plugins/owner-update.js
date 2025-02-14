import db from '../lib/database.js';
import { execSync } from 'child_process';
import fs from 'fs';

const ownerJID = '917849917350@s.whatsapp.net'; // Replace with the owner's JID

let handler = async (m, { conn, text }) => {
  // Ensure that the command is executed by the owner
  if (m.sender !== ownerJID) {
    return conn.reply(m.chat, 'This command is restricted to the owner.', m);
  }

  try {
    // Execute the git pull command
    let stdout = execSync('git pull' + (text ? ' ' + text : ''), { encoding: 'utf-8' });
    
    // Reload all plugins
    fs.readdirSync('plugins').forEach(v => {
      try {
        global.reload('', v);
      } catch (error) {
        console.error(`Failed to reload plugin ${v}:`, error);
      }
    });

    // Reply with the output of the git command
    conn.reply(m.chat, stdout.toString(), m);
  } catch (error) {
    console.error('Error during update:', error);
    conn.reply(m.chat, `Update failed: ${error.message}`, m);
  }
};

handler.help = ['update'];
handler.tags = ['owner'];
handler.command = ['update', 'actualizar', 'fix', 'fixed'];
handler.rowner = true;

export default handler;