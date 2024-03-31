

export const trending = (req, res) => { 
    const videos = [{title: "Hello"}, {title: "vidoe2"}];
    // render 1번째 Parameter는 "home.pug" view engine의 파일 이름을 넣어준다.
    // render 2번째에 Parameter에 pug에서 사용할 변수를 보내줄 수 있다. ex) {pageTitle: "Home", userDataObject}
    return res.render("home", {pageTitle: "Home", videos});
} 
export const see = (req, res) => { res.render("watch", {pageTitle: "Watch"});}
export const edit = (req, res) => { res.render("edit", {pageTitle: "Edit"});}
export const search = (req, res) => { res.send("Search Videos");}
export const upload = (req, res) => { res.send("Upload Videos");}
export const deleteVideo = (req, res) => { res.send("Delete Videos");}