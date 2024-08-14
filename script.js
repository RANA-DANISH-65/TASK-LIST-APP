// Get references to DOM elements by their IDs and classes
const input = document.getElementById("task");
const inputBtn = document.getElementById("inputBtn");
const TaskDiv = document.querySelector(".pending-tasks");
const statesDiv = document.querySelector(".states");

// Log the TaskDiv to check if it's correctly selected
console.log(TaskDiv);

// Retrieve tasks from localStorage or initialize with an empty array if not present
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];

// Function to update the task completion count and animate the display
const updateTaskCount = () => {
    // Count the number of completed tasks
    const count = taskList.filter(task => task.completed).length;

    // Update the task count display in statesDiv
    statesDiv.textContent = `${count}/${taskList.length}`;

    // Remove and re-add the animation class to restart the animation
    statesDiv.classList.remove("animate");
    void statesDiv.offsetWidth; // Trigger reflow to reset the animation
    statesDiv.classList.add("animate");
};

// Function to toggle task completion status when checkbox is clicked
const ToggleTaskCompletion = (e) => {
    // Get the index of the task from the data attribute
    const index = e.target.dataset.index;

    // Update the completion status of the task in taskList
    taskList[index].completed = e.target.checked;

    // Add or remove the "completed" class to the task text based on checkbox status
    if (!e.target.checked) {
        e.target.parentElement.querySelector("p").classList.remove("completed");
    } else {
        e.target.parentElement.querySelector("p").classList.add("completed");
    }

    // Save the updated taskList to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Update the task count
    updateTaskCount();
};

// Function to delete a task when the trash icon is clicked
const deleteTask = (e) => {
    // Get the index of the task to be deleted from the data attribute
    const index = e.target.dataset.index;

    // Remove the task from taskList using splice
    taskList.splice(index, 1);

    // Save the updated taskList to localStorage
    localStorage.setItem("tasks", JSON.stringify(taskList));

    // Render all tasks again to reflect the deletion
    renderAllTasks();

    // Update the task count
    updateTaskCount();
};

// Function to render a single task in the task list
const renderTask = (task, index) => {
    // Create a new div element to hold the task
    const taskDiv = document.createElement("div");
    taskDiv.classList.add("task");

    // Set the inner HTML of the task div with a checkbox, task text, and a trash icon
    taskDiv.innerHTML = `
        <input type="checkbox" ${task.completed ? "checked" : ""} data-index="${index}">
        <p id="task${index}" class="${task.completed ? "completed" : ""}">${task.text}</p>
        <i class="fa-solid fa-trash" data-index="${index}"></i>
    `;

    // Add an event listener to the checkbox to handle task completion toggle
    taskDiv.querySelector("input[type='checkbox']").addEventListener("click", ToggleTaskCompletion);

    // Add an event listener to the trash icon to handle task deletion
    taskDiv.querySelector("i").addEventListener("click", deleteTask);

    // Append the task div to the pending tasks container
    TaskDiv.appendChild(taskDiv);
};

// Function to render all tasks from the taskList array
const renderAllTasks = () => {
    // Clear the TaskDiv before rendering the tasks
    TaskDiv.innerHTML = "";

    // Loop through each task in taskList and render it
    taskList.forEach((task, index) => renderTask(task, index));

    // Update the task count after rendering all tasks
    updateTaskCount();
};

// Function to add a new task to the taskList
const GetTask = () => {
    // Get the task text from the input field and trim any extra spaces
    let task = input.value.trim();

    // Check if the input field is not empty
    if (task !== "") {
        // Add the new task to taskList with completion status set to false
        taskList.push({ text: task, completed: false });

        // Save the updated taskList to localStorage
        localStorage.setItem("tasks", JSON.stringify(taskList));

        // Clear the input field
        input.value = "";

        // Render all tasks to include the new task
        renderAllTasks();
    } else {
        // Show an alert if the input field is empty
        alert("Please Enter A Task");
    }
};

// Event listener to render all tasks when the document has fully loaded
document.addEventListener("DOMContentLoaded", renderAllTasks);

// Event listener to add a new task when the input button is clicked
inputBtn.addEventListener("click", GetTask);
