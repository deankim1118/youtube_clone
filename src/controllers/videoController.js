let videos = [
    {
        title: "First Video", 
        rating: 5, 
        comments:2, 
        createAt: "2 minutes ago",
        views: 1,
        id: 1,
    }, 
    {
        title: "Second Video", 
        rating: 4, 
        comments:21, 
        createAt: "30 minutes ago",
        views: 49,
        id: 2,
    },
    {
        title: "Third Video", 
        rating: 5, 
        comments:2, 
        createAt: "45 minutes ago",
        views: 89,
        id: 3,
    },
];

export const trending = (req, res) => { 
    // render 1번째 Parameter는 "home.pug" view engine의 파일 이름을 넣어준다.
    // render 2번째에 Parameter에 pug에서 사용할 변수를 보내줄 수 있다. ex) {pageTitle: "Home", userDataObject}
    return res.render("home", {pageTitle: "Home", videos});
}; 
export const watch = (req, res) => { 
    const { id } = req.params;
    const video = videos[id-1];
    return res.render("watch", {pageTitle: `Watching ${video.title}`, video});
};
export const getEdit = (req, res) => {
    const { id } = req.params;
    const video = videos[id-1]; 
    return res.render("edit", {pageTitle: `Editing ${video.title}`, video});
};
export const postEdit = (req, res) => { 
    const { id } = req.params;
    const { title } = req.body;
    videos[id-1].title = title;
    return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
    return res.render("upload", {pageTitle: `Upload Videos`});
};
export const postUpload = (req, res) => {
    const { title } = req.body;
    // here we will add a video to the videos array.
    const newVideo = {
        title: title, 
        rating: 3, 
        comments:21, 
        createAt: "Just now",
        views: 18,
        id: videos.length + 1,
    };
    videos.push(newVideo);
    console.log(videos);
    return res.redirect("/");
};