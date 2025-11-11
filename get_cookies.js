// get_cookies.js - LẤY COOKIES SAU KHI ĐĂNG NHẬP
const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch({
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });

  const page = await browser.newPage();
  await page.goto('https://facebook.com');

  console.log('Vui lòng ĐĂNG NHẬP Facebook bằng tài khoản của bạn...');
  console.log('Sau khi vào được News Feed → NHẤN ENTER ở đây');

  // Đợi bạn nhấn Enter
  await new Promise(resolve => process.stdin.once('data', resolve));

  // Lưu cookies
  const cookies = await page.cookies();
  fs.writeFileSync('fb_cookies.json', JSON.stringify(cookies, null, 2));
  console.log('Đã lưu cookies vào fb_cookies.json');

  await browser.close();
})();
