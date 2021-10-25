class BaseTaskRequest {
  async getTitle(name) {
    let response = await fetch(this.getUrl(), {
      method: this.getMethodName(),
      headers: {
        "Content-type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(name),
    });
    return response;
  }
}

class PutTaskRequest extends BaseTaskRequest {
  constructor(id) {
    super();
    this.id = id;
  }
  getMethodName() {
    return "PUT";
  }
  getUrl() {
    return `https://todoappexamplejs.herokuapp.com/items/${this.id}`;
  }
}

class PostTaskRequest extends BaseTaskRequest {
  getMethodName() {
    return "POST";
  }

  getUrl() {
    return "https://todoappexamplejs.herokuapp.com/items/";
  }
}

// class DeleteTaskRequest extends BaseTaskRequest {
//   constructor(id) {
//     super();
//     this.id = id;
//   }
//   getMethodName() {
//     return "DELETE";
//   }
//   getUrl() {
//     return `https://todoappexamplejs.herokuapp.com/items/${this.id}`;
//   }
// }

function renderTasks() {
  fetch("https://todoappexamplejs.herokuapp.com/items.json")
    .then((response) => response.json())
    .then((tasks) => {
      let ul = document.querySelector("ul");
      for (let task of tasks) {
        let li = document.createElement("li");
        let div = document.createElement("div");
        div.textContent = JSON.stringify(task.title + " " + task.id);
        li.appendChild(div);
        ul.appendChild(li);
        createDeleteTaskButton(task, li);
        createEditTaskButton(task, li);
        createTaskCategory(li);
      }

      document
        .querySelector("form")
        .addEventListener("submit", async function newNote(e) {
          e.preventDefault();
          let postRequest = new PostTaskRequest();
          let data = await postRequest.getTitle({ title: inputText.value });
          console.log(data);

          createTaskNode();
        });
    });
}

function createTaskNode(task) {
  let li = document.createElement("li");
  let ulList = document.querySelector("ul");
  ulList.appendChild(li);
  li.innerText = inputText.value;
  inputText.value = "";
  createDeleteTaskButton(task, li);
  createEditTaskButton(task, li);
  createTaskCategory(li);
}

function createEditTaskButton(task, li) {
  let editTask = document.createElement("button");
  editTask.innerText = "Edit notes";
  li.appendChild(editTask);

  editTask.addEventListener("click", function editTask(li) {
    let formEditTask = document.createElement("form");
    let inputEditTask = document.createElement("input");
    inputEditTask.type = "text";
    let inputEditTaskSubmit = document.createElement("input");
    inputEditTaskSubmit.type = "submit";
    formEditTask.appendChild(inputEditTask);
    formEditTask.appendChild(inputEditTaskSubmit);
    li.appendChild(formEditTask);

    inputEditTaskSubmit.addEventListener(
      "submit",
      async function editTaskSubmit(event) {
        event.preventDefault(li);
        let request = new PutTaskRequest(task);
        await request.getTitle({ title: inputEditTask.value });
        let li = document.querySelector("li");
        li.appendChild(inputEditTask);
        li.innerText = inputEditTask.value;
      }
    );
  });
}

function createDeleteTaskButton(task, li) {
  let deleteTask = document.createElement("button");
  deleteTask.innerText = "Delete";
  deleteTask.className = "btn btn-danger";
  li.appendChild(deleteTask);
  deleteTask.addEventListener("click", async function deleteTask(event) {
    event.preventDefault(li);
    fetch(task.url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    }).then(() => li.remove());
  });
}

// function createDeleteTaskButton(task, li) {
//   let deleteTask = document.createElement("button");
//   deleteTask.innerText = "Delete";
//   deleteTask.className = "btn btn-danger";
//   li.appendChild(deleteTask);
//   deleteTask.addEventListener("click", async function deleteTask() {
//     let deleteRequest = new DeleteTaskRequest(task);
//     await deleteRequest.getTitle();
//     li.remove();
//   });
// }

function createTaskCategory(li) {
  let select = document.createElement("select");
  let option1 = document.createElement("option");
  let option2 = document.createElement("option");
  option1.innerText = "срочные";
  option2.innerText = "несрочные";
  li.appendChild(select);
  select.appendChild(option1);
  select.appendChild(option2);
}

let inputText = document.querySelector("input");

renderTasks();
