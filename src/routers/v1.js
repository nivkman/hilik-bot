const express = require('express');
const router = express();
const { openBrowser, closeBrowser } = require('../functions/browserHandler');
const { fill } = require('../functions/hilan');
const login = require('../functions/login');

router.post('/', async(req, res) => {
    const { username, password, officeDays, workingHours } = req.body;
    const [browser, page] = await openBrowser();
    await login(page, username, password);
    await fill(page, officeDays, workingHours);
    await closeBrowser(browser, page);
    res.status(200).json({ "done": true });
})

module.exports = router;