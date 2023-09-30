import { Schema, model } from "mongoose"

const VideoSchema = new Schema({
    title: String,
    cloudinary_id: String,
    cloudinary_url: String,
    transcript: String
});

export default model('VideoModel', VideoSchema);

