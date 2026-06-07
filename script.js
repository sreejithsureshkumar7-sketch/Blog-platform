const authSection = document.getElementById('authSection');
const createSection = document.getElementById('createSection');
const authTitle = document.getElementById('authTitle');
const nameInput = document.getElementById('nameInput');
const emailInput = document.getElementById('emailInput');
const passwordInput = document.getElementById('passwordInput');
const authBtn = document.getElementById('authBtn');
const switchAuth = document.getElementById('switchAuth');
const logoutBtn = document.getElementById('logoutBtn');
const titleInput = document.getElementById('titleInput');
const contentInput = document.getElementById('contentInput');
const postBtn = document.getElementById('postBtn');
const postsList = document.getElementById('postsList');
const searchInput = document.getElementById('searchInput');

let isLogin = true;
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
let users = JSON.parse(localStorage.getItem('blogUsers')) || [];
let posts = JSON.parse(localStorage.getItem('blogPosts')) || [];

function saveData() {
  localStorage.setItem('blogUsers', JSON.stringify(users));
  localStorage.setItem('blogPosts', JSON.stringify(posts));
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function updateUI() {
  if (currentUser) {
    authSection.classList.add('hidden');
    createSection.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
  } else {
    authSection.classList.remove('hidden');
    createSection.classList.add('hidden');
    logoutBtn.classList.add('hidden');
  }
  renderPosts();
}

function clearAuthInputs() {
  nameInput.value = '';
  emailInput.value = '';
  passwordInput.value = '';
}

function toggleAuthMode() {
  isLogin = !isLogin;
  authTitle.textContent = isLogin ? 'Login' : 'Register';
  authBtn.textContent = isLogin ? 'Login' : 'Register';
  switchAuth.textContent = isLogin ? 'Create account' : 'Already have account?';
  nameInput.classList.toggle('hidden', isLogin);
  clearAuthInputs();
}

function handleAuth() {
  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();

  if (!email || !password || (!isLogin && !name)) {
    alert('Please fill all required fields');
    return;
  }

  if (isLogin) {
    const foundUser = users.find(user => user.email === email && user.password === password);
    if (!foundUser) {
      alert('Invalid email or password');
      return;
    }
    currentUser = foundUser;
  } else {
    const alreadyExists = users.some(user => user.email === email);
    if (alreadyExists) {
      alert('This email already registered');
      return;
    }
    currentUser = { id: Date.now(), name, email, password };
    users.push(currentUser);
  }

  saveData();
  clearAuthInputs();
  updateUI();
}

function createPost() {
  const title = titleInput.value.trim();
  const content = contentInput.value.trim();

  if (!title || !content) {
    alert('Title and content required');
    return;
  }

  posts.unshift({
    id: Date.now(),
    title,
    content,
    author: currentUser.name,
    authorEmail: currentUser.email,
    createdAt: new Date().toLocaleString(),
    comments: []
  });

  titleInput.value = '';
  contentInput.value = '';
  saveData();
  renderPosts();
}

function deletePost(id) {
  const post = posts.find(item => item.id === id);
  if (!post) return;

  if (post.authorEmail !== currentUser.email) {
    alert('You can delete only your own blog');
    return;
  }

  if (confirm('Delete this blog?')) {
    posts = posts.filter(item => item.id !== id);
    saveData();
    renderPosts();
  }
}

function addComment(id) {
  if (!currentUser) {
    alert('Please login to comment');
    return;
  }

  const input = document.getElementById(`comment-${id}`);
  const text = input.value.trim();
  if (!text) return;

  const post = posts.find(item => item.id === id);
  post.comments.push({
    user: currentUser.name,
    text,
    date: new Date().toLocaleString()
  });

  input.value = '';
  saveData();
  renderPosts();
}

function renderPosts() {
  const keyword = searchInput.value.trim().toLowerCase();
  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(keyword) ||
    post.content.toLowerCase().includes(keyword) ||
    post.author.toLowerCase().includes(keyword)
  );

  if (filteredPosts.length === 0) {
    postsList.innerHTML = '<div class="card empty">No blogs found. Create your first blog!</div>';
    return;
  }

  postsList.innerHTML = filteredPosts.map(post => {
    const commentsHTML = post.comments.map(comment => `
      <div class="comment">
        <strong>${escapeHTML(comment.user)}</strong>: ${escapeHTML(comment.text)}
        <br><small>${escapeHTML(comment.date)}</small>
      </div>
    `).join('');

    const deleteButton = currentUser && currentUser.email === post.authorEmail
      ? `<button class="delete-btn" onclick="deletePost(${post.id})">Delete</button>`
      : '';

    const commentBox = currentUser
      ? `<input id="comment-${post.id}" type="text" placeholder="Write comment" />
         <button onclick="addComment(${post.id})">Comment</button>`
      : '<p class="meta">Login to add comment</p>';

    return `
      <article class="card">
        <h2 class="blog-title">${escapeHTML(post.title)}</h2>
        <p class="blog-content">${escapeHTML(post.content)}</p>
        <p class="meta">By ${escapeHTML(post.author)} • ${escapeHTML(post.createdAt)}</p>
        ${deleteButton}
        <h3>Comments</h3>
        ${commentsHTML || '<p class="meta">No comments yet</p>'}
        ${commentBox}
      </article>
    `;
  }).join('');
}

function escapeHTML(text) {
  return String(text).replace(/[&<>'"]/g, char => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&#39;',
    '"': '&quot;'
  }[char]));
}

switchAuth.addEventListener('click', toggleAuthMode);
authBtn.addEventListener('click', handleAuth);
postBtn.addEventListener('click', createPost);
searchInput.addEventListener('input', renderPosts);
logoutBtn.addEventListener('click', () => {
  currentUser = null;
  localStorage.removeItem('currentUser');
  updateUI();
});

updateUI();
