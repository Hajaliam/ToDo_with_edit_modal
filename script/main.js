let j = jQuery.noConflict();
j("document").ready(function () {
  //////////////فراخوانی از لوکال استوریج API /////////
  getLocalStorage()
  
  ////////////////تعریف کردن متغیر ها ///////////////
  const todo = j("input#mainInput");
  const addBtn = j(".add");
  const removeBtn = j(".clear");
  let completedDiv = j(".completed");
  let inProgressDiv = j(".in-progress");
  let checkBtn = j(".fa-check");
  let dblCheckBtn = j(".fa-check-double");
  let trashBtn = j(".fa-eraser");
  let defaultColor;
  ///////////////////تعریف فانکشن آیکون های کار//////////

  /////////////فانکشن چک و تعریف آیکون تیک تازه بوجود آمده //////
  function checkBtnUpdater() {
    checkBtn = j(".fa-check");
    checkBtn.click(function (e) {
      e.stopPropagation();
      let todo = j(this).parentsUntil(".status");
      j(todo)
        .find(".icons")
        .children()
        .first()
        .removeClass()
        .addClass("fa-solid fa-check-double");
      let clonedTodo = j(todo).clone();
      clonedTodo.children("i").remove();
      clonedTodo[0].remove();
      inProgressDiv.append(clonedTodo);
      inProgressDiv.children(".icons").remove();
      todo.remove();
      dblCheckBtnUpdater();
      trashBtnUpdater();
      editUpdater();
      setlocalStorage();
    });
    dblCheckBtnUpdater();
  }
  
  ///////////فانکشن دبل چک و تعریف دبل چک بوجود آمده
  function dblCheckBtnUpdater() {
    dblCheckBtn = j(".fa-check-double");
    dblCheckBtn.click(function (e) {
      e.stopPropagation();
      let todo = j(this).parentsUntil(".status");
      j(todo)
        .find(".icons")
        .children()
        .first()
        .removeClass()
        .addClass("fa-solid fa-check-double");
      let clonedTodo = j(todo).clone();
      clonedTodo.children("i").remove();
      clonedTodo[0].remove();
      completedDiv.append(clonedTodo);
      completedDiv.children(".icons").remove();
      completedDiv.find(".fa-check-double").remove();
      todo.remove();
      trashBtnUpdater();
      editUpdater();
      setlocalStorage();
    });
  }
  checkBtnUpdater();
  trashBtnUpdater();
  editUpdater();
  //////////////فانکشن اد کردن///////////
  function Add() {
    let newTodo = j("<div>").addClass("container")
    let span = j("<span>").text(todo.val());
    let iconsSection = j("<div>").addClass("icons");
    let checkIcon = j("<i>").addClass("fa-solid fa-check");
    let delIcon = j("<i>").addClass("fa-solid fa-eraser");
    iconsSection.append(checkIcon);
    iconsSection.append(delIcon);
    newTodo.append(span);
    newTodo.append(iconsSection);
    j(".not-started").append(newTodo);
    todo.val("");
    checkBtnUpdater();
    trashBtnUpdater();
    editUpdater();
    setlocalStorage();
  }
  //////////////فانکشن اد کردن با استفاده از کلیک///////////
  addBtn.click(function () {
    if (todo.val() != "") {
      Add();
    }
  });
  /////////////فانکشن اد کردن با استفاده از اینتر ////////
  todo.keyup(function (e) {
    if (e.key === "Enter") {
      if(todo.val() != ""){
        Add();
      }
    }
  });
  ///////////////////تعریف فانکشن آیکون حذف //////////////
  function trashBtnUpdater() {
    trashBtn = j(".fa-eraser");
    trashBtn.click(function () {
      j(this).parentsUntil(".status").remove();
      setlocalStorage ()
    });
  }
  //////////////////تغریف عملکرد دکمه پاک کردن ////////
  removeBtn.click(function () {
    j("div.status").find(".container").remove();
    localStorage.clear()
  });
  ///////////////////////کد نویسی سکشن مودال //////////

  function editUpdater() {
    j("div.container").on("dblclick", function () {
      let curentWorkObj = j(this);
      let clone;
      let work = j(this).children("span").text();
      let modal = j("div.modal");
      let defaultColor = j('input[type="radio"]:checked').val();
      let status = j("#dropdown").val();
      let xmark = j(".fa-xmark");
      modal.css("top", "0");
      j("#editInput").val(work);
      j("#editInput").css("backgroundColor", defaultColor);
      let item = this;
      /////////ایکس مارک برای بستن مودال ////////////
      xmark.off("click").on("click", function () {
        modal.css("top", "100%");
      });
      ///////////////////////////////////////////////
      j('input[type="radio"]').on("change", function () {
        yeganeh(item);
      });
      /////////////////////////////////////////////
      // yeganeh(this)
      j("#dropdown").on("change", function () {
        status = j("#dropdown").val();
      });
      j(".editBtn")
        .off("click")
        .on("click", function () {
          yegane_2(item)
          clone = curentWorkObj.clone(true);
          defaultColor = j('input[type="radio"]:checked').val();
          j(clone).css("background-color", defaultColor);
          if (status == "false") {
            j(curentWorkObj).children("span").text(j("#editInput").val());
          } else {
            if (status == "not-started") {
              clone.find(".fa-check").off("click");

              if (
                clone.children(".icons").children(".fa-check-double").length ==
                0
              ) {
                clone.find(".fa-check").remove();
                let newIcon = j("<i>").addClass("fa-solid fa-check");
                clone.children(".icons").prepend(newIcon);
              } else {
                clone.find(".fa-check-double").remove();
                let newIcon = j("<i>").addClass("fa-solid fa-check");
                clone.children(".icons").prepend(newIcon);
              }
            }
            if (status == "in-progress") {
              clone.find(".fa-check").off("click");
              if (clone.find(".fa-check").length == 0) {
                clone.find(".fa-check-double").remove();
                let newIcon = j("<i>").addClass("fa-solid fa-check-double");
                clone.children(".icons").prepend(newIcon);
              } else {
                clone
                  .find(".fa-check")
                  .removeClass()
                  .addClass("fa-solid fa-check-double");
              }
            }
            if (status == "completed") {
              // clone.find(".fa-check").off("click")
              clone.find(".fa-check").remove();
              clone.find(".fa-check-double").remove();
            }
            j(clone).children("span").text(j("#editInput").val());
            j("." + status).append(clone);
            curentWorkObj.remove();
          }

          checkBtnUpdater();
          dblCheckBtnUpdater();
          trashBtnUpdater();
          setlocalStorage()
          modal.css("top", "100%");
          j("#defaultOption").prop("selectecd");
        });
    });
    function yeganeh(e) {
      defaultColor = j('input[type="radio"]:checked').val();
      j("#editInput").css("backgroundColor", defaultColor);
      if(defaultColor == "#dbdbdb" || defaultColor == "#ffffff"){
        j("#editInput").css("color", "black");
      }else{
        j("#editInput").css("color", "#fff");
      }
      // })
    }
    function yegane_2(e){
      defaultColor = j('input[type="radio"]:checked').val();


      if (defaultColor == "#198754") {
        // j("#editInput").css("color", "#fff");
        j(e).css("color", "#fff");
        j(e).css("backgroundColor", defaultColor);
      } else if (defaultColor == "#DC3545") {
        // j("#editInput").css("color", "#fff");
        j(e).css("color", "#fff");
        j(e).css("backgroundColor", defaultColor);
      } else if (defaultColor == "#2b7fff") {
        // j("#editInput").css("color", "#fff");
        j(e).css("color", "#fff");
        j(e).css("backgroundColor", defaultColor);
      } else if (defaultColor == "#ffffff") {
        // j("#editInput").css("color", "black");
        j(e).css("color", "black");
        j(e).css("backgroundColor", defaultColor);
      } else if (defaultColor == "#dbdbdb") {
        // j("#editInput").css("color", "black");
        j(e).css("color", "black");
        j(e).css("backgroundColor", defaultColor);
      }
    }
  }
  function setlocalStorage(){
    let works = j(".container")
    ///////////////////////////////////////////////////
    let notStartedWorksArray = []
    let notStartedWorks = works.find(".fa-check").closest(".container")
    notStartedWorks.each(function (){
      
      notStartedWorksArray.push({
        text : j(this).find("span").text() ,
        color : j(this).css("color") ,
        bgColor : j(this).css("backgroundColor")
      })
    })
  
    localStorage.setItem("notStarted",JSON.stringify(notStartedWorksArray))
    ////////////////////////////////////////////
    ///////////////////////////////////////////////////
    let inProgressWorksArray = []
    let inProgressWorks = works.find(".fa-check-double").closest(".container")
    inProgressWorks.each(function (){
      
      inProgressWorksArray.push({
        text : j(this).find("span").text() ,
        color : j(this).css("color") ,
        bgColor : j(this).css("backgroundColor")
      })
      
    })
    localStorage.setItem("inProgress",JSON.stringify(inProgressWorksArray))
    ////////////////////////////////////////////
    ///////////////////////////////////////////
    ///////////////////////////////////////////////////
    let completedWorksArray = []
    let completedWorks = works.find(".icons :first.fa-eraser").closest(".container")
    completedWorks.each(function (){
      
      completedWorksArray.push({
        text : j(this).find("span").text() ,
        color : j(this).css("color") ,
        bgColor : j(this).css("backgroundColor")
      })
      
    })
    localStorage.setItem("completed",JSON.stringify(completedWorksArray))
    ////////////////////////////////////////////
    ///////////////////////////////////////////
  }
  function getLocalStorage(){
    /////////////////////////////////////////////////////
    let notStartedWorks = localStorage.getItem("notStarted")

    notStartedWorks = JSON.parse(notStartedWorks)
    for(let work in notStartedWorks){
      let newTodo = j("<div>").addClass("container");
      let span = j("<span>").text(notStartedWorks[work].text);
      let iconsSection = j("<div>").addClass("icons");
      let checkIcon = j("<i>").addClass("fa-solid fa-check");
      let delIcon = j("<i>").addClass("fa-solid fa-eraser");
      iconsSection.append(checkIcon);
      iconsSection.append(delIcon);
      newTodo.append(span);
      newTodo.append(iconsSection);
      let finalTodo = workColorSet(newTodo , notStartedWorks[work].color, notStartedWorks[work].bgColor)
      j(".not-started").append(finalTodo);
    }
    /////////////////////////////////////////////////////
    let inProgressWorks = localStorage.getItem("inProgress")
    inProgressWorks = JSON.parse(inProgressWorks)
    for(let work in inProgressWorks){
      let newTodo = j("<div>").addClass("container");
      let span = j("<span>").text(inProgressWorks[work].text);
      let iconsSection = j("<div>").addClass("icons");
      let checkIcon = j("<i>").addClass("fa-solid fa-check-double");
      let delIcon = j("<i>").addClass("fa-solid fa-eraser");
      iconsSection.append(checkIcon);
      iconsSection.append(delIcon);
      newTodo.append(span);
      newTodo.append(iconsSection);
      let finalTodo = workColorSet(newTodo , inProgressWorks[work].color, inProgressWorks[work].bgColor)
      j(".in-progress").append(finalTodo);
    }
    /////////////////////////////////////////////////////
    let completedWorks = localStorage.getItem("completed")
    completedWorks = JSON.parse(completedWorks)
    for(let work in completedWorks){
      let newTodo = j("<div>").addClass("container");
      let span = j("<span>").text(completedWorks[work].text);
      let iconsSection = j("<div>").addClass("icons");
      // let checkIcon = j("<i>").addClass("fa-solid fa-check");
      let delIcon = j("<i>").addClass("fa-solid fa-eraser");
      // iconsSection.append(checkIcon);
      iconsSection.append(delIcon);
      newTodo.append(span);
      newTodo.append(iconsSection);
      let finalTodo = workColorSet(newTodo , completedWorks[work].color, completedWorks[work].bgColor)
      j(".completed").append(finalTodo);
    }
  }
  ////////////////////////color functions for loading from LS////////////////
  function workColorSet(elem , color , bgc){
      
    return j(elem).css({
      "color" : color,
      "backgroundColor" : bgc
    })
  }
});