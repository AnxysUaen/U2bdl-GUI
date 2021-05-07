var path = require('path');
var os = require("os");
var fs = require('fs')

var configFile = path.join(os.homedir(), '.config', 'U2b_config.json');

function writeJson() {
    console.log('读文件出错转入');
    var jsonObj = { 'Save': "C:\\Users\\AnxysUaen\\Desktop" };
    var str = JSON.stringify(jsonObj);
    fs.writeFile(configFile, str, (err) => {
        if (err) {
            console.error(err);
        } else {
            console.log('写入完成');
            readJson('Save')
        }
    })
}

function changeJson(key, value) {
    var _key = key
    fs.readFile(configFile, (err, data) => {
        var jsonObj = JSON.parse(data.toString());
        if (err) {
            console.error(err);
        } else {
            //把数据读出来,然后进行修改
            jsonObj[_key] = value;
            var str = JSON.stringify(jsonObj);
            fs.writeFile(configFile, str, (err) => {
                if (err) {
                    console.error(err);
                }
                console.log('修改成功');
            })
        }
    })
}

// 异步不知道为什么不行
function readJson(key) {
    var _key = key
    try {
        let data = fs.readFileSync(configFile)
        let jsonObj = JSON.parse(data.toString());
        // console.log(jsonObj[_key]);
        return jsonObj[_key]
    } catch (error) {
        console.error(error);
        writeJson()
    }

}