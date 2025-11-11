// extract_reel_ids.js
const puppeteer = require('puppeteer');
const fs = require('fs');

const PAGE_URL = 'https://www.facebook.com/nguyen.hoang.phuong.dung.681130/reels';
const COOKIES_FILE = 'fb_cookies.json';
const OUTPUT_FILE = 'reel_ids.txt';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
  if (!fs.existsSync(COOKIES_FILE)) {
    console.log('Chạy: yarn get-cookies');
    return;
  }

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  const cookies = JSON.parse(fs.readFileSync(COOKIES_FILE));
  await page.setCookie(...cookies);

  console.log('Đi đến trang Reels...');
  await page.goto(PAGE_URL, { waitUntil: 'networkidle2', timeout: 60000 });
  await delay(10000);

  const ids = new Set();

  // Cuộn 5 lần để load
  for (let i = 0; i < 5; i++) {
    await page.evaluate(() => window.scrollBy(0, 1000));
    await delay(3000);
  }

  // LẤY TẤT CẢ <a> CHỨA /reel/
  const reelLinks = await page.$$eval('a', anchors =>
    anchors
      .map(a => a.href)
      .filter(href => href && href.includes('/reel/'))
      .map(href => {
        const match = href.match(/\/reel\/(\d+)/);
        return match ? match[1] : null;
      })
      .filter(id => id)
  );

  reelLinks.forEach(id => ids.add(id));
  console.log(`Tìm thấy ${ids.size} Reel ID`);

  // Lưu ID
  fs.writeFileSync(OUTPUT_FILE, Array.from(ids).join('\n'));
  console.log(`Đã lưu vào ${OUTPUT_FILE}`);

  // In link đầy đủ
  console.log('\nLINK REEL:');
  Array.from(ids).forEach(id => {
    console.log(`https://www.facebook.com/reel/${id}`);
  });

  await browser.close();
})();
