import { Schema, model } from "mongoose"

const VideoSchema = new Schema({
    tittle: String,
    filename: String,
    transcript: String
});

export default model('VideoModel', VideoSchema);

