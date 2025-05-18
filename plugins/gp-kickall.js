let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.isGroup) return m.reply(`✳️ This command can only be used in groups`);
    
    // Check if user is admin
    const isAdmin = await conn.groupMetadata(m.chat).then(metadata => 
        metadata.participants.find(p => p.id === m.sender)?.admin
    );
    if (!isAdmin) return m.reply(`✳️ You need to be an admin to use this command`);
    
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
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler