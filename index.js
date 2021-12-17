const fs = require("fs");
const path = require("path");
const filePath = path.resolve("./");

const fileOrm = {
  head: {},
  body: {},
  hair: {},
  foot: {},
};

fileDisplay(filePath);
showFileContent(fileOrm);

function switchFile(key) {
  const _ = key.toLowerCase();
  if (_.includes("head")) return "head";
  if (_.includes("body")) return "body";
  if (_.includes("hair")) return "hair";
  if (_.includes("foot")) return "foot";
  return "";
}

// 注入文件内容
function setStats(stats, filedir) {
  var isFile = stats.isFile();
  var isDir = stats.isDirectory();
  if (isFile) {
    const content = fs.readFileSync(filedir, "utf-8");
    const key = switchFile(filedir);
    if (key) {
      fileOrm[key][filedir] = splitContent(content);
    }
  }

  if (isDir) {
    // 递归
    fileDisplay(filedir);
  }
}

// 查询文件还是文件夹
function askContent(files, filePath) {
  //遍历文件列表
  files.map(function (filename) {
    if (filename.includes(".DS_Store") || filename.includes(".js")) {
      return;
    }
    var filedir = path.join(filePath, filename);
    const stats = fs.statSync(filedir);
    setStats(stats, filedir);
  });
}

//文件遍历
function fileDisplay(filePath) {
  let paths = fs.readdirSync(filePath);
  askContent(paths, filePath);
}

// 分割字符串
function splitContent(content) {
  const tempArr = content.split("\n");
  const tempObj = {};
  tempArr.map((i, index) => {
    tempObj[index] = i;
  });
  return tempObj;
  //   return content.split(/\>(?=&#?[a-zA-Z0-9]+;)/g);
}

// 取出出现次数最少的像素点
function tellMin(arr) {
  const _ = {};
  arr.map((i) => {
    if (!_[i]) {
      _[i] = 0;
    }
    _[i] += 1;
  });

  const __ = Object.keys(_).sort((c, d) => _[c] - _[d]);

  return __[0];
}

// 导出
function exportSvg(filename, file) {
  fs.writeFile("./dist/" + filename + ".svg", file, function (err) {
    if (err) {
      console.log("写入失败", err);
    } else {
      console.log("写入成功");
    }
  });
}

// 合并图层像素点
function showFileContent(fileOrm) {
  const exportPart = [];
  /**
   * {
   *   header: {
   *      'xxx.xxx': 'xxxxxxx'
   *  }
   * }
   */
  const head = Object.values(fileOrm.head);
  const hair = Object.values(fileOrm.hair);
  const foot = Object.values(fileOrm.foot);
  const body = Object.values(fileOrm.body);

  const headLen = head.length;
  const hairLen = hair.length;
  const footLen = foot.length;
  const bodyLen = body.length;
  let el = "";

  // 四组字符串
  for (let b = 0; b < bodyLen; b++) {
    for (let h = 0; h < headLen; h++) {
      for (let a = 0; a < hairLen; a++) {
        for (let f = 0; f < footLen; f++) {
          el = "";
          //type - object
          const currentBody = body[b];
          const currentHead = head[h];
          const currentHair = hair[a];
          const currentFoot = foot[f];
          const keys = Object.keys(currentBody);

          for (let c = 0; c < keys.length; c++) {
            // 优先级 hair>head>body>foot
            // 根据传入数组顺序定义优先级
            // todo 添加优先级配置
            const temp = [
              currentHair[c].trim(),
              currentHead[c].trim(),
              currentBody[c].trim(),
              currentFoot[c].trim(),
            ];

            const different = tellMin(temp);
            console.log("different", different, temp);
            el += different.trim();
          }
          exportPart.push(el);
        }
      }
    }
  }

  //   console.log("exportPart", exportPart, exportPart.length);
  if (exportPart && exportPart.length > 0) {
    exportPart.forEach((i, index) => {
      exportSvg(index, i);
    });
  }

  return exportPart;
}
