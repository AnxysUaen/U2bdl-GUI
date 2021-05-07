var spawn = require("child_process").spawn;
var path = require('path');
const iconvLite = require('iconv-lite');
function Download(param, callback) {
    var obj = { err: "未知错误，请查看日志", data: "" }
    return new Promise((resolve, reject) => {
        // var result = spawn('../lib/youtube-dl.exe', ['--proxy', 'https://127.0.0.1:7890', '-f', 'bestvideo+bestaudio', 'https://www.youtube.com/watch?v=8y2h6AzJs3U', '--merge-output-format', 'mp4', '--ffmpeg-location', '..\\lib\\ffmpeg.exe', '-o', 'D:\\%(title)s']);
        var result = spawn(path.resolve(path.resolve(), 'src', 'lib', 'youtube-dl.exe'), param);
        result.on('close', (code) => {
            // console.log('child process exited with code :' + code);
            if (code == 0) {
                obj.err = "";
            }
            callback(obj)
        });
        result.stdout.on('data', (data) => {
            var redata = iconvLite.decode(data, 'gbk');
            console.log('stdout: ' + redata);
            obj.data = redata;
        });
        result.stderr.on('data', (data) => {
            console.log('stderr: ' + iconvLite.decode(data, 'gbk'));
            if (data.indexOf("10060") != -1 || data.indexOf("10061") != -1) {
                obj.err = "连接超时，请检查网络或代理。"
            }
            if (data.indexOf("unavailable") != -1 || data.indexOf("truncated") != -1) {
                obj.err = "未找到视频，请检查Url是否正确。"
            }
            reject(new Error(result.stderr.toString()));
        });
        resolve();
    });
};

function startDownload(obj, callback) {
    var param = [];
    var proxy = readJson('ProxyUrl')
    var save = path.normalize(readJson('Save')) + path.sep
    if (proxy) {
        param.push("--proxy")
        param.push(proxy)
    }
    param.push(obj.Url);
    param.push("-o")
    param.push(obj.Name ? save + obj.Name : save + "%(title)s")
    if (obj.Video || obj.Audio) {
        param.push("-f")
        if (obj.Audio && obj.Video) {
            param.push(obj.Video + "+" + obj.Audio)
            param.push("--ffmpeg-location")
            param.push(path.resolve(path.resolve(), 'src', 'lib', 'ffmpeg.exe'))
            param.push("--merge-output-format")
            param.push(obj.Merge ? obj.Merge : "mp4")
        } else {
            param.push(obj.Video ? obj.Video : obj.Audio)
        }
    }
    console.log(param);
    Download(param, callback)
};

function selectDownload(url, callback) {
    var param = [];
    var proxy = readJson('ProxyUrl')
    if (proxy) {
        param.push("--proxy")
        param.push(proxy)
    }
    param.push(url);
    param.push("--list-formats");
    Download(param, callback)
}