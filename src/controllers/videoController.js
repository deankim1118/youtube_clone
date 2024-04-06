import Video, { formatHashtags } from '../models/Video';

export const home = async (req, res) => {
  // await Video.find({}).then((videos) => {
  //     console.log("video is available", videos);
  //     return res.render("home", {pageTitle: "Home", videos});
  // })
  // .catch((err) => {
  //     console.log("error : ", err);
  // });

  try {
    const videos = await Video.find({}).sort({ createdAt: -1 });
    // render 1번째 Parameter는 "home.pug" view engine의 파일 이름을 넣어준다.
    // render 2번째에 Parameter에 pug에서 사용할 변수를 보내줄 수 있다. ex) {pageTitle: "Home", userDataObject}
    return res.render('home', { pageTitle: 'Home', videos });
  } catch (err) {
    return console.log('errors : ', err);
  }
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render('404', { pageTitle: 'Video not found' });
  }
  return res.render('watch', { pageTitle: `${video.title} `, video });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render('404', { pageTitle: 'Video not found' });
  }
  return res.render('edit', { pageTitle: `Editing ${video.title}`, video });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.status(404).render('404', { pageTitle: 'Video not found' });
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });

  return res.redirect(`/videos/${id}`);
};

export const getUpload = async (req, res) => {
  return res.render('upload', { pageTitle: `Upload Videos` });
};
export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  try {
    // here we will add a video to the videos array.
    const video = new Video({
      title: title,
      description: description,
      hashtags: Video.formatHashtags(hashtags),
    });
    await video.save();
    return res.redirect('/');
  } catch (err) {
    console.log(err);
    return res.status(400).render('upload', {
      pageTitle: `Upload Videos`,
      errorMessage: err._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  console.log(id);
  // delete video
  await Video.findByIdAndDelete(id);
  return res.redirect('/');
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    // search
    const videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, 'i'),
      },
    });
    return res.render('search', { pageTitle: `Search`, videos });
  }
  return res.render('search', { pageTitle: `Search`, videos });
};
