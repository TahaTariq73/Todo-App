"use client"

import { useState } from "react";

const AddTodo = ({ todos, setTodos }) => {
    const [newTodo, setNewTodo] = useState("");
    const [isPosting, setIsPosting] = useState(false);

    const addTodo1 = async () => {
        if (newTodo.trim() === "" || isPosting) return;
        setIsPosting(true);

        let query1 = {
            query: `mutation{addTodo(title:\"${newTodo}\") {_id,title,completed}}`
        }

        const data = await fetch(`${process.env.NEXT_PUBLIC_SERVER_ENDPOINT}/graphql`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(query1),
        }).then(res => res.json()).then(todo => {
            setTodos([...todos, todo.data.addTodo]);                
            setNewTodo("");
            setIsPosting(false);
        }).catch(err => {
            setIsPosting(false);
        })
    }

    return (
        <div className="flex justify-between items-center gap-2 my-4">
            <input type="text" id="large-input" className="block w-full px-4 py-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base" placeholder="Add your task" value={newTodo || ""} onChange={e => setNewTodo(e.target.value)}  />
            
            <button type="button" className="text-white bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 hover:opacity-90  font-medium rounded-lg text-sm px-4 py-3  text-center" onClick={addTodo1}> Add </button>
        </div>
    )
}

export default AddTodo;