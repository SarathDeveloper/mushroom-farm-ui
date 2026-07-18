const { chromium } = require('playwright-chromium');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  
  page.on('pageerror', error => {
    console.log('PAGE ERROR:', error.message);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('CONSOLE ERROR:', msg.text());
    }
  });

  await page.goto('http://localhost:3001');
  
  // Wait for the icon to appear (the User icon is inside DropdownMenuTrigger)
  // Or just wait for the button that contains a lucide-user icon
  await page.waitForSelector('button[data-slot="dropdown-menu-trigger"]');
  
  console.log('Clicking the profile icon...');
  await page.click('button[data-slot="dropdown-menu-trigger"]');
  
  await page.waitForTimeout(2000);
  console.log('Done.');
  await browser.close();
})();
