// 1. 接收前端网页发来的数据 (DO NOT CHANGE)
function doPost(e) {
  var lock = LockService.getScriptLock();
  
  // 1. 获取锁：强制排队，防止插队 (最长等待30秒)
  var success = lock.tryLock(30000);

  if (!success) {
    return ContentService.createTextOutput(JSON.stringify({ 
      result: 'error', 
      error: 'Server is busy. Please try again.' 
    })).setMimeType(ContentService.MimeType.JSON);
  }

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
    
    // 2. 准备数据
    var p = e.parameter;
    var now = new Date();
    var dateStr = Utilities.formatDate(now, "America/Vancouver", "yyyy-MM-dd");
    var timeStr = Utilities.formatDate(now, "America/Vancouver", "h:mm a");

    var adultList = p.adultName ? p.adultName.split(', ') : [];
    var childNames = p.childName ? p.childName.split(', ') : [];
    var childAges = p.childAge ? p.childAge.split(', ') : [];

    // 计算本次需要几行 (取最大值)
    var maxRows = Math.max(adultList.length, childNames.length, 1);
    
    var dataGrid = [];

    // 3. 构建“全填充”数据矩阵
    // 关键点：每一行都填入完整的日期、家长名等信息。
    // 这样做是为了让 sheet.getLastRow() 绝对准确，防止新数据插入到旧数据的合并缝隙里。
    for (var i = 0; i < maxRows; i++) {
      var rowData = [];
      
      // Col 1-3: 公共信息 (每行都填，防止踩空)
      rowData.push(dateStr);
      rowData.push(timeStr);
      rowData.push(p.site || ""); 

      // Col 4: Adult Name
      rowData.push(i < adultList.length ? adultList[i] : "");

      // Col 5-8: Child Logic
      if (i < childNames.length) {
        rowData.push(childNames[i]); // Name
        var age = childAges[i];
        if (age.includes('0-35')) {
          rowData.push("✓", "", ""); 
        } else if (age.includes('3-5')) {
          rowData.push("", "✓", "");
        } else if (age.includes('6+')) {
          rowData.push("", "", "✓");
        } else {
          rowData.push("", "", "");
        }
      } else {
        rowData.push("", "", "", ""); // 没有孩子这行也占位
      }

      // Col 9-13: Info (每行都填，防止踩空)
      rowData.push(p.familyName);
      rowData.push(p.firstVisit);
      rowData.push(p.membership);
      rowData.push(p.contactNumber);
      rowData.push(p.totalPeople);
      
      dataGrid.push(rowData);
    }

    // 4. 写入数据 (一次性写入块)
    var startRow = sheet.getLastRow() + 1;
    var range = sheet.getRange(startRow, 1, maxRows, 13);
    
    // 先把数据写进去，确立领地
    range.setValues(dataGrid);
    
    // 设置基础样式
    range.setVerticalAlignment("middle");
    range.setHorizontalAlignment("center");

    // 5. 执行合并 (Merge)
    // 只有当行数大于1时才需要合并
    if (maxRows > 1) {
      // 定义需要合并的列号 (Excel中 A=1, B=2...)
      // 这里合并：Date(1), Time(2), Site(3), 以及后面的 FamilyName(9) 到 Total(13)
      // 注意：Adult Name(4) 和 Child Name(5-8) 不合并，保留独立行
      var columnsToMerge = [1, 2, 3, 9, 10, 11, 12, 13];
      
      columnsToMerge.forEach(function(colIndex) {
        // getRange(起始行, 起始列, 向下几行, 向右几列)
        sheet.getRange(startRow, colIndex, maxRows, 1).merge();
      });
    }

    // 6. 强制存盘
    // 这步至关重要，确保在释放锁之前，Google Sheet 已经把行数更新了
    SpreadsheetApp.flush();

    return ContentService.createTextOutput(JSON.stringify({ result: 'success' })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ result: 'error', error: error.toString() })).setMimeType(ContentService.MimeType.JSON);
  } finally {
    // 7. 释放锁
    lock.releaseLock();
  }
}

// 处理 GET 请求 (比如你在浏览器直接访问链接时)
function doGet(e) {
  return ContentService.createTextOutput("服务正常运行中！请使用 POST 请求提交数据。");
}

// 2. 每月自动归档功能 (Monthly Archive)
function monthlyArchive() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sourceSheet = ss.getSheetByName("Sheet1");
  
  // 生成归档文件名 (例如: Archived_2026_01)
  var date = new Date();
  date.setMonth(date.getMonth() - 1); // 归档上个月的数据
  var dateString = Utilities.formatDate(date, "America/Vancouver", "yyyy_MM");
  var backupName = "Richmond_Family_Place_SignIn_Data_Archived_" + dateString;

  // 复制整个文件到 Google Drive (生成备份)
  var fileId = ss.getId();
  var file = DriveApp.getFileById(fileId);
  file.makeCopy(backupName); 

  // 清空当前表格里的旧数据 (保留第一行表头!)
  var lastRow = sourceSheet.getLastRow();
  if (lastRow > 1) {
    // 从第2行开始，清空所有内容
    sourceSheet.getRange(2, 1, lastRow - 1, sourceSheet.getLastColumn()).clearContent();
  }
}