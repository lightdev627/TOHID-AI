import fs from 'fs';
import path from 'path';
import ytdl from 'ytdl-core';
import { fileURLToPath } from 'url';
import fetch from 'node-fetch';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Cache for video info to avoid repeated API calls
const videoInfoCache = new Map();
const CACHE_TTL = 300000; // 5 minutes cache

let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args || !args[0]) throw `✳️ Example:\n${usedPrefix + command} https://youtu.be/YzkTFFwxtXI`;
    if (!ytdl.validateURL(args[0])) throw `❎ Please provide a valid YouTube URL`;
    
    try {
        await m.react('⏳');
        
        // Get video info with caching
        const videoDetails = await getVideoDetailsWithCache(args[0]);
        if (!videoDetails) throw `❎ Error fetching video information`;
        
        // Check video duration (optional limit)
        if (videoDetails.duration > 3600) { // 1 hour limit
            await m.react('❌');
            throw `⚠️ Video is too long (${formatDuration(videoDetails.duration)}). Maximum allowed: 1 hour.`;
        }
        
        // Send video info while downloading
        const infoMsg = await conn.sendMessage(m.chat, {
            text: `📥 Downloading: ${videoDetails.title}\n\n⏳ Please wait...`,
            mentions: [m.sender]
        }, { quoted: m });
        
        // Download the video using the API
        const videoBuffer = await downloadFromAPI(args[0]);
        
        // Prepare caption
        const caption = `🎬 *YouTube Video*\n\n` +
                       `▢ *Title:* ${videoDetails.title}\n` +
                       `▢ *Channel:* ${videoDetails.author}\n` +
                       `▢ *Duration:* ${formatDuration(videoDetails.duration)}\n` +
                       `▢ *Views:* ${formatViews(videoDetails.views)}\n` +
                       `▢ *Quality:* High\n\n` +
                       `🔗 *Original URL:* ${args[0]}`;
        
        // Send the video
        await conn.sendMessage(m.chat, {
            video: videoBuffer,
            caption: caption,
            fileName: `${sanitizeFilename(videoDetails.title)}.mp4`,
            mimetype: `video/mp4`,
            mentions: [m.sender]
        }, { quoted: m });
        
        // Delete the processing message
        await conn.sendMessage(m.chat, { 
            delete: infoMsg.key 
        });
        
        await m.react('✅');
    } catch (error) {
        console.error('Download error:', error);
        await m.react('❌');
        throw `❎ Download failed: ${error.message}`;
    }
};

// Download using the API
async function downloadFromAPI(url) {
    const apiUrl = `https://apis.davidcyriltech.my.id/download/ytmp4?url=${encodeURIComponent(url)}`;
    
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`API error! status: ${response.status}`);
        }
        
        const buffer = await response.buffer();
        return buffer;
    } catch (error) {
        console.error('API download failed, trying fallback...', error);
        // Fallback to ytdl-core if API fails
        return downloadVideo(url, 'highest', 'mp4');
    }
}

// Helper functions (keep the same as before)
async function getVideoDetailsWithCache(url) {
    const cacheKey = url;
    const cached = videoInfoCache.get(cacheKey);
    
    if (cached && (Date.now() - cached.timestamp) < CACHE_TTL) {
        return cached.data;
    }
    
    const details = await ytdl.getInfo(url);
    const videoDetails = {
        url: url,
        title: details.videoDetails.title,
        author: details.videoDetails.author.name,
        description: details.videoDetails.description,
        duration: parseInt(details.videoDetails.lengthSeconds),
        views: parseInt(details.videoDetails.viewCount),
        thumbnail: details.videoDetails.thumbnails.pop().url
    };
    
    videoInfoCache.set(cacheKey, {
        data: videoDetails,
        timestamp: Date.now()
    });
    
    return videoDetails;
}

async function downloadVideo(url, quality, format) {
    return new Promise(async (resolve, reject) => {
        try {
            const chunks = [];
            ytdl(url, { quality: quality })
                .on('data', chunk => chunks.push(chunk))
                .on('end', () => resolve(Buffer.concat(chunks)))
                .on('error', reject);
        } catch (error) {
            reject(error);
        }
    });
}

function sanitizeFilename(filename) {
    return filename.replace(/[^a-zA-Z0-9 \-_]/g, '').substring(0, 100);
}

function formatDuration(seconds) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return [h, m > 9 ? m : h ? '0' + m : m || '0', s > 9 ? s : '0' + s]
        .filter(Boolean)
        .join(':');
}

function formatViews(views) {
    return views.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

handler.help = ['ytv <url>', 'ytmp4 <url>'];
handler.tags = ['downloader'];
handler.command = ['ytv', 'ytmp4', 'video'];
handler.limit = true;
handler.premium = false;

export default handler;
