const { sleep } = require("./browserHandler");

const SHOULD_FILLS = [
    'CURRENT',
    'ERRORS'
]

const fill = async(page, officeDays = [0, 0, 0, 0, 0], workingHours = ["0900", "1800"]) => {
    for (const shouldFill of SHOULD_FILLS) {
        await goToCalendarPage(page);

        if (shouldFill === 'ERRORS') {
            await showErrorDays(page);
        }
        await zoomOut(page);
        await fillDays(page, officeDays, workingHours);
    }
}

const fillDays = async(page, officeDays, workingHours) => {
    const text = await page.content();

    const { enteryNameValues, exitNameValues, noteNameValues, locationNameValues } = await getNamesAttr(text);
    if (enteryNameValues && enteryNameValues.length > 0) {
        await fillTimeInTable(page, enteryNameValues, exitNameValues, noteNameValues, locationNameValues, officeDays, workingHours);
        await saveChanges(page, text);
    }
}

const goToCalendarPage = async(page) => {
    await page.goto('https://kenshoo.net.hilan.co.il/Hilannetv2/Attendance/calendarpage.aspx?isPersonalFileMode=true&ReportPageMode=2');
    await sleep(page, 3, 2);
}

const showErrorDays = async(page) => {
    const [errorsDaysBtn] = await page.$x('//input[@name="ctl00$mp$RefreshErrorsDays"]');
    await errorsDaysBtn.click();
    await sleep(page, 3, 2);
}


const zoomOut = async(page) => {
    await page.evaluate(() => document.body.style.zoom = 0.5);
}

const fillTimeInTable = async(page, enteryNameValues, exitNameValues, noteNameValues, locationNameValues, officeDays, workingHours) => {
    for (let i = 0; i < enteryNameValues.length; i++) {
        const [inputEntry] = await page.$$(`#${enteryNameValues[i]} > input`);
        await inputEntry.type(workingHours[0]);

        const [inputExit] = await page.$$(`#${exitNameValues[i]} > input`);
        await inputExit.type(workingHours[1]);

        const [inputNote] = await page.$$(`#${noteNameValues[i]} > input`);
        await inputNote.type('-');

        // await page.select(`select[@id="${locationNameValues[i]}"]`, '0');
    }
}

const saveChanges = async(page, text) => {
    let saveBtnId = await getSaveBtnId(text);
    saveBtnId = saveBtnId[2];
    saveBtnId = saveBtnId.slice(1, saveBtnId.length - 1);
    await page.$eval(`input[id='${saveBtnId}']`, elem => elem.click());
}

const getNamesAttr = async(text) => {
    let enteryNameValues = await getNamesMatchForEntry(text);
    enteryNameValues = await extractAndCleanNames(enteryNameValues);

    let exitNameValues = await getNamesMatchForExit(text);
    exitNameValues = await extractAndCleanNames(exitNameValues);

    let noteNameValues = await getNamesMatchForNote(text);
    noteNameValues = await extractAndCleanNames(noteNameValues);

    let locationNameValues = await getNamesMatchForLocation(text);
    locationNameValues = await extractAndCleanNames(locationNameValues);

    return { enteryNameValues, exitNameValues, noteNameValues, locationNameValues };
}

const getNamesMatchForEntry = async(text) => {
    return text.match(/[^x]\w*ManualEntry_EmployeeReports_row\w*[^x ]/g);
}

const getNamesMatchForExit = async(text) => {
    return text.match(/[^x]\w*ManualExit_EmployeeReports_row\w*[^x ]/g);
}

const getNamesMatchForNote = async(text) => {
    return text.match(/[^x]\w*Comment_EmployeeReports_row\w*[^x ]/g);
}

const getNamesMatchForLocation = async(text) => {
    return text.match(/[^x]\w*cellOf_Symbol.SymbolId_EmployeeReports_row\w*[^x ]*/g);
}

const getSaveBtnId = async(text) => {
    return text.match(/[^x]\w*btnSave\w*[^x ]/g);
}

const extractAndCleanNames = async(namesArray) => {
    const newNamesArray = [];
    if (namesArray) {
        for (let i = 0; i < namesArray.length; i++) {
            if (i % 3 === 0) {
                const nameLength = namesArray[i].length;
                const cleanName = namesArray[i].slice(1, nameLength - 1);
                newNamesArray.push(cleanName);
            }
        }
    }

    return newNamesArray;
}

module.exports = { fill };