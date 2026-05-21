/**
 * MAYBRIN — Form Backend
 * Google Apps Script that receives form submissions from the Maybrin site,
 * appends rows to a Google Sheet, and emails Donnie a notification.
 *
 * SETUP (10 minutes):
 *
 * 1. Create a new Google Sheet (name it "Maybrin - Form Submissions" or similar).
 * 2. Create two tabs: "Intake" and "Newsletter".
 * 3. In the Sheet menu, choose: Extensions → Apps Script.
 * 4. Delete the boilerplate code that appears and paste this entire file.
 * 5. Update NOTIFY_EMAIL below to your address.
 * 6. Click Deploy → New deployment.
 *    - Type: Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 *    - Click Deploy.
 * 7. Authorize the script (Google will prompt you).
 * 8. Copy the Web app URL it gives you.
 * 9. In your site's index.html, set both <form> tags' action attribute to that URL,
 *    add method="POST", and remove the onsubmit attribute (or replace it with the
 *    fetch-based version shown in README.md).
 *
 * That's it. New submissions will populate the sheet and email you within seconds.
 */

const NOTIFY_EMAIL = "d.schemetti@gmail.com";  // ← Where notifications go
const SHEET_ID     = "";                        // ← Optional: paste the Sheet's ID here.
                                                //   If left blank, the script uses the active spreadsheet.

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const formType = data._form || "unknown";   // "intake" or "newsletter"
    const ss = SHEET_ID ? SpreadsheetApp.openById(SHEET_ID) : SpreadsheetApp.getActiveSpreadsheet();
    const timestamp = new Date();

    if (formType === "newsletter") {
      const sheet = ss.getSheetByName("Newsletter") || ss.insertSheet("Newsletter");
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(["Timestamp", "Email", "User Agent", "Referrer"]);
      }
      sheet.appendRow([timestamp, data.email || "", data._ua || "", data._ref || ""]);

      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "Maybrin — New Field Notes subscriber",
        body: "A new subscriber joined Field Notes.\n\n" +
              "Email: " + (data.email || "") + "\n" +
              "Time: " + timestamp.toISOString() + "\n\n" +
              "View all subscribers in the Maybrin Submissions sheet."
      });

    } else {
      // Intake form (default)
      const sheet = ss.getSheetByName("Intake") || ss.insertSheet("Intake");
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(["Timestamp", "Name", "Company", "Email", "Stage", "Brief", "User Agent", "Referrer"]);
      }
      sheet.appendRow([
        timestamp,
        data.name    || "",
        data.company || "",
        data.email   || "",
        data.stage   || "",
        data.brief   || "",
        data._ua     || "",
        data._ref    || ""
      ]);

      const body =
        "New intake from the Maybrin site.\n\n" +
        "Name:    " + (data.name    || "—") + "\n" +
        "Company: " + (data.company || "—") + "\n" +
        "Email:   " + (data.email   || "—") + "\n" +
        "Stage:   " + (data.stage   || "—") + "\n\n" +
        "What they do:\n" + (data.brief || "—") + "\n\n" +
        "Time: " + timestamp.toISOString();

      MailApp.sendEmail({
        to: NOTIFY_EMAIL,
        subject: "Maybrin — New intake: " + (data.company || data.name || "unknown"),
        replyTo: data.email || NOTIFY_EMAIL,
        body: body
      });
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: GET endpoint for quick "is this alive?" checks.
function doGet() {
  return ContentService
    .createTextOutput("Maybrin form endpoint is live.")
    .setMimeType(ContentService.MimeType.TEXT);
}
