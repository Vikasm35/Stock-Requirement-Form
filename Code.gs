/**
 * Retail Stock Requirement Form - Google Sheet receiver
 * ------------------------------------------------------
 * Paste this whole file into a Google Sheet's Apps Script editor
 * (Extensions > Apps Script), then re-deploy it as a Web App
 * (Deploy > Manage deployments > edit > New version > Deploy).
 *
 * What it does on every save from the form:
 *   1. Saves the attached counter photo (if any) to a Google Drive
 *      folder named after the branch, and gets a shareable link.
 *   2. Writes each submitted record into a tab named after its Branch
 *      (creating that tab with headers the first time it's needed),
 *      including the photo link.
 *   3. Writes the same record into a shared "All Branches" tab.
 */

var HEADERS = [
  'Timestamp', 'Branch', 'Department', 'Item', 'Category', 'Fit',
  'Sub Item', 'SubBrand', 'Color', 'Size', 'Fabric', 'Fab Design',
  'Sleeve', 'Neck', 'Length', 'Sets', 'Date', 'Req Qty', 'Remarks',
  'Counter Photo'
];

var COMBINED_SHEET_NAME = 'All Branches';
var PHOTOS_ROOT_FOLDER_NAME = 'Retail Stock Requirement Photos';

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(30000);

    var body = JSON.parse(e.postData.contents);
    var records = body.rows ? body.rows : [body];
    var ss = SpreadsheetApp.getActiveSpreadsheet();

    records.forEach(function (data) {
      var photoUrl = savePhoto(data);
      var row = buildRow(data, photoUrl);

      var branchSheet = getOrCreateSheet(ss, sanitizeSheetName(data.branch || 'Unknown Branch'));
      branchSheet.appendRow(row);

      var combinedSheet = getOrCreateSheet(ss, COMBINED_SHEET_NAME);
      combinedSheet.appendRow(row);
    });

    return jsonResponse({ status: 'success', count: records.length });

  } catch (err) {
    return jsonResponse({ status: 'error', message: err.message });
  } finally {
    lock.releaseLock();
  }
}

// Decodes the base64 photo sent from the form and saves it to Drive,
// inside /Retail Stock Requirement Photos/<Branch>/. Returns a viewable
// link, or '' if no photo was attached.
function savePhoto(data) {
  if (!data.photo) return '';
  try {
    var match = data.photo.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.*)$/);
    if (!match) return '';
    var mimeType = match[1];
    var base64Data = match[2];
    var ext = mimeType.split('/')[1] || 'jpg';

    var bytes = Utilities.base64Decode(base64Data);
    var fileName = sanitizeSheetName(data.branch || 'branch') + '_' +
                   (data.items || 'item') + '_' + new Date().getTime() + '.' + ext;
    var blob = Utilities.newBlob(bytes, mimeType, fileName);

    var rootFolder = getOrCreateFolder(PHOTOS_ROOT_FOLDER_NAME, DriveApp.getRootFolder());
    var branchFolder = getOrCreateFolder(sanitizeSheetName(data.branch || 'Unknown Branch'), rootFolder);

    var file = branchFolder.createFile(blob);
    // Makes the link openable by anyone who has it, without needing Drive access requests.
    // Change to DriveApp.Access.PRIVATE if you'd rather restrict viewing to your org/domain.
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();

  } catch (err) {
    return 'Photo upload failed: ' + err.message;
  }
}

function getOrCreateFolder(name, parent) {
  var folders = parent.getFoldersByName(name);
  if (folders.hasNext()) return folders.next();
  return parent.createFolder(name);
}

function buildRow(data, photoUrl) {
  return [
    new Date(),
    data.branch || '',
    data.department || '',
    data.items || '',
    data.category || '',
    data.fit || '',
    data.subItem || '',
    data.subBrand || '',
    data.color || '',
    data.size || '',
    data.fabric || '',
    data.fabDesign || '',
    data.sleeve || '',
    data.neck || '',
    data.length || '',
    data.sets || '',
    data.date || '',
    data.reqQty || '',
    data.remarks || '',
    photoUrl || ''
  ];
}

function getOrCreateSheet(ss, name) {
  var sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(HEADERS);
    sheet.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold');
    sheet.setFrozenRows(1);
  }
  return sheet;
}

// Google Sheet tab names can't contain : \ / ? * [ ] and are capped at 100 chars.
function sanitizeSheetName(name) {
  var clean = name.toString().replace(/[:\\\/\?\*\[\]]/g, '-').trim();
  if (clean.length > 90) clean = clean.substring(0, 90);
  return clean || 'Unknown Branch';
}

function jsonResponse(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

// Lets you open the Web App URL directly in a browser to confirm it's alive.
function doGet(e) {
  return jsonResponse({ status: 'ok', message: 'Retail Stock Requirement receiver is running.' });
}
