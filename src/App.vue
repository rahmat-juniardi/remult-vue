<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from "vue";
import { remult } from "remult";
import { Task } from "./shared/Task";

const taskRepo = remult.repo(Task);
const tasks = ref<Task[]>([]);
const newTaskTitle = ref("");

async function addTask() {
  try {
    const newTask = await taskRepo.insert({title: newTaskTitle.value });    
    // tasks.value.push(newTask); commented because has subscribe api
    newTaskTitle.value = "";
  } catch (err: any) {
    alert((err as { message: string}).message);
  }
}

async function saveTask(task: Task) {
  try {
    await taskRepo.save(task)   
  } catch (err: any) {
    alert((err as { message: string}).message);
  }
}

async function deleteTask(task: Task) {
  try {
    await taskRepo.delete(task);
    // tasks.value = tasks.value.filter(t => task !== t); comments because has subscribe api repo
  } catch (err: any) {
    alert((err as { message: string }).message);
  }
}

function doFetchData() {
  taskRepo
    .find({
      limit: 20,
      orderBy: { createdAt: "asc"},
      where: {completed: undefined}
    })
    .then((items) => (tasks.value = items));
}

onMounted(() => {
  // doFetchData();
  onUnmounted(
    taskRepo 
      .liveQuery({
        limit: 20,
        orderBy: {createdAt: "asc" },
        where: {completed: undefined},
      })
      .subscribe(info => (tasks.value = info.applyChanges(tasks.value)))
  )
});

</script>

<template>
  <div class="">
    <h1>todos</h1>
    <main>
      <form @submit.prevent="addTask()">
        <input v-model="newTaskTitle" placeholder="What need to be done?" />
        <button type="submit">Add</button>
      </form>
      <div v-for="task in tasks">
        <input type="checkbox" v-model="task.completed" @change="saveTask(task)" />
        <input v-model="task.title" />
        <button @click="saveTask(task)" >Save</button>        
        <button @click="deleteTask(task)">Delete</button>
      </div>    
    </main>
  </div>
</template>