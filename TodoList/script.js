let mockData = JSON.parse(localStorage.getItem('todos')) || [
    { id: Date.now(), isDone: false, content: "React study", date: new Date().toLocaleString() },
    { id: Date.now() + 1, isDone: true, content: "친구 만나기", date: new Date().toLocaleString() },
    { id: Date.now() + 2, isDone: false, content: "낮잠 자기", date: new Date().toLocaleString() },
];

const renderTodos = (data = mockData) => {
    const todoList = document.querySelector('.todo-list');
    todoList.innerHTML = '';
    
    if (data.length === 0) {
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = '할 일이 없습니다. 새로운 할 일을 추가해보세요!';
        todoList.appendChild(emptyMessage);
        return;
    }
    
    data.forEach(todo => {
        const todoItem = document.createElement('div');
        todoItem.className = 'todo-item';
        if (todo.isDone) {
            todoItem.classList.add('done');
        }

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = todo.isDone;
        checkbox.onchange = () => toggleTodoStatus(todo.id);

        const content = document.createElement('div');
        content.className = 'content';
        content.textContent = todo.content;

        const date = document.createElement('div');
        date.className = 'date';
        date.textContent = todo.date;

        const deleteButton = document.createElement('button');
        deleteButton.className = 'delete';
        deleteButton.textContent = '삭제';
        deleteButton.onclick = () => deleteTodo(todo.id);

        todoItem.append(checkbox, content, date, deleteButton);
        todoList.appendChild(todoItem);
    });
};

const addTodo = () => {
    const newTodoInput = document.getElementById('newTodo');
    const content = newTodoInput.value.trim();
    if (!content) return;

    mockData.push({
        id: Date.now(),
        isDone: false,
        content,
        date: new Date().toLocaleString(),
    });

    localStorage.setItem('todos', JSON.stringify(mockData));
    newTodoInput.value = '';
    renderTodos();
};

const toggleTodoStatus = (id) => {
    mockData = mockData.map(todo =>
        todo.id === id ? { ...todo, isDone: !todo.isDone } : todo
    );
    localStorage.setItem('todos', JSON.stringify(mockData));
    filterTodos();
};

const deleteTodo = (id) => {
    mockData = mockData.filter(todo => todo.id !== id);
    localStorage.setItem('todos', JSON.stringify(mockData));
    renderTodos();
};

const filterTodos = () => {
    const keyword = document.getElementById('keyword').value.trim().toLowerCase();
    const sortValue = document.getElementById('sortSelect').value;
    
    let filteredData = [...mockData];
    
    // 키워드로 필터링
    if (keyword) {
        filteredData = filteredData.filter(todo => 
            todo.content.toLowerCase().includes(keyword)
        );
    }
    
    // 완료 상태로 필터링
    if (sortValue === 'active') {
        filteredData = filteredData.filter(todo => !todo.isDone);
    } else if (sortValue === 'completed') {
        filteredData = filteredData.filter(todo => todo.isDone);
    }
    
    renderTodos(filteredData);
};

const searchTodo = (keyword) => {
    filterTodos();
};

const updateCurrentDate = () => {
    const currentDateElement = document.getElementById('currentDate');
    const today = new Date();
    const options = { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' };
    currentDateElement.textContent = today.toLocaleDateString('ko-KR', options);
};

document.querySelector('.Editor button').onclick = addTodo;
document.getElementById('newTodo').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        addTodo();
    }
});
document.getElementById('keyword').addEventListener('input', (e) => searchTodo(e.target.value));
document.getElementById('sortSelect').addEventListener('change', filterTodos);

window.onload = () => {
    updateCurrentDate();
    renderTodos();
};