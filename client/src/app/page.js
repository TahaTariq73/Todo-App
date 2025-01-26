"use client"

import AddTodo from "@/components/AddTodo";
import { Checkbox } from "@/components/ui/checkbox";
import { Pencil, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [open, setOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState({});
  const [editedTodo, setEditedTodo] = useState("");

  const handleOpenDialog = (action, title) => {
    setCurrentAction(action);
    setEditedTodo(title);
    setOpen(true);
  }

  const deleteTodo = async (id) => {
    if (isDeleting) return;
    setIsDeleting(true);

    let query1 = {
      query: `mutation{deleteTodo(id:\"${id}\") {_id,title,completed}}`
    }

    const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query1),
    }).then(res => res.json()).then(todo => {
      setTodos(prevList => prevList.filter(todo1 => todo1._id !== todo.data.deleteTodo._id))
      setIsDeleting(false);
    }).catch(err => {
      setIsDeleting(false);
    })
  }

  const editTodo = async () => {
    if (editedTodo.trim() === "" || isEditing) return;
    setIsEditing(true);

    let query1 = {
      query: `mutation{editTodo(id:\"${currentAction}\",title:\"${editedTodo}\") {_id,title,completed}}`
    }

    const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query1),
    }).then(res => res.json()).then(todo => {
      let todo2 = todo.data.editTodo;
      
      setTodos(prevList => 
        prevList.map(todo1 => todo1._id == todo2._id ? {
          _id: todo2._id,
          title: editedTodo,
          completed: false
        } : todo1)
      )

      setIsEditing(false);
      setOpen(false);
    }).catch(err => {
      setIsEditing(false);
    })
  }

  const taskCompleted = async (id) => {
    if (isCompleting) return;
    setIsCompleting(true);

    let query1 = {
      query: `mutation{editTodo(id:\"${id}\",completed:true) {_id,title,completed}}`
    }

    const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/graphql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(query1),
    }).then(res => res.json()).then(todo => {
      let todo2 = todo.data.editTodo;

      setTodos(prevList => 
        prevList.map(todo1 => todo1._id == todo2._id ? {
          _id: todo2._id,
          title: todo2.title,
          completed: true
        } : todo1)
      )

      setIsCompleting(false);
    }).catch(err => {
      setIsCompleting(false);
    })
  }

  useEffect(() => {
    async function getTodos() {
      const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/graphql?query={todos{_id,title,completed}}`);
      const todos1 = await data.json();
      setTodos(todos1.data.todos);  
    }

    getTodos();
  }, [])

  return (
    <div className="max-w-[800px] m-auto my-12 px-4 font-[family-name:var(--font-geist-sans)]">
      <h2 className="text-3xl font-bold"> Todo List </h2>

      <AddTodo todos={todos} setTodos={setTodos} />

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[360px]" >
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold"> {todos[currentAction] != undefined && (
              <> {} </>
            )} Edit To-Do </DialogTitle>
            
            <div className="flex justify-between items-center gap-2 pt-4">
                <input type="text" id="large-input" className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base" placeholder="Add your task" value={editedTodo || ""} onChange={e => setEditedTodo(e.target.value)}  />
                
                <button type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:opacity-90  font-medium rounded-lg text-sm px-4 py-3 text-center" onClick={editTodo} disabled={isEditing}> Edit </button>
            </div>              
          </DialogHeader>
        </DialogContent>
      </Dialog>

      <div>
        <div className="relative overflow-x-auto border">
            <table className="w-full text-sm text-left rtl:text-right text-gray-500">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50">
                  <tr>
                    <th scope="col" className="px-2 py-3">
                    </th>

                    <th scope="col" className="px-2 py-3 w-full">
                      Task
                    </th>
                    <th scope="col" className="px-2 py-3 text-center">
                      Edit
                    </th>
                    <th scope="col" className="px-2 py-3 text-right">
                      Delete
                    </th>
                  </tr>
              </thead>

              <tbody>
                {todos && todos.map(todo => (
                  <tr className={`bg-white border-b ${todo.completed ? "pointer-events-none" : ""}`} key={todo._id}>
                    <th scope="row" className="px-2 py-4 font-medium text-gray-900 whitespace-nowrap">
                      <Checkbox checked={todo.completed ? true : false} onClick={() => taskCompleted(todo._id)} />
                    </th>

                    <td className="px-2 py-4 font-semibld text-md ">
                      {todo.completed ? (
                        <del className="text-gray-500"> {todo.title} </del>
                      ) : (
                        <h3 className="text-gray-900">
                        {todo.title}
                        </h3>
                      )}
                    </td>

                    <td className="px-2">
                      <button className="bg-purple-200 p-2 rounded-full transition-all hover:bg-purple-300" onClick={() => handleOpenDialog(todo._id, todo.title)}>
                        <Pencil size={"18px"} color="#8e24aa" />
                      </button>
                    </td>

                    <td className="px-2 text-right">
                      <button className="bg-red-200 p-2 rounded-full transition-all hover:bg-red-300" onClick={() => deleteTodo(todo._id)}>
                        <X size={"18px"} color="red" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
        </div>
      </div>
    </div>
  )
}