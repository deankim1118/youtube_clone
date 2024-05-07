const videoContainer = document.getElementById('videoContainer');
const form = document.getElementById('commentForm');

const addComment = (text) => {
  const videoComments = document.querySelector('.video__comments ul');
  const newComment = document.createElement('li');
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
  const { status } = await fetch(`/api/videos/${video}/comment`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (status === 201) {
    addComment(text);
  }
  textarea.value = '';
};
if (form) {
  form.addEventListener('submit', handleSubmit);
}
