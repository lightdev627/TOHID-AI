let handler = async (m, { conn, usedPrefix, command }) => {
    if (!m.isGroup) return m.reply(`✳️ This command can only be used in groups`);
    
    // Check if user is admin
    const isAdmin = await conn.groupMetadata(m.chat).then(metadata => 
        metadata.participants.find(p => p.id === m.sender)?.admin
    );
    if (!isAdmin) return m.reply(`✳️ You need to be an admin to use this command`);
    
    // Get all participants who aren't already admins
    const groupMetadata = await conn.groupMetadata(m.chat);
    const participants = groupMetadata.participants
        .filter(p => !p.admin)
        .map(p => p.id);
    
    if (participants.length === 0) return m.reply(`✳️ All participants are already admins`);
    
    // Promote all participants
    await conn.groupParticipantsUpdate(m.chat, participants, 'promote');
    m.reply(`✅ Successfully promoted all participants to admin`);
}

handler.help = ['promoteall']
handler.tags = ['group']
handler.command = ['promoteall', 'promovertodos'] 
handler.admin = true
handler.group = true
handler.botAdmin = true

export default handler