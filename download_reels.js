// download_reels.js - TẢI VIDEO + GHI ID FAIL + RETRY
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const IDS_FILE = 'reel_ids.txt';
const FAILED_FILE = 'failed_ids.txt'; // ← FILE GHI ID THẤT BẠI
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

// XÓA FILE failed_ids.txt nếu tồn tại
if (fs.existsSync(FAILED_FILE)) fs.unlinkSync(FAILED_FILE);

const failedIds = [];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  for (let i = 0; i < ids.length; i++) {
    const id = ids[i];
    const url = `https://www.facebook.com/reel/${id}`;
    const outputFile = path.join(OUTPUT_DIR, `reel_${String(i + 1).padStart(2, '0')}.mp4`);

    console.log(`\n[${i + 1}/${ids.length}] Đang tải: ${url}`);
    try {
      execSync(`yt-dlp --cookies-from-browser chrome -q --no-warnings -o "${outputFile}" "${url}"`, { stdio: 'inherit' });
      console.log(`ĐÃ TẢI: ${outputFile}`);
    } catch (e) {
      console.log(`LỖI: ${url}`);
      failedIds.push(id); // ← GHI ID VÀO MẢNG
    }

    if (i < ids.length - 1) {
      console.log('Chờ 3 giây...');
      await delay(3000);
    }
  }

  // GHI ID THẤT BẠI RA FILE
  if (failedIds.length > 0) {
    fs.writeFileSync(FAILED_FILE, failedIds.join('\n'));
    console.log(`\nĐÃ GHI ${failedIds.length} ID thất bại vào ${FAILED_FILE}`);
  }

  console.log(`\nHOÀN TẤT! Thành công: ${ids.length - failedIds.length}/${ids.length}`);
  console.log(`→ Retry bằng lệnh: cp ${FAILED_FILE} ${IDS_FILE} && yarn download`);
})();