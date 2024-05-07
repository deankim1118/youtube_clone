const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');

const addComment = (text, id) => {
  const videoComments = document.querySelector('.video__comments ul');
  const newComment = document.createElement('li');
  newComment.dataset.id = id;
  newComment.className = 'video__comment';
  const span = document.createElement('span');
  span.innerText = ` ${text}`;
  newComment.appendChild(span);
  videoComments.prepend(newComment);
};

const handleSubmit = async (event) => {
  event.preventDefault();
  const textarea = form.querySelector('textarea');
  const text = textarea.value;
  const video = videoContainer.dataset.videoId;
  const response = await fetch(`/api/videos/${video}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (response.status === 201) {
    textarea.value = '';
    const { newCommentId } = await response.json();
    addComment(text, newCommentId);
  }
};
if (form) {
  form.addEventListener('submit', handleSubmit);
}
