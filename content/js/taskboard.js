
const Datastore = require('nedb');
const TaskStore = new Datastore({filename:__dirname+"/../../src/db/_db/tasks.db",autoload:true});
function initializeTaskBoard() {

  let urlParams = new URLSearchParams(global.location.search)
  let id = urlParams.get("id")
  
 

 
  let state = {
    todoList: [],
    inprocessList: [],
    qaList: [],
    doneList: [],
  };


  function loadEditData(project_id,afterCallback){
    TaskStore.find({projectId:project_id},(err,docs)=>{


      docs.forEach(doc=>{
        switch(doc.status){
          case "todo":
            state.todoList.push(doc)
            break;
          case "process":
            state.inprocessList.push(doc)
            break;
          case "qa":
            state.qaList.push(doc)
            break;
          case "done":
            state.doneList.push(doc)
            break;
        }
      });
      console.log(docs)
      if(afterCallback){
        afterCallback();
      }
  
    })
  }




  let $todoList = document.querySelector(".task-list-todos");
  let $inprocessList = document.querySelector(".task-list-inprocess");
  let $qaList = document.querySelector(".task-list-qa");
  let $doneList = document.querySelector(".task-list-done");

  let $newTask = document.querySelector(".input-holder .text-input textarea");

  // draging elm
  let $draggingElm = null;

  function renderTaskBoard() {
    clearBoard();
    state.todoList.forEach((task, index) => {
      $todoList.append(taskCardGenerator(task, index, "todo"));
    });
    state.inprocessList.forEach((task, index) => {
      $inprocessList.append(taskCardGenerator(task, index, "process"));
    });
    state.qaList.forEach((task, index) => {
      $qaList.append(taskCardGenerator(task, index, "qa"));
    });
    state.doneList.forEach((task, index) => {
      $doneList.append(taskCardGenerator(task, index, "done"));
    });

    __taskCardDragControl__();
  }

  function clearBoard() {
    $todoList.innerHTML = "";
    $inprocessList.innerHTML = "";
    $qaList.innerHTML = "";
    $doneList.innerHTML = "";
  }

  function taskCardGenerator(task, index, type) {
    //{"projectId":"9YbsZlV2qKn51c4g","taskTitle":"test","status":"todo","_id":"CIOpiEbmxVahJrhP"}
    let taskBoardContainer = document.createElement("div");
    taskBoardContainer.classList = "task-card";
    taskBoardContainer.draggable = true;
    taskBoardContainer.setAttribute("index", index);
    taskBoardContainer.setAttribute("type", type);
    taskBoardContainer.setAttribute("task_id", task._id);
    taskBoardContainer.setAttribute("status", task.status);
    taskBoardContainer.innerText = task.taskTitle;
    return taskBoardContainer;
  }

  function __init__() {
    debugger
    loadEditData(id,()=>{
      console.log(state)
      renderTaskBoard();
    })
  }



  __init__();
  function __taskCardDragControl__() {
    let taskCards = document.querySelectorAll(".task-type-holder .task-card");
    taskCards.forEach((card) => {
      __eventInitializer__(card);
    });

    // todo list
    $todoList.addEventListener("dragover", dragOver);
    $todoList.addEventListener("drop", drop);
    // inprocess list
    $inprocessList.addEventListener("dragover", dragOver);
    $inprocessList.addEventListener("drop", drop);
    // qa list script
    $qaList.addEventListener("dragover", dragOver);
    $qaList.addEventListener("drop", drop);
    // done list script
    $doneList.addEventListener("dragover", dragOver);
    $doneList.addEventListener("drop", drop);
  }
  function __eventInitializer__(card) {
    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);
  }
  function dragStart(e) {
    $draggingElm = e.target;
  }
  function dragEnd(e) {
    $draggingElm = null;
  }
  function dragOver(e){
      e.preventDefault();
  }
  function drop(e) {
    let target = e.target;

    if (target.classList.contains("droparea")) {
      let type = target.attributes.type.value;
      let dragElmType = $draggingElm.attributes.type.value;
  
      switch (dragElmType) {
        case "todo":
          state.todoList.splice($draggingElm.attributes.index.value, 1);
          break;
        case "process":
          state.inprocessList.splice($draggingElm.attributes.index.value, 1);
          break;
        case "qa":
          state.qaList.splice($draggingElm.attributes.index.value, 1);
          break;
        case "done":
          state.doneList.splice($draggingElm.attributes.index.value, 1);
          break;
      }
     

      let status = type;
      let task_id = $draggingElm.attributes.task_id.value;
      let taskTitle = $draggingElm.innerText;
      
      switch (type) {
        case "todos":
          //$draggingElm.innerText
          
        //{"projectId":"9YbsZlV2qKn51c4g","taskTitle":"test","status":"todo","_id":"CIOpiEbmxVahJrhP"}
          TaskStore.update({_id:task_id},{$set:{status:status}},{},(err,docs)=>{
            if(err){
              alert("failed to update")
            }
            console.log(docs)
            if(docs){

              state.todoList.push({taskTitle:taskTitle,projectId:id,_id:task_id,status:status});
              renderTaskBoard();
            }
          })
          break;
        case "process":
          TaskStore.update({_id:task_id},{$set:{status:status}},{},(err,docs)=>{
            if(err){
              alert("failed to update")
            }
            console.log(docs)
            if(docs){

              state.inprocessList.push({taskTitle:taskTitle,projectId:id,_id:task_id,status:status});
              renderTaskBoard();
            }
          })
          break;
        case "qa":
          TaskStore.update({_id:task_id},{$set:{status:status}},{},(err,docs)=>{
              if(err){
                alert("failed to update")
              }
              console.log(docs)
              if(docs){

                state.qaList.push({taskTitle:taskTitle,projectId:id,_id:task_id,status:status});
              renderTaskBoard();
              }
            })
          break;
        case "done":
          TaskStore.update({_id:task_id},{$set:{status:status}},{},(err,docs)=>{
            if(err){
              alert("failed to update")
            }
            console.log(docs)
            if(docs){

              state.doneList.push({taskTitle:taskTitle,projectId:id,_id:task_id,status:status});
              renderTaskBoard();
            }
          })
          break;
      }
      
    } else {
      return;
    }
  }

  function onAddTask(e) {
    
    TaskStore.insert({projectId:id,taskTitle:$newTask.value,status:'todo'},(err,doc)=>{

      if(err){
        alert("failed to save");
      }
      if(doc){
        state.todoList.push(doc);
        $newTask.value = "";
        renderTaskBoard();
      }
    })
  }

  //add task
  document
    .querySelector(".input-holder button")
    .addEventListener("click", onAddTask);
};

initializeTaskBoard();
