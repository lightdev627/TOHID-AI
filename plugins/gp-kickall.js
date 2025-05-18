let handler = async (m, { conn, usedPrefix, command }) => {
    // Check if the sender is the bot owner (replace with your number)
    const ownerNumber = '917849917350@s.whatsapp.net'; // Example: '917849917350@s.whatsapp.net'
    if (m.sender !== ownerNumber) {
        return m.reply('🚫 *Permission Denied*: Only the bot devloper Mr Tohid can use this command.');
    }

    if (!m.isGroup) return m.reply(`✳️ This command can only be used in groups`);
    
    // Check if the bot is an admin (required to kick members)
    const botAdmin = await conn.groupMetadata(m.chat).then(metadata => 
        metadata.participants.some(p => p.id === conn.user.jid && p.admin)
    );
    if (!botAdmin) return m.reply('❌ The bot must be an admin to use this command.');
    
    // Get all participants except bots and the command sender
    const groupMetadata = await conn.groupMetadata(m.chat);
    const participants = groupMetadata.participants
        .filter(p => !p.id.includes(conn.user.jid) && p.id !== m.sender)
        .map(p => p.id);
    
    if (participants.length === 0) return m.reply(`✳️ No participants to kick`);
    
    // Kick all participants
    await conn.groupParticipantsUpdate(m.chat, participants, 'remove');
    m.reply(`✅ Successfully kicked all participants`);
}

handler.help = ['kickall']
handler.tags = ['group']
handler.command = ['kickall', 'expulsartodos'] 
handler.admin = true       // Ensures sender is at least an admin (though owner check overrides this)
handler.group = true       // Only works in groups
handler.botAdmin = true    // Bot must be admin to execute kicks

export default handler