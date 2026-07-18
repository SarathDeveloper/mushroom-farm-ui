const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();
  
  try {
    console.log("Navigating to login...");
    await page.goto('http://localhost:3000/login');
    
    console.log("Filling login form...");
    await page.waitForSelector('#email');
    await page.type('#email', 'admin@example.com');
    await page.type('#password', 'admin123');
    await page.click('button[type="submit"]');
    
    console.log("Waiting for navigation to dashboard...");
    await page.waitForNavigation();
    
    console.log("Navigating to products page...");
    await page.goto('http://localhost:3000/admin/products');
    
    console.log("Navigating to add new product...");
    await page.goto('http://localhost:3000/admin/products/new');
    
    console.log("Filling product form...");
    await page.waitForSelector('#name');
    await page.type('#name', 'Smoke Test Mushroom');
    await page.type('#description', 'A product created for smoke testing.');
    await page.type('#price', '100');
    await page.type('#weight', '500g');
    await page.type('#stock', '50');
    
    // Select category if any
    const categorySelect = await page.$('#categoryId');
    if (categorySelect) {
      const options = await page.$$eval('#categoryId option', opts => opts.map(o => o.value));
      const validOption = options.find(val => val !== '');
      if (validOption) {
        await page.select('#categoryId', validOption);
      }
    }
    
    console.log("Submitting new product...");
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]')
    ]);
    
    console.log("Verifying product appears in list...");
    await page.waitForSelector('input[placeholder="Search products..."]');
    await page.type('input[placeholder="Search products..."]', 'Smoke Test Mushroom');
    await page.waitForTimeout(500); // give it a moment to filter
    
    const productNames = await page.$$eval('h3', nodes => nodes.map(n => n.innerText));
    if (!productNames.some(n => n.includes('Smoke Test Mushroom'))) {
      throw new Error("Created product not found in list");
    }
    console.log("Product successfully created!");
    
    // Let's edit the product now
    console.log("Editing the product...");
    // Find the edit button for this product. The Link href contains /edit
    const editLinks = await page.$$eval('a[href*="/edit"]', links => links.map(l => l.href));
    if (editLinks.length === 0) {
      throw new Error("Edit link not found");
    }
    
    await page.goto(editLinks[0]);
    
    console.log("Modifying product name...");
    await page.waitForSelector('#name');
    // Clear input
    await page.click('#name', {clickCount: 3});
    await page.type('#name', 'Smoke Test Mushroom Updated');
    
    console.log("Submitting update...");
    await Promise.all([
      page.waitForNavigation(),
      page.click('button[type="submit"]')
    ]);
    
    console.log("Verifying update...");
    await page.waitForSelector('input[placeholder="Search products..."]');
    await page.type('input[placeholder="Search products..."]', 'Updated');
    await page.waitForTimeout(500); // give it a moment to filter
    
    const updatedNames = await page.$$eval('h3', nodes => nodes.map(n => n.innerText));
    if (!updatedNames.some(n => n.includes('Updated'))) {
      throw new Error("Updated product not found in list");
    }
    console.log("Product successfully updated!");
    
    console.log("SMOKE TEST PASSED.");
  } catch (err) {
    console.error("SMOKE TEST FAILED:", err);
  } finally {
    await browser.close();
  }
})();
