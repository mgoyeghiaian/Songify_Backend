const mongoose = require("mongoose");

const musicListSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  music: {
    type: String,
  },
});

const MusicList = mongoose.model("MusicList", musicListSchema);
module.exports = MusicList;
