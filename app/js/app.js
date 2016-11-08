$(document).foundation()
const dialog = require('electron').remote.dialog
const remote = require('electron').remote
const app = require('electron').remote.app
var fs = require('fs');
edited = false;

$('#text').bind('input propertychange', function() {
	edited = true;
});

// Allow tabbing inside textaera
// code from http://stackoverflow.com/questions/6140632/how-to-handle-tab-in-textarea
// code provided by user primvbdb
$("textarea").keydown(function(e) {
    if(e.keyCode === 9) {
        var start = this.selectionStart;
        var end = this.selectionEnd;

        var $this = $(this);
        var value = $this.val();
        $this.val(value.substring(0, start)
                    + "\t"
                    + value.substring(end));
        this.selectionStart = this.selectionEnd = start + 1;
        edited = true;
        e.preventDefault();
    }
});

function newFile() {
	if(edited === false) {
		document.getElementById("text").value = "";
	} else {
		dialog.showMessageBox(remote.getCurrentWindow(), {
        type: "info",
        buttons: ["No keep it", "Sure"],
        message: "Are you sure you want to make a new file, this will remove everything that isnt saved currently"
    }, function(res) {
    	if(res === 1) {
    		document.getElementById("text").value = "";
    		edited = false;
    	}
    })
	}
	
};


function openFile() {
	if(edited === true) {
		saveFile();
	}
	dialog.showOpenDialog(function (fileNames) {
        // fileNames is an array that contains all the selected
       if(fileNames === undefined){
            console.log("No file selected");
       }else{
            readFile(fileNames[0]);
       }
});

function readFile(filepath){
    fs.readFile(filepath, 'utf-8', function (err, data) {
          if(err){
              alert("An error ocurred reading the file :" + err.message);
              return;
          }
          // Change how to handle the file content
          document.getElementById("text").value = data;

    });
}
}

function saveFile() {
  console.log('test');
  content = $('#text').val();
  dialog.showSaveDialog(function (fileName) {
       if (fileName === undefined){
            console.log("You didn't save the file");
            return;
       }
       // fileName is a string that contains the path and filename created in the save file dialog.  
       fs.writeFile(fileName, content, function (err) {
           if(err){
               dialog.showErrorBox("You Broke It", "An error ocurred creating the file "+ err.message)
           }

           // dialog.showMessageBox({
           //      type: "info",
           //      buttons: ["Ok"],
           //      message: "The file has been succesfully saved"
           //     })
           edited = false;
       });
}); 

}

function beforeQuit() {
	if(edited === true) {
		dialog.showMessageBox(remote.getCurrentWindow(), {
        type: "info",
        buttons: ["No dont quit", "Delete changes"],
        message: "Are you sure you want to quit, you have unsaved changes"
    }, function(res) {
    	if(res === 1) {
    		app.exit();
    	}
    })
	} else {
		app.exit();
	}
	
}