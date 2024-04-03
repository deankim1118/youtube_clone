import Video from "../models/Video";


export const home = async (req, res) => { 
    // await Video.find({}).then((videos) => {
    //     console.log("video is available", videos);
    //     return res.render("home", {pageTitle: "Home", videos});
    // })
    // .catch((err) => {
    //     console.log("error : ", err);
    // });
    
    try {
        const videos = await Video.find({});
        // render 1번째 Parameter는 "home.pug" view engine의 파일 이름을 넣어준다.
        // render 2번째에 Parameter에 pug에서 사용할 변수를 보내줄 수 있다. ex) {pageTitle: "Home", userDataObject}
        return res.render("home", {pageTitle: "Home", videos});
    } catch(err) {
        return console.log("errors : ", err);
    }
}; 
export const watch = async (req, res) => { 
    const { id } = req.params;
    const video = await Video.findById(id).exec();
    return res.render("watch", {pageTitle: `Watching `, video});
};
export const getEdit = (req, res) => {
    const { id } = req.params;
    return res.render("edit", {pageTitle: `Editing`});
};
export const postEdit = (req, res) => { 
    const { id } = req.params;
    const { title } = req.body;
    return res.redirect(`/videos/${id}`);
};

export const getUpload = async (req, res) => {
    return res.render("upload", {pageTitle: `Upload Videos`});
};
export const postUpload = async (req, res) => {
    const { title, description, hashtags } = req.body;
    try {
        // here we will add a video to the videos array.
        const video = new Video({
            title: title,
            description: description,
            hashtags: hashtags.split(',').map((word) => `#${word}`),
        });
        await video.save();
        return res.redirect("/");
    } catch(err) {
        console.log(err);
        return res.render("upload", {pageTitle: `Upload Videos`, errorMessage: err._message});
    }
    
};