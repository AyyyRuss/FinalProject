# FinalProject
Web115 Final Project

I designed the Task Manager as a single-page web app so every required feature could be handled with clear DOM updates and a simple JavaScript data structure.
I stored tasks in an array of objects, which made it easy to add, edit, delete, and toggle completion while keeping the code readable. Each task includes an id, name, priority, importance flag, completion flag, and the date it was created. I used innerHTML to render the task list dynamically inside the required taskmanager div and applied visual changes with JavaScript so important tasks appear in red and completed tasks show a strikethrough. 
I also logged the full task array with JSON.stringify(tasks) after every add, update, and delete action to meet the console requirement.
One challenge was making the interface feel polished without using any frameworks. 
To solve that, I focused on spacing, strong contrast, responsive layout, and clear button states. 
Another challenge was keeping form behavior simple while supporting editing and validation. 
I handled that by reusing the same form for both add and update actions and preventing empty task names. 
Overall, my approach was to build a clean, user-friendly app first, then refine styling and structure so the final result met both the technical requirements and the usability goals.
