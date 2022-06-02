const express = require('express');
const router = express();
const { openBrowser, closeBrowser } = require('../functions/browserHandler');
const { sendEmail } = require('../functions/utils');
const { fill } = require('../functions/hilan');
const login = require('../functions/login');

router.post('/', async(req, res) => {
    const { username, password, officeDays, workingHours, month } = req.body;
    const [browser, page] = await openBrowser();
    await login(page, username, password);
    const daysAmount = await fill(page, officeDays, workingHours, month);
    await closeBrowser(browser, page);
    // await sendEmail(req.body.email, daysAmount);
    res.status(200).json({ "done": true });
})

module.exports = router;