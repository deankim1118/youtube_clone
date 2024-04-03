import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
    title: {type:String, required:true, trim:true, maxLength:20 },
    description: {type:String, required:true, trim:true, maxLength:80},
    createdAt: {type: Date, required: true, default: Date.now},
    hashtags: [{type: String, trim: true}],
    meta: {
        views: {type: Number, required: true, default: 0},
        rating: {type: Number, required: true, default: 0},
    },
});

/// ## if you use 'save' you can get document with "this". 
/// ## But if you use 'findOneAndUpdate' then you can't get the document!
/// ## So there's other way which is using "static" it same as python class.method()
// videoSchema.pre('save', async function() {
//     this.hashtags = this.hashtags[0]
//     .split(',')
//     .map((word) => word.startsWith('#') ? word : `#${word.trim()}`);
// });

videoSchema.static('formatHashtags', function(hashtags) {
    return hashtags
    .split(',')
    .map((word) => word.startsWith('#') ? word : `#${word.trim()}`);
});

const Video = mongoose.model('Video', videoSchema);

export default Video;