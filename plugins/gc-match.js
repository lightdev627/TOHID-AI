let handler = async (m, { conn, text, args, usedPrefix, command, isGroup, groupMetadata }) => {
  try {
    // Check if the command is used in a group
    if (!m.isGroup) throw 'This command can only be used in groups!'

    // Get group metadata if not already provided
    if (!groupMetadata) {
      groupMetadata = await conn.groupMetadata(m.chat);
    }

    // Attendance command
    if (command.match(/^(attendance|absensi|presensi)$/i)) {
      const participant = groupMetadata.participants.find(p => p.id === m.sender);
      if (!participant?.admin) throw 'Only group admins can take attendance!';
      
      const attendanceOptions = ['Present', 'Absent'];
      let cap = `*Attendance Check*\nRequested by: ${m.name}\n\nPlease mark your attendance!`;
      
      await conn.sendMessage(m.chat, {
        poll: {
          name: cap,
          values: attendanceOptions,
          multiselect: false,
          selectableCount: 1,
        }
      });
      
      await conn.sendMessage(m.chat, {
        text: `*Attendance Instructions:*\n1. Select "Present" if you're attending\n2. Select "Absent" if you're not\n3. Attendance will be closed in 24 hours`,
        mentions: groupMetadata.participants.map(p => p.id)
      }, { quoted: m });
    }
    // Random boy selection
    else if (command.match(/^(bacha|boy|larka)$/i)) {
      const participants = groupMetadata.participants;
      const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
      
      if (eligible.length < 1) throw '❌ No eligible participants found!';
      const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
      
      await conn.sendMessage(
        m.chat,
        { 
          text: `👦 *Yeh lo tumhara Bacha!* \n\n@${randomUser.id.split('@')[0]} is your handsome boy! 😎`, 
          mentions: [randomUser.id] 
        },
        { quoted: m }
      );
    }
    // Random girl selection
    else if (command.match(/^(bachi|girl|kuri|larki)$/i)) {
      const participants = groupMetadata.participants;
      const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
      
      if (eligible.length < 1) throw '❌ No eligible participants found!';
      const randomUser = eligible[Math.floor(Math.random() * eligible.length)];
      
      await conn.sendMessage(
        m.chat,
        { 
          text: `👧 *Yeh lo tumhari Bachi!* \n\n@${randomUser.id.split('@')[0]} is your beautiful girl! 💖`, 
          mentions: [randomUser.id] 
        },
        { quoted: m }
      );
    }
    // Shadi/Marriage command
    else if (command.match(/^(shadi|marry|marriage|vivah|nikah)$/i)) {
      const participants = groupMetadata.participants;
      const eligible = participants.filter(p => !p.id.includes(conn.user.id.split('@')[0]));
      
      if (eligible.length < 2) throw '❌ At least 2 members needed for marriage!';
      
      // Get two different random users
      const randomIndex1 = Math.floor(Math.random() * eligible.length);
      let randomIndex2;
      do {
        randomIndex2 = Math.floor(Math.random() * eligible.length);
      } while (randomIndex2 === randomIndex1);
      
      const user1 = eligible[randomIndex1];
      const user2 = eligible[randomIndex2];
      
      // Fun marriage message with emojis
      const marriageMessages = [
        `💍 *SHAADI KA BAND BAJ GAYA!* 💒\n\n@${user1.id.split('@')[0]} 💞 @${user2.id.split('@')[0]}\n\nMubarak ho! Ab dono ek ho gaye! 🎉`,
        `❤️ *ROMANTIC ALERT!* ❤️\n\n@${user1.id.split('@')[0]} ne @${user2.id.split('@')[0]} se shadi kar li! 💑\n\nDulha dulhan ek dusre ko dekh ke sharma rahe hain! 😊`,
        `🎊 *WEDDING BELLS RINGING!* 🎊\n\n@${user1.id.split('@')[0]} 🤵👰 @${user2.id.split('@')[0]}\n\nAb yeh group inka honeymoon destination hai! 🌴`,
        `💘 *Pyaar Hui, Shaadi Hui!* 💘\n\n@${user1.id.split('@')[0]} ne @${user2.id.split('@')[0]} ko apna banaya! 💍\n\nGroup ki taraf se badhai! 🎂`
      ];
      
      const selectedMessage = marriageMessages[Math.floor(Math.random() * marriageMessages.length)];
      
      await conn.sendMessage(
        m.chat,
        { 
          text: selectedMessage, 
          mentions: [user1.id, user2.id] 
        },
        { quoted: m }
      );
    }
  } catch (error) {
    console.error(`Error in ${command} command:`, error);
    await conn.sendMessage(m.chat, { 
      text: `❌ Error: ${error.message}`,
      mentions: [m.sender]
    }, { quoted: m });
  }
}

handler.help = [
  ['attendance', 'Take attendance in the group (Admin only)'],
  ['boy', 'Randomly selects a boy from the group'],
  ['girl', 'Randomly selects a girl from the group'],
  ['shadi', 'Randomly pairs two members in a marriage announcement']
]

handler.tags = ['group', 'fun']
handler.command = /^(attendance|absensi|presensi|bacha|boy|larka|bachi|girl|kuri|larki|shadi|marry|marriage|vivah|nikah)$/i

export default handler