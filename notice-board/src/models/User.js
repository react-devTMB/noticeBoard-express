const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    index: true,
    unique: true,
    required: true,
    validate: [
      (email) => {
        return /^(([^<>()\].,;:\s@"]+(\.[^<>()\].,;:\s@"]+)*)|(".+"))@(([^<>()[\].,;:\s@"]+\.)+[^<>()[\].,;:\s@"]{2,})$/i.test(email);
      },
      '이메일 형식이 아닙니다.',
    ],
  },
  password: {
    type: String,
    required: true,
    validate: [
      (password) => {
        return /^(?=.*[a-zA-Z])(?=.*[^a-zA-Z0-9])(?=.*[0-9]).{8,16}$/.test(password);
      },
      '비밀번호는 8자이상 16자 이하, 영문, 숫자, 특수문자 조합이어야 합니다.',
    ],
  },
  name: {
    type: String,
    trim: true,
    required: true,
    validate: [
      (name) => {
        return name.length > 0 && name.length <= 8;
      },
      '닉네임은 8자 이하만 사용 가능합니다.',
    ],
  },
  created_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  updated_date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  last_login_date: Date,
});

/**
 * virtuals
 */
userSchema
  .virtual('passwordConfirmation')
  .get(function () {
    return this._passwordConfirmation;
  })
  .set(function (value) {
    this._passwordConfirmation = value;
  });

userSchema
  .virtual('originalPassword')
  .get(function () {
    this._originalPassword;
  })
  .set(function (value) {
    this._originalPassword = value;
  });

userSchema
  .virtual('currentPassword')
  .get(function () {
    this._currentPassword;
  })
  .set(function (value) {
    this._currentPassword = value;
  });

userSchema
  .virtual('newPassword')
  .get(function () {
    this._newPassword;
  })
  .set(function (value) {
    this._newPassword = value;
  });

/**
 * custom validation
 */
// userSchema.path('password').validate(function (value) {
//   const user = this;
//   const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
//   const passwordRegexErrorMessage = 'Should be minimum 8 characters of alphabet and number combination!';

//   // create user
//   if (user.isNew) {
//     if (!user.passwordConfirmation) {
//       user.invalidate('passwordConfirm', 'Password Confirmation is required');
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

/**
 * methods
 */
userSchema.methods.comparePassword = function (password) {
  return bcrypt.compareSync(password, this.password);
};

/**
 * pre handler
 */
userSchema.pre('save', function (next) {
  const saltRounds = 10;
  const user = this;

  if (!user.isModified('password')) {
    next();
  } else {
    // hash password
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if (err) {
        next(err);
      }

      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) {
          return next(err);
        }
        user.password = hash;
        next();
      });
    });
  }
});

module.exports = mongoose.model('User', userSchema);
