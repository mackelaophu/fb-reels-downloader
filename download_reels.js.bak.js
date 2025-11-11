// download_reels.js - TẢI VIDEO DỰA TRÊN reel_ids.txt (HOÀN CHỈNH)
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const IDS_FILE = 'reel_ids.txt';
const OUTPUT_DIR = './reels_download';

if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });

if (!fs.existsSync(IDS_FILE)) {
  console.log(`Không tìm thấy ${IDS_FILE}! Chạy: yarn extract`);
  process.exit(1);
}

const ids = fs.readFileSync(IDS_FILE, 'utf-8')
  .split('\n')
  .map(line => line.trim())
  .filter(Boolean);

console.log(`Tìm thấy ${ids.length} Reel ID. Bắt đầu tải...`);

// Hàm delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// IIFE để dùng async/await
(async () => {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const url = `https://www.facebook.com/reel/${id}`;
    const outputFile = path.join(OUTPUT_DIR, `reel_${String(i + 1).padStart(2, '0')}.mp4`);

    console.log(`\n[${i + 1}/${ids.length}] Đang tải: ${url}`);
    try {
      // DÙNG COOKIES TỪ CHROME ĐỂ TẢI PRIVATE REELS
      execSync(`yt-dlp --cookies-from-browser chrome -q --no-warnings -o "${outputFile}" "${url}"`, { stdio: 'inherit' });
      console.log(`ĐÃ TẢI: ${outputFile}`);
    } catch (e) {
      console.log(`LỖI: ${url}`);
    }

    // Delay 3 giây
    if (i < ids.length - 1) {
      console.log('Chờ 3 giây...');
      await delay(3000);
    }
  }

  console.log(`\nHOÀN TẤT! Đã tải ${ids.length} video vào ${OUTPUT_DIR}`);
})();