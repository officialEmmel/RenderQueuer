const { dialog } = require('electron').remote;
const { remote, app } = require('electron');
//const path = require('path');
const fs = require('fs');
const {exec} = require("child_process")


var uploadbtn = document.getElementById('upload'); 
var checkbox = document.getElementById('checkbox');
var resetbtn = document.getElementById('reset');
var enterBtn = document.getElementById('enter');
var show = document.getElementById('list_element')

var list = []
var showList = []
var commandList = []
var tmp = ""
let blenderPath = ""
enterBtn.style.display = "none";
reset.style.display = "none";

let win = remote.getCurrentWindow();


global.filepath = undefined;


uploadbtn.addEventListener("click", () => {
    upload()
});
resetbtn.addEventListener("click", () => {
    resetlist()
});
enterBtn.addEventListener("click", () => {
    startRendering()
});

  



function upload()
{
    dialog.showOpenDialog({ 
        title: 'Select Blender files',  
        buttonLabel: 'Add to queue',  
        filters: [ 
            { 
                name: 'Belder files', 
                extensions: ['blend'] 
            }, ], 

        properties: ['openFile', 'multiSelections'] 
    }).then(file => { 

        console.log(file.canceled); 
        if (!file.canceled) { 

          console.log(file.filePaths.length)

          file.filePaths.forEach(element => { 
            list.push(element)
            let tmpList = element.split("\\")
            let tmplength = tmpList.length
            console.log(tmpList[tmplength - 1])
            showList.push(tmpList[tmplength - 1])
          });
         
          list.forEach(element => { 
            tmp = "blender -b " + element + " -a && "
            commandList.push(tmp)
          });
          
          show.innerHTML =  showList.join('<p></p>')

          uploadbtn.innerHTML = "Add more files"

          if(blenderPath !== undefined && commandList !== [])
          {
            enterBtn.style.display = "block";
          }
          else
          {
            enterBtn.style.display = "none";
          }
          reset.style.display = "block";

          console.log(__dirname);
        } 
        else
        {
            return
        }  

    }).catch(err => { 
        console.log(err) 
    });
}


function resetlist()
{
    show.innerHTML =  "No files selected"

    uploadbtn.innerHTML = "Queue files"

    enterBtn.style.display = "none";
    reset.style.display = "none";

    list = []

    commandList = []
}

function startRendering()
{
    win.hide()
    if(checkbox.checked == true)
    {
        
        commandList.push('shutdown /s /t 0')
        let options  = {
            buttons: ["Yes","No"],
            message: "Start rendering?",
            detail: "Your Computer will be shutdowned after finishing the render. So don't forget to save opened projects."
        }
        let response = dialog.showMessageBoxSync(options)
        if(response === 0)
        {
            fs.writeFileSync( remote.app.getPath("userData") + '\\RenderQueuer_startRendering.bat', "color 6 && cd C:\\Program Files\\Blender Foundation\\Blender 2.91 && " + commandList.join(''), function (err) {
                if (err) throw err;
                console.log('Saved!');
            });
              
            
            exec("start cmd @cmd /k " + remote.app.getPath("userData") + "\\RenderQueuer_startRendering.bat && exit", (error, stdout, stderr) => { 
                if (error) {
                    console.log(`error: ${error.message}`);
        
                    return;
                }
                if (stderr) {
                    console.log(`stderr: ${stderr}`);
        
                    return;
                }
                remote.app.exit()
                console.log(`stdout: ${stdout}`);
                
            });
            
            

        }
        else
        {
            win.show()
        }


    }
    else
    {
        win.hide()
        commandList.push('exit') 
        fs.writeFile( remote.app.getPath("userData") + "\\RenderQueuer_startRendering.bat", "color 6 && cd C:/Program Files/Blender Foundation/Blender 2.91 && " + commandList.join(''), function (err) {
            if (err) throw err;
            console.log('Saved!');
        });
          
        
        exec("start cmd @cmd /k " + remote.app.getPath("userData") + "\\RenderQueuer_startRendering.bat && exit", (error, stdout, stderr) => { 
            if (error) {
                console.log(`error: ${error.message}`);
    
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
    
                return;
            }
            remote.app.exit()
        })
    }
}


