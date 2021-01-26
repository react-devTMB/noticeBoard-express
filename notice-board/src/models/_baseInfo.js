module.exports = {
  creator: { type: String, required: true },
  created_date: { type: Date, requried: true, default: Date.now },
  updater: { type: String, required: true },
  updated_date: { type: Date, requried: true, default: Date.now },
};
