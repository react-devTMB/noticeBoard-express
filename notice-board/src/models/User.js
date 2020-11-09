import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, trim: true },
  name: { type: String },
  reg_date: { type: Date, default: Date.now },
  last_login: { type: Date },
  role_id: { type: String, default: 'user' },
});

// virtuals
UserSchema.virtual('passwordConfirmation')
  .get(function () {
    return this._passwordConfirmation;
  })
  .set(function (value) {
    this._passwordConfirmation = value;
  });

UserSchema.virtual('originalPassword')
  .get(function () {
    return this._originalPassword;
  })
  .set(function (value) {
    this._originalPassword = value;
  });

UserSchema.virtual('currentPassword')
  .get(function () {
    return this._currentPassword;
  })
  .set(function (value) {
    this._currentPassword = value;
  });

UserSchema.virtual('newPassword')
  .get(function () {
    return this._newPassword;
  })
  .set(function (value) {
    this._newPassword = value;
  });

// password validation
// const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
// const passwordRegexErrorMessage = 'Should be minimum 8 characters of alphabet and number combination!';

// UserSchema.path('password').validate(function (v) {
//   const user = this;

//   // create user
//   if (user.isNew) {
//     if (!user.passwordConfirmation) {
//       user.invalidate('passwordConfirmation', 'Password Confirmation is required.');
//     }

//     if (!passwordRegex.test(user.password)) {
//       user.invalidate('password', passwordRegexErrorMessage);
//     } else if (user.password !== user.passwordConfirmation) {
//       user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
//     }
//   }

//   // update user
//   if (!user.isNew) {
//     if (!user.currentPassword) {
//       user.invalidate('currentPassword', 'Current Password is required!');
//     } else if (!bcrypt.compareSync(user.currentPassword, user.originalPassword)) {
//       user.invalidate('currentPassword', 'Current Password is invalid!');
//     }

//     if (user.newPassword && !passwordRegex.test(user.newPassword)) {
//       user.invalidate('newPassword', passwordRegexErrorMessage);
//     } else if (user.newPassword !== user.passwordConfirmation) {
//       user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
//     }
//   }
// });
UserSchema.methods.setPassword = async function (password) {
  const hash = await bcrypt.hash(password, 10);
  console.log('password >>> ', password, hash);
  this.password = hash;
};

UserSchema.methods.checkPassword = async function (password) {
  console.log('password >> ' , password, this.password);
  const result = await bcrypt.compareSync(password, this.password)
  return result;
};

UserSchema.statics.findByEmail = async function (email) {
  return this.findOne({ email });
};
// model methods
UserSchema.methods.comparePassword = async function (password) {
  const user = this;
  return await bcrypt.compareSync(password, user.password);
};




UserSchema.pre('save', function (next) {
  const saltRounds = 10;
  const user = this;

  if (!user.isModified('password')) {
    next();
  } else {
    // hash password
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  }
});

const UserModel = mongoose.model('User', UserSchema);
export default UserModel;
