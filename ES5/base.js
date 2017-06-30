/**
 * 文件上传相关
 */
var resFiles = [];
var resNewFiles = [];
var fileDatasetId = 0;
var resFileIds = {};

// var f = $('input[name=et-file]')[0];
var f = document.getElementById('et-file');

var btn = document.getElementById('et-file-btn');

btn.addEventListener('click', function(e) {
    e.preventDefault();
    f.click();
});

var fragment = null;
var ol = null;
var li = null;
var resWrap = document.getElementById('et-file-wrap');

var resCheckRepeat = function(fileName) {
    for (var i = 0; i < resFiles.length; i++) {
        if (resFiles[i].name == fileName)
            return true;
    }
    return false;
}

var resRemoveFile = function(datasetId) {
    for (var i = 0; i < resFiles.length; i++) {
        if (resFiles[i].datasetId == datasetId) {
            delete resFileIds[resFiles[i].id]; // important!
            resFiles.splice(i, 1);
            f.value = '';
            return 'Remove success';
        }
    }
};

var myAjax = function(fd, file) {
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                var res = JSON.parse(xhr.response);
                resFileIds[res.id] = res.id;
                file.id = res.id;
            } else {
                console.log("Error", xhr.statusText);
            }
        }
    };
    xhr.open('post', '/admin/api/upload/', true);
    xhr.send(fd);
};

var submitNewFiles = function(filesNew) {
    for (var i = 0; i < filesNew.length; i++) {
        var fd = new FormData();
        fd.append('file', filesNew[i]);
        myAjax(fd, filesNew[i]);
    }
};

var resFilesGenerator = function(t, n, files) {
    n = [];
    for (var i = 0; i < files.length; i++) {
        if (!resCheckRepeat(files[i].name)) {
            t.push(files[i]);
            n.push(files[i]);
        }
    }
    // console.log(n)
    // submitNewFiles(n);
};

var btnGenerator = function(file) {
    file.datasetId = fileDatasetId;
    var btn = document.createElement('button');
    btn.dataset.id = fileDatasetId++;
    btn.textContent = 'remove';
    btn.addEventListener('click', (e) => {
        e.preventDefault();
        // console.log(file.datasetId);
        resRemoveFile(file.datasetId);
        btn.parentNode.classList.add('file-fadeOut');
        setTimeout(function() {
            btn.parentNode.remove();
        // 问：是否可以通过 btn，回收其 parentNode(li) 的内存，还是说，当 btn 为 null 时，其 parent 丧失引用，也被回收了？ 也是传值传引用的问题
        // console.log(btn.parentNode);
        // var recyle = btn.parentNode;
        // recyle = null;
        // console.log(recyle);
        // console.log(btn.parentNode);
            btn = null;
        }, 190);
    })
    return btn;
}

var resWrapGenerator = function(files) {
    resWrap.innerHTML = '';
    fragment = document.createDocumentFragment();
    ol = document.createElement('ol');
    for (var i = 0; i < files.length; i++) {
        li = document.createElement('li');
        li.appendChild(document.createTextNode(files[i].name));
        li.appendChild(btnGenerator(files[i]));
        ol.appendChild(li);
    }
    fragment.appendChild(ol);
    resWrap.appendChild(fragment);
}

f.addEventListener('change', () => {
    resFilesGenerator(resFiles, resNewFiles, f.files);
    resWrapGenerator(resFiles);
});

// var arrExtract = function(arr) {
//     var tmpArr = [];
//     R.map(v => {
//         tmpArr.push(v);
//     })(arr);
//     return tmpArr;
// };