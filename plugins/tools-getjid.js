let handler = async (m, { conn, args, usedPrefix, command, isGroup }) => {
    let jid;
    
    if (isGroup) {
        if (m.quoted) {
            
            jid = m.quoted.sender;
        } else {
            
            jid = m.chat;
        }
    } else {
        
        jid = m.chat;
    }

    m.reply(jid);
}

handler.help = ['getjid'];
handler.tags = ['tools'];
handler.command = ['getjid', 'jid', 'jd'];

export default handler;
