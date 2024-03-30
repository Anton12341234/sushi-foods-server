import mongoose from 'mongoose';

const Image = new mongoose.Schema({
    url:{type: String}
})

export default mongoose.model('Image', Image)